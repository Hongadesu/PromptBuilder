if (-not (Test-Path "./.venv")) {
    Write-Host "python virtual environment '.venv' not exists, installing dependencies..."
    python -m venv .venv

    # install dependencies
    ./.venv/Scripts/pip.exe install -r ./backend/requirements.txt
}

if (-not (Test-Path "./node_modules")) {
    Write-Host "node_modules not exists, installing dependencies..."

    # install dependencies
    pnpm install
}

Write-Host "start building..."

# frontend build
pnpm build

# pywebview build
./.venv/Scripts/pyinstaller ./backend/main.py -n "PromptBuilder" -i "./frontend/public/logo.ico" --add-data "pages:pages" --distpath "./release" --noconfirm --noconsole
