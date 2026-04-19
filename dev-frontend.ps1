if (-not (Test-Path "./node_modules")) {
    Write-Host "node_modules not exists, installing dependencies..."

    # install dependencies
    pnpm install
}

pnpm dev