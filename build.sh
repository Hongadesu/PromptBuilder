#!/bin/bash

# check node environment
if [ ! -d "./node_modules" ]; then
    echo "node_modules not exists, installing dependencies..."

    # install dependencies
    pnpm install
fi

# check python virtual environment
if [ ! -d "./.venv" ]; then
    echo "python virtual environment '.venv' not exists, installing dependencies..."
    python3 -m venv .venv

    # install dependencies
    ./.venv/bin/pip install -r ./backend/requirements.txt
fi

echo "start building..."

# frontend build
pnpm build

# pywebview build
./.venv/bin/pyinstaller ./backend/main.py -n "PromptBuilder" -i "./frontend/public/logo.ico" --add-data "pages:pages" --distpath "./release" --noconfirm --windowed
