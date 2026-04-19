# check node environment
if [ ! -d "./node_modules" ]; then
    echo "node_modules not exists, installing dependencies..."

    # install dependencies
    pnpm install
fi

pnpm dev