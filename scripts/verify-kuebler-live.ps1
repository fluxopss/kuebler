# Kuebler deploy verification — run after pushing to kuebler.fluxlab.agency
# Usage: powershell -File scripts/verify-kuebler-live.ps1

param(
  [string]$BaseUrl = "https://kuebler.fluxlab.agency"
)

$ErrorActionPreference = "Stop"
$fail = 0
$cb = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

function Assert-True($cond, $msg) {
  if ($cond) { Write-Host "OK  $msg" -ForegroundColor Green }
  else { Write-Host "FAIL $msg" -ForegroundColor Red; $script:fail++ }
}

Write-Host "Verifying $BaseUrl ..." -ForegroundColor Cyan

$idx = Invoke-WebRequest -Uri "$BaseUrl/?v=$cb" -UseBasicParsing -TimeoutSec 30
Assert-True ($idx.StatusCode -eq 200) "index HTTP 200"
Assert-True ($idx.Content -match "hero--cinematic") "cinematic hero markup"
Assert-True ($idx.Content -match "data-quote-beat") "quote-beat markup"
Assert-True ($idx.Content -notmatch "hero--split") "no legacy split hero"
Assert-True ($idx.Content -match "styles\.css\?v=") "CSS cache-bust query"
Assert-True ($idx.Content -match "main\.js\?v=") "JS cache-bust query"

$cssHref = [regex]::Match($idx.Content, 'href="(assets/css/styles\.css[^"]*)"').Groups[1].Value
$jsHref = [regex]::Match($idx.Content, 'src="(assets/js/main\.js[^"]*)"').Groups[1].Value
Assert-True ($cssHref.Length -gt 0) "found CSS href: $cssHref"
Assert-True ($jsHref.Length -gt 0) "found JS href: $jsHref"

$css = Invoke-WebRequest -Uri "$BaseUrl/$cssHref" -UseBasicParsing -TimeoutSec 30
Assert-True ($css.StatusCode -eq 200) "CSS HTTP 200"
Assert-True ($css.Headers["Content-Type"] -match "text/css") "CSS content-type"
Assert-True ($css.Content -match "quote-beat__panel") "CSS has quote-beat"
Assert-True ($css.Content -match "hero--cinematic") "CSS has cinematic hero"
Assert-True ($css.Content -match "\.js \.reveal") "CSS progressive reveals"
Assert-True ($css.Content -match "--navy-950:\s*#040b14") "elevated navy token"

$js = Invoke-WebRequest -Uri "$BaseUrl/$jsHref" -UseBasicParsing -TimeoutSec 30
Assert-True ($js.StatusCode -eq 200) "JS HTTP 200"
Assert-True ($js.Content -match "bindCinematicHero") "JS cinematic binder"
Assert-True ($js.Content -match 'classList\.add\("js"\)') "JS adds html.js"

$about = Invoke-WebRequest -Uri "$BaseUrl/about.html?v=$cb" -UseBasicParsing -TimeoutSec 30
Assert-True ($about.Content -match "honor-timeline") "about honor timeline"
Assert-True ($about.Content -match "Staff Sergeant") "about USMC story"

if ($fail -gt 0) {
  Write-Host "`n$fail check(s) failed." -ForegroundColor Red
  exit 1
}
Write-Host "`nAll checks passed." -ForegroundColor Green
