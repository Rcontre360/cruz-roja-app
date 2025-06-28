#!/bin/bash

# Define the directory to search in
# Default to the current directory if no argument is provided
TARGET_DIR="${1:-.}"

# Define the strings for replacement
OLD_STRING='next/router'
NEW_STRING='next/navigation'

echo "Starting recursive replacement from directory: $TARGET_DIR"
echo "Replacing '$OLD_STRING' with '$NEW_STRING'"
echo "----------------------------------------------------"

# Check if the target directory exists
if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Directory '$TARGET_DIR' not found."
  exit 1
fi

# Find all files and use sed to replace the string
# -type f: Only consider regular files
# -print0: Prints file names separated by a null character,
#          which handles spaces or special characters in filenames correctly.
# xargs -0: Reads null-separated arguments.
# sed -i: Edits files in place.
#   macOS users: 'sed -i ""' or 'sed -i.bak' for a backup.
#   Linux users: 'sed -i' is fine.
# s/$OLD_STRING/$NEW_STRING/g: Substitute all occurrences (g for global)

# Detect OS for sed compatibility
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS (BSD sed) requires an empty string or a file extension for -i
  find "$TARGET_DIR" -type f -print0 | xargs -0 sed -i '' "s|$OLD_STRING|$NEW_STRING|g"
  echo "Replacement complete (macOS sed). Files modified in place."
else
  # Linux (GNU sed)
  find "$TARGET_DIR" -type f -print0 | xargs -0 sed -i "s|$OLD_STRING|$NEW_STRING|g"
  echo "Replacement complete (Linux sed). Files modified in place."
fi

echo "----------------------------------------------------"
echo "All done!"
