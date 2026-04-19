param (
    [string[]]$target
)

if (-not $target) {
    Write-Output ""
    Write-Output "Please provide the target file or folder, for example:"
    Write-Output "formating.ps1 target.py"
    Write-Output "formating.ps1 src/ tests/"
    exit 1
}

# Try to locate ruff from virtual environment
$ruffPath = Join-Path $PSScriptRoot "..\.venv\Scripts\ruff.exe"

if (Test-Path $ruffPath) {
    Write-Output ""
    Write-Output "Using ruff from virtual environment:"
    Write-Output "& $ruffPath check $target --fix"
    & $ruffPath check $target --fix
    & $ruffPath format $target
}
elseif (Get-Command ruff -ErrorAction SilentlyContinue) {
    Write-Output ""
    Write-Output "Using globally installed ruff:"
    Write-Output "ruff check $target --fix"
    ruff check $target --fix
    ruff format $target
}
else {
    Write-Output ""
    Write-Output "ruff is not installed. Please run:"
    Write-Output "pip install ruff"
    exit 1
}

Write-Output ""
Write-Output "Formatting complete: $target"
