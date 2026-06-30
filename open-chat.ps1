# open-chat.ps1 - the easy way to OPEN the chat from a Windows computer.
#
# The chat app itself runs on your Linux machine (for example "Hermes").
# This little script just opens the chat in your web browser so you don't
# have to remember and re-type the address every day.
#
# How to use it:
#   1. Right-click this file and choose "Run with PowerShell", OR
#   2. Open PowerShell in this folder and run:  .\open-chat.ps1
#
# The first time, it asks for your Linux machine's IP address and remembers
# it. After that, it just opens the chat straight away.

$ErrorActionPreference = "Stop"

# Where we remember the Linux IP between runs (a tiny text file next to this script).
$savedFile = Join-Path $PSScriptRoot "last-ip.txt"
$port = 8080

# Read the saved IP if we have one.
$savedIp = ""
if (Test-Path $savedFile) {
    $savedIp = (Get-Content $savedFile -Raw).Trim()
}

if ($savedIp) {
    $prompt = "Linux IP address [$savedIp]"
} else {
    $prompt = "Linux IP address (for example 192.168.1.50)"
}

$entered = Read-Host $prompt

# If the user just pressed Enter, reuse the saved IP.
if ([string]::IsNullOrWhiteSpace($entered)) {
    $ip = $savedIp
} else {
    $ip = $entered.Trim()
}

if ([string]::IsNullOrWhiteSpace($ip)) {
    Write-Host "No IP address given. Nothing to open." -ForegroundColor Yellow
    exit 1
}

# Remember it for next time.
Set-Content -Path $savedFile -Value $ip

$url = "http://${ip}:${port}"
Write-Host "Opening $url ..." -ForegroundColor Green
Start-Process $url
