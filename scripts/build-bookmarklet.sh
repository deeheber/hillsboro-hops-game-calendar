#!/bin/bash
# Builds src/bookmarklet.js into a javascript: URI for use as a bookmarklet.
# Output: dist/bookmarklet.txt
set -e

cd "$(dirname "$0")/.."
mkdir -p dist

if command -v npx &> /dev/null; then
  echo "Using terser for minification..."
  minified=$(npx --yes terser src/bookmarklet.js --compress --mangle)
else
  echo "terser not found, using basic minification..."
  minified=$(
    sed 's|//.*$||' src/bookmarklet.js \
    | sed '/^[[:space:]]*$/d' \
    | sed 's/^[[:space:]]*//' \
    | tr '\n' ' ' \
    | sed 's/  */ /g'
  )
fi

# Strip trailing semicolon so it's valid inside void()
minified="${minified%;}"

echo "javascript:void(${minified})" > dist/bookmarklet.txt

echo ""
echo "Bookmarklet written to dist/bookmarklet.txt"
echo "Size: $(wc -c < dist/bookmarklet.txt | tr -d ' ') bytes"
echo ""
echo "Copy the contents of dist/bookmarklet.txt and use it as a bookmark URL."
