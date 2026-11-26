#!/usr/bin/env node
// Removes social post images from public/media/tiktok once Buffer no longer needs them.
//
// Buffer fetches each image from this site when a post goes out, then serves its own copy.
// A media folder (APP/POST/SHA) is therefore kept while any unpublished Buffer post points at
// it, or while it was added within the grace period (a post may still be being created).
// Everything else is removed.
//
//   BUFFER_API_KEY=… BUFFER_ORGANIZATION_ID=… node scripts/prune-social-media.mjs [--apply]
//   BUFFER_POSTS_FILE=posts.json node scripts/prune-social-media.mjs [--apply]
//
// BUFFER_POSTS_FILE is a JSON array of { id, status, assets: [{ source }] } for offline runs.
// Without --apply nothing is deleted. Any doubt about Buffer's answer stops the run before
// anything is deleted.

import { execFileSync } from "node:child_process";
import { appendFileSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

const rootDir = new URL("../", import.meta.url).pathname;
const mediaDir = join(rootDir, "public", "media", "tiktok");
const mediaPathPrefix = "/media/tiktok/";
const siteHosts = new Set(["scruffyhipster.com", "www.scruffyhipster.com"]);
const graceHours = Number(process.env.SOCIAL_MEDIA_GRACE_HOURS ?? "48");
const apply = process.argv.includes("--apply");
const pageSize = 100;
const maxPages = 200;

const summary = [];
function report(line) {
  console.log(line);
  summary.push(line);
}
function stop(message, exitCode = 1) {
  report(`Nothing deleted: ${message}`);
  writeStepSummary();
  process.exit(exitCode);
}
function writeStepSummary() {
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary.join("\n")}\n`);
  }
}

function listMediaFolders(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const folders = entries
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => listMediaFolders(join(dir, entry.name)));
  const holdsFiles = entries.some((entry) => entry.isFile() && !entry.name.startsWith("."));
  if (holdsFiles && dir !== mediaDir) folders.push(dir);
  return folders;
}

function folderKey(folder) {
  return relative(mediaDir, folder).split(sep).join("/");
}

function folderBytes(folder) {
  return readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .reduce((total, entry) => total + statSync(join(folder, entry.name)).size, 0);
}

function lastAddedAt(folder) {
  const output = execFileSync(
    "git",
    ["log", "--diff-filter=A", "--no-renames", "--format=%ct", "-1", "--", relative(rootDir, folder)],
    { cwd: rootDir, encoding: "utf8" }
  ).trim();
  return output ? Number(output) * 1000 : null;
}

async function fetchBufferPosts() {
  if (process.env.BUFFER_POSTS_FILE) {
    return JSON.parse(readFileSync(process.env.BUFFER_POSTS_FILE, "utf8"));
  }
  const apiKey = process.env.BUFFER_API_KEY;
  const organizationId = process.env.BUFFER_ORGANIZATION_ID;
  if (!apiKey) stop("BUFFER_API_KEY is not set.");
  if (!organizationId) stop("BUFFER_ORGANIZATION_ID is not set.");

  const posts = [];
  let after = null;
  for (let page = 0; page < maxPages; page += 1) {
    const afterArgument = after ? `, after: ${JSON.stringify(after)}` : "";
    const query = `query { posts(first: ${pageSize}${afterArgument}, input: { organizationId: ${JSON.stringify(organizationId)} }) { edges { node { id status assets { source } } } pageInfo { hasNextPage endCursor } } }`;
    let response;
    try {
      response = await fetch("https://api.buffer.com", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
    } catch (error) {
      stop(`could not reach Buffer (${error.message}).`);
    }
    if (!response.ok) stop(`Buffer returned HTTP ${response.status}.`);
    const body = await response.json();
    if (body.errors?.length) stop(`Buffer returned an error: ${body.errors.map((error) => error.message).join("; ")}`);
    const connection = body.data?.posts;
    if (!connection || !Array.isArray(connection.edges)) stop("Buffer's response had no list of posts.");
    posts.push(...connection.edges.map((edge) => edge.node));
    if (!connection.pageInfo?.hasNextPage) return posts;
    after = connection.pageInfo.endCursor;
    if (!after) stop("Buffer reported more posts without a cursor.");
  }
  stop(`Buffer returned more than ${maxPages * pageSize} posts.`);
}

function referencedFolderKey(source) {
  let url;
  try {
    url = new URL(source);
  } catch {
    return null;
  }
  if (!siteHosts.has(url.hostname) || !url.pathname.startsWith(mediaPathPrefix)) return null;
  return dirname(decodeURIComponent(url.pathname.slice(mediaPathPrefix.length)));
}

const posts = await fetchBufferPosts();
if (!Array.isArray(posts)) stop("the Buffer post list was not an array.");
const unpublished = posts.filter((post) => post?.status !== "sent");
const neededKeys = new Map();
for (const post of unpublished) {
  const assets = Array.isArray(post.assets) ? post.assets : [];
  for (const asset of assets) {
    if (!asset?.source) stop(`unpublished post ${post.id} (${post.status}) has an image Buffer has not finished storing. Try again later.`, 0);
    const key = referencedFolderKey(asset.source);
    if (key) neededKeys.set(key, `${post.status} post ${post.id}`);
  }
}

const now = Date.now();
const keep = [];
const remove = [];
for (const folder of listMediaFolders(mediaDir)) {
  const key = folderKey(folder);
  const addedAt = lastAddedAt(folder);
  if (neededKeys.has(key)) {
    keep.push(`${key} (${neededKeys.get(key)})`);
  } else if (addedAt === null || now - addedAt < graceHours * 3_600_000) {
    keep.push(`${key} (added in the last ${graceHours} hours)`);
  } else {
    remove.push({ folder, key, bytes: folderBytes(folder) });
  }
}

const existingKeys = new Set(listMediaFolders(mediaDir).map(folderKey));
const missing = [...neededKeys.keys()].filter((key) => !existingKeys.has(key));

const megabytes = (bytes) => `${(bytes / 1_048_576).toFixed(1)} MB`;
const removedBytes = remove.reduce((total, item) => total + item.bytes, 0);
report(`${posts.length} Buffer posts checked, ${unpublished.length} not yet published.`);
report(`Keeping ${keep.length} media folders:`);
keep.forEach((line) => report(`- ${line}`));
if (missing.length) {
  report(`Warning: unpublished posts point at ${missing.length} folders that are no longer here:`);
  missing.forEach((key) => report(`- ${key}`));
}
report(`${apply ? "Removing" : "Would remove"} ${remove.length} folders (${megabytes(removedBytes)}).`);

if (apply) {
  for (const { folder } of remove) {
    rmSync(folder, { recursive: true, force: true });
    let parent = dirname(folder);
    while (parent.startsWith(mediaDir) && parent !== mediaDir && readdirSync(parent).length === 0) {
      rmSync(parent, { recursive: true, force: true });
      parent = dirname(parent);
    }
  }
}
writeStepSummary();
