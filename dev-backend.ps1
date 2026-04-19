if (-not (Test-Path "./.venv")) {
    Write-Host "python virtual environment '.venv' not exists, installing dependencies..."
    python -m venv .venv

    # install dependencies
    ./.venv/Scripts/pip.exe install -r ./backend/requirements.txt
}

$env:PROMPT_BUILDER_ENV = "dev";
try {
    ./.venv/Scripts/python.exe ./backend/main.py
}
finally {
    Remove-Item env:PROMPT_BUILDER_ENV -ErrorAction SilentlyContinue
}
