# check python virtual environment
if [ ! -d "./.venv" ]; then
    echo "python virtual environment '.venv' not exists, installing dependencies..."
    python3 -m venv .venv

    # install dependencies
    ./.venv/bin/pip install -r ./backend/requirements.txt
fi

PROMPT_BUILDER_ENV=dev ./.venv/bin/python3 ./backend/main.py