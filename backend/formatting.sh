#!/bin/bash

targets=("$@")

if [ ${#targets[@]} -eq 0 ]; then
    echo ""
    echo "Please provide target file(s) or folder(s), for example:"
    echo "$ bash formating.sh target.py"
    echo "$ bash formating.sh src/ tests/ target.py"
    exit 1
fi

# Try to locate ruff from virtual environment
script_dir="$(cd "$(dirname "$0")" && pwd)"
ruff_path="$script_dir/../.venv/bin/ruff"

if [ -x "$ruff_path" ]; then
    echo ""
    echo "Using ruff from virtual environment:"
    echo "$ $ruff_path check ${targets[*]} --fix"
    echo "$ $ruff_path format ${targets[*]}"
    "$ruff_path" check "${targets[@]}" --fix
    "$ruff_path" format "${targets[@]}"
elif command -v ruff >/dev/null 2>&1; then
    echo ""
    echo "Using globally installed ruff:"
    echo "$ ruff check ${targets[*]} --fix"
    echo "$ ruff format ${targets[*]}"
    ruff check "${targets[@]}" --fix
    ruff format "${targets[@]}"
else
    echo ""
    echo "ruff is not installed. Please run:"
    echo "$ pip install ruff"
    exit 1
fi

echo ""
echo "Formatting complete: ${targets[*]}"
