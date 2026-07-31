import ts from "typescript";
import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const rootDir = new URL("../", import.meta.url).pathname;
const srcDir = join(rootDir, "src");
const allowlist = JSON.parse(
  await readFile(join(rootDir, "scripts", "content-string-allowlist.json"), "utf8")
);
const allowedJsxTextLiterals = new Set(allowlist.jsxTextLiterals || []);
const allowedChildLiterals = new Set(allowlist.jsxChildLiterals || []);
const allowedVisibleAttributeLiterals = new Set(
  allowlist.visibleAttributeLiterals || []
);
const visibleAttributes = new Set(["alt", "aria-label", "placeholder", "title"]);
const templateFiles = [
  ...(await findTsxFiles(join(srcDir, "pages"))),
  ...(await findTsxFiles(join(srcDir, "components"))),
  join(srcDir, "app", "AppShell.tsx")
];
const violations = [];

for (const file of templateFiles) {
  const sourceText = await readFile(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  visit(sourceFile);

  function visit(node) {
    if (
      ts.isJsxText(node) &&
      node.text.trim() &&
      !allowedJsxTextLiterals.has(node.text.trim())
    ) {
      report(node, node.text.trim(), "JSX text");
    }

    if (ts.isJsxAttribute(node) && visibleAttributes.has(node.name.text)) {
      if (node.initializer && ts.isStringLiteral(node.initializer)) {
        const value = node.initializer.text;
        if (
          value &&
          !allowedVisibleAttributeLiterals.has(value)
        ) {
          report(node, value, `visible ${node.name.text} attribute`);
        }
      }
    }

    if (
      ts.isJsxExpression(node) &&
      node.expression &&
      isJsxChildExpression(node)
    ) {
      for (const literal of collectStringLiterals(node.expression)) {
        if (
          literal.trim() &&
          !allowedChildLiterals.has(literal)
        ) {
          report(node, literal, "JSX child expression");
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  function report(node, value, kind) {
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    violations.push(
      `${relative(rootDir, file)}:${position.line + 1} contains ${kind} ${JSON.stringify(value)}`
    );
  }
}

if (violations.length) {
  throw new Error(
    `React templates contain public string literals outside CMS content:\n${violations
      .map((violation) => `- ${violation}`)
      .join("\n")}`
  );
}

console.log(
  `Content ownership check passed for ${templateFiles.length} React templates.`
);

function isJsxChildExpression(node) {
  return ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent);
}

function collectStringLiterals(node) {
  const values = [];
  walk(node);
  return values;

  function walk(child) {
    if (
      child !== node &&
      (ts.isJsxElement(child) ||
        ts.isJsxSelfClosingElement(child) ||
        ts.isJsxFragment(child) ||
        ts.isJsxAttribute(child) ||
        ts.isArrowFunction(child) ||
        ts.isFunctionExpression(child))
    ) {
      return;
    }
    if (ts.isStringLiteral(child) || ts.isNoSubstitutionTemplateLiteral(child)) {
      values.push(child.text);
      return;
    }
    if (ts.isTemplateExpression(child)) {
      values.push(child.head.text);
      for (const span of child.templateSpans) {
        walk(span.expression);
        values.push(span.literal.text);
      }
      return;
    }
    ts.forEachChild(child, walk);
  }
}

async function findTsxFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const childPath = join(path, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findTsxFiles(childPath)));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      files.push(childPath);
    }
  }
  return files.sort();
}
