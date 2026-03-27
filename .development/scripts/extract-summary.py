#!/usr/bin/env python3
"""Extract summary from TypeScript/TSX files.

Usage: extract-summary.py <filepath>
Output: First line of the leading JSDoc or comment block (stdout).

Supports:
  - JSDoc: /** Summary line ... */
  - Line comments: // Summary line (first contiguous block at top of file)
"""

import re
import sys


def extract_summary(filepath: str) -> str:
    try:
        with open(filepath) as f:
            content = f.read()
    except (FileNotFoundError, PermissionError):
        return ""

    # Strip leading whitespace/blank lines
    content = content.lstrip()

    # Try JSDoc block: /** ... */
    jsdoc_match = re.match(r"/\*\*\s*\n?\s*\*?\s*(.+?)(?:\n|\*/)", content)
    if jsdoc_match:
        return jsdoc_match.group(1).strip().rstrip("*").strip()

    # Try single-line JSDoc: /** Summary */
    jsdoc_single = re.match(r"/\*\*\s+(.+?)\s*\*/", content)
    if jsdoc_single:
        return jsdoc_single.group(1).strip()

    # Try leading // comment block (first line only)
    comment_match = re.match(r"//\s*(.+)", content)
    if comment_match:
        line = comment_match.group(1).strip()
        # Skip shebang-like or eslint/prettier directives
        if not line.startswith(("eslint", "prettier", "@ts-", "noinspection")):
            return line

    return ""


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(1)
    result = extract_summary(sys.argv[1])
    if result:
        print(result)
