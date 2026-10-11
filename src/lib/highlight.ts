import type { ReactNode } from "react";
import { createElement } from "react";

/** Tokenize a single macro line into colored spans. */
export function highlightLine(line: string): ReactNode[] {
  if (line.startsWith("#")) {
    return [
      createElement(
        "span",
        { key: "c", className: "text-rust" },
        line,
      ),
    ];
  }

  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const command = line.match(/^\/[a-zA-Z]+/);
  if (command) {
    nodes.push(
      createElement(
        "span",
        { key: key++, className: "text-accent" },
        command[0],
      ),
    );
    i = command[0].length;
  }

  while (i < line.length) {
    if (line[i] === "[") {
      const end = line.indexOf("]", i);
      if (end === -1) {
        nodes.push(line.slice(i));
        break;
      }
      nodes.push(
        createElement(
          "span",
          { key: key++, className: "text-warn" },
          line.slice(i, end + 1),
        ),
      );
      i = end + 1;
      continue;
    }
    const next = line.indexOf("[", i);
    const chunk = next === -1 ? line.slice(i) : line.slice(i, next);
    if (chunk) {
      nodes.push(
        createElement(
          "span",
          { key: key++, className: "text-fg" },
          chunk,
        ),
      );
    }
    if (next === -1) break;
    i = next;
  }

  return nodes;
}
