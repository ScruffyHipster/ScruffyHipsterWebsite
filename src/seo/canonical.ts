export function canonicalPath(path: string) {
  return path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
}

export function canonicalUrl(path: string, siteUrl: string) {
  const resolvedPath = canonicalPath(path);
  return `${siteUrl}${resolvedPath === "/" ? "" : resolvedPath}`;
}
