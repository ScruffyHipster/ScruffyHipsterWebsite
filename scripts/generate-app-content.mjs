import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const rootDir = new URL("../", import.meta.url).pathname;
const generatedDir = join(rootDir, "src", "generated");
const ratingFallbackPath = join(rootDir, "src", "content", "rewireAppStoreRatingFallback.json");
const rewireAppId = "6757722922";
const storeCountry = process.env.APP_STORE_COUNTRY || "us";
const contentCollections = [
  {
    sourceDir: join(rootDir, "content", "rewire-blog"),
    outputFile: "rewire-blog.json",
    defaultOgImage: "/assets/rewire/app-store/rewire-icon.jpg"
  },
  {
    sourceDir: join(rootDir, "content", "breastfeeding-tracker", "guides"),
    outputFile: "breastfeeding-tracker-guides.json",
    defaultOgImage: "/assets/breastfeeding-tracker-og.png"
  }
];

await mkdir(generatedDir, { recursive: true });
for (const collection of contentCollections) {
  await generateContentCollection(collection);
}
await generateRating();

async function generateContentCollection({ sourceDir, outputFile, defaultOgImage }) {
  const files = existsSync(sourceDir)
    ? (await readdir(sourceDir)).filter((file) => file.endsWith(".md")).sort()
    : [];

  const posts = [];
  for (const file of files) {
    const slug = basename(file, ".md");
    const source = await readFile(join(sourceDir, file), "utf8");
    const { frontmatter, body } = parseFrontmatter(source);
    const draft = parseBoolean(frontmatter.draft);

    if (!frontmatter.title || !frontmatter.description || !frontmatter.publishedAt) {
      throw new Error(`${file} must include title, description, and publishedAt frontmatter.`);
    }

    const faqItems = extractFaqItems(body);
    posts.push({
      slug,
      title: frontmatter.title,
      metaTitle: frontmatter.metaTitle || null,
      description: frontmatter.description,
      publishedAt: frontmatter.publishedAt,
      updatedAt: frontmatter.updatedAt || null,
      excerpt: frontmatter.excerpt || frontmatter.description,
      tags: parseTags(frontmatter.tags),
      draft,
      ogImage: frontmatter.ogImage || defaultOgImage,
      ogImageAlt: frontmatter.ogImageAlt || null,
      faqItems,
      showDefaultCta:
        frontmatter.showDefaultCta === undefined
          ? true
          : parseBoolean(frontmatter.showDefaultCta),
      html: renderMarkdown(body)
    });
  }

  const publishedPosts = posts
    .filter((post) => !post.draft)
    .sort((a, b) => compareDatesDescending(a.publishedAt, b.publishedAt));

  await writeJson(join(generatedDir, outputFile), {
    generatedAt: new Date().toISOString(),
    posts: publishedPosts
  });
}

async function generateRating() {
  const fallback = await readJson(ratingFallbackPath);
  let rating = { ...fallback, source: "fallback" };

  try {
    const url = `https://itunes.apple.com/lookup?id=${rewireAppId}&country=${encodeURIComponent(storeCountry)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) {
      throw new Error(`Apple lookup returned ${response.status}`);
    }

    const payload = await response.json();
    const result = payload.results?.[0];
    if (!result) {
      throw new Error("Apple lookup returned no result");
    }

    rating = {
      rating: typeof result.averageUserRating === "number" ? result.averageUserRating : null,
      ratingCount: typeof result.userRatingCount === "number" ? result.userRatingCount : null,
      storeUrl: result.trackViewUrl || fallback.storeUrl,
      source: "apple-lookup",
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.warn(`Using fallback Rewire App Store rating: ${error.message}`);
  }

  await writeJson(join(generatedDir, "rewire-app-store-rating.json"), rating);
}

function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) {
    return { frontmatter: {}, body: source };
  }

  const end = source.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error("Markdown frontmatter is not closed.");
  }

  const rawFrontmatter = source.slice(4, end).trim();
  const body = source.slice(end + 4).trim();
  const frontmatter = {};

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }

    const separator = line.indexOf(":");
    if (separator === -1) {
      throw new Error(`Invalid frontmatter line: ${line}`);
    }

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    frontmatter[key] = stripQuotes(rawValue);
  }

  return { frontmatter, body };
}

function renderMarkdown(source) {
  const blocks = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(`<pre><code${language ? ` class="language-${escapeAttr(language)}"` : ""}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length + 1;
      blocks.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines = [];
      while (index < lines.length && lines[index].startsWith("> ")) {
        quoteLines.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push(`<blockquote>${quoteLines.map(renderInline).join("<br />")}</blockquote>`);
      continue;
    }

    if (isTableStart(lines, index)) {
      const headers = splitTableRow(lines[index]);
      const rows = [];
      index += 2;
      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      blocks.push(renderTable(headers, rows));
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(`<li>${renderInline(lines[index].replace(/^[-*]\s+/, ""))}</li>`);
        index += 1;
      }
      blocks.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(`<li>${renderInline(lines[index].replace(/^\d+\.\s+/, ""))}</li>`);
        index += 1;
      }
      blocks.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const paragraphLines = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("```") &&
      !/^(#{1,3})\s+/.test(lines[index]) &&
      !lines[index].startsWith("> ") &&
      !isTableStart(lines, index) &&
      !/^[-*]\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push(`<p>${renderInline(paragraphLines.join(" "))}</p>`);
  }

  return blocks.join("\n");
}

function isTableStart(lines, index) {
  if (index + 1 >= lines.length || !isTableRow(lines[index])) {
    return false;
  }
  const separatorCells = splitTableRow(lines[index + 1]);
  return separatorCells.length > 0 && separatorCells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isTableRow(line) {
  return line.trim().includes("|");
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderTable(headers, rows) {
  const headerHtml = headers
    .map((header) => `<th scope="col">${renderInline(header)}</th>`)
    .join("");
  const bodyHtml = rows
    .map((row) => {
      const cells = headers.map((_, index) => `<td>${renderInline(row[index] || "")}</td>`);
      return `<tr>${cells.join("")}</tr>`;
    })
    .join("");
  return `<div class="feeding-table-scroll" tabindex="0" role="region" aria-label="Scrollable comparison table"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

function extractFaqItems(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const faqHeadingIndex = lines.findIndex((line) => /^#{1,3}\s+FAQs\s*$/i.test(line.trim()));
  if (faqHeadingIndex === -1) {
    return [];
  }

  const sectionLevel = lines[faqHeadingIndex].match(/^#+/)?.[0].length || 1;
  const items = [];
  let currentQuestion = null;
  let answerLines = [];

  const commitItem = () => {
    if (!currentQuestion) {
      return;
    }
    const answer = stripMarkdownFormatting(answerLines.join(" "));
    if (!answer) {
      throw new Error(`FAQ question "${currentQuestion}" has no visible answer.`);
    }
    items.push({ question: currentQuestion, answer });
  };

  for (let index = faqHeadingIndex + 1; index < lines.length; index += 1) {
    const heading = lines[index].match(/^(#{1,3})\s+(.+)$/);
    if (heading && heading[1].length <= sectionLevel) {
      break;
    }
    if (heading) {
      commitItem();
      currentQuestion = stripMarkdownFormatting(heading[2]);
      answerLines = [];
      continue;
    }
    if (currentQuestion && lines[index].trim()) {
      answerLines.push(lines[index].trim());
    }
  }
  commitItem();
  return items;
}

function stripMarkdownFormatting(value) {
  return String(value)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_~`>#]/g, "")
    .replace(/^\s*(?:[-*]|\d+\.)\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function renderInline(value) {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  output = output.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  output = output.replace(/\[([^\]]+)\]\((\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
  return output;
}

function parseTags(value) {
  if (!value) {
    return [];
  }
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}

function parseBoolean(value) {
  return String(value).toLowerCase() === "true";
}

function compareDatesDescending(a, b) {
  return new Date(b).getTime() - new Date(a).getTime();
}

function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, "");
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}
