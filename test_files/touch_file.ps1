# PowerShell helper to touch a file
param(
  [string]$path
)
if (-not (Test-Path $path)) {
  New-Item -Path $path -ItemType File -Force | Out-Null
} else {
  (Get-Item $path).LastWriteTime = Get-Date
}
Write-Output "Touched $path"
