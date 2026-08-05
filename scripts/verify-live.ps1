# Post-deploy verification for kuebler.fluxlab.agency
param(
  [string]$BaseUrl = "https://kuebler.fluxlab.agency",
  [string]$AssetVersion = "elev-20260805c"
)

$ErrorActionPreference = "Stop"
$fail = 0

function Ok($msg) { Write-Host "OK  $msg" -ForegroundColor Green }
function Bad($msg) { Write-Host "FAIL $msg" -ForegroundColor Red; $script:fail++ }

Write-Host "Verifying $BaseUrl ..."

try {
  $homePage = Invoke-WebRequest -Uri "$BaseUrl/?v=$(Get-Random)" -UseBasicParsing -TimeoutSec 30
} catch {
  Bad "Home request failed: $_"
  exit 1
}

if ($homePage.StatusCode -ne 200) { Bad "Home status $($homePage.StatusCode)" } else { Ok "Home 200" }

$html = $homePage.Content
if ($html -match 'hero--cinematic') { Ok "Cinematic hero markup" } else { Bad "Missing hero--cinematic" }
if ($html -match 'data-quote-beat') { Ok "Quote-beat markup" } else { Bad "Missing data-quote-beat" }
if ($html -notmatch 'hero--split') { Ok "No split-hero markup" } else { Bad "Old hero--split still present" }
if ($html -match [regex]::Escape("styles.css?v=$AssetVersion")) { Ok "CSS cache-bust $AssetVersion" } else { Bad "CSS not cache-busted to $AssetVersion" }
if ($html -match [regex]::Escape("main.js?v=$AssetVersion")) { Ok "JS cache-bust $AssetVersion" } else { Bad "JS not cache-busted to $AssetVersion" }

$cssUrl = "$BaseUrl/assets/css/styles.css?v=$AssetVersion"
$css = Invoke-WebRequest -Uri $cssUrl -UseBasicParsing -TimeoutSec 30
if ($css.StatusCode -ne 200) { Bad "CSS status $($css.StatusCode)" } else { Ok "CSS 200 ($($css.RawContentLength) bytes)" }
if ($css.Headers['Content-Type'] -match 'text/css') { Ok "CSS Content-Type" } else { Bad "CSS Content-Type: $($css.Headers['Content-Type'])" }

$cssText = $css.Content
foreach ($needle in @('.quote-beat__panel', '.hero--cinematic', '.honor-stripe', '.js .reveal', '--navy-950: #040b14')) {
  if ($cssText.Contains($needle)) { Ok "CSS has $needle" } else { Bad "CSS missing $needle" }
}

$js = Invoke-WebRequest -Uri "$BaseUrl/assets/js/main.js?v=$AssetVersion" -UseBasicParsing -TimeoutSec 30
if ($js.Content -match 'classList\.add\("js"\)') { Ok "JS sets html.js" } else { Bad "JS missing html.js boot" }
if ($js.Content -match 'bindCinematicHero') { Ok "JS cinematic binder" } else { Bad "JS missing bindCinematicHero" }

$about = Invoke-WebRequest -Uri "$BaseUrl/about.html?v=$(Get-Random)" -UseBasicParsing -TimeoutSec 20
if ($about.Content -match 'honor-timeline') { Ok "About honor timeline" } else { Bad "About missing honor-timeline" }
if ($about.Content -match 'Marine') { Ok "About Marine story" } else { Bad "About missing Marine story" }

if ($fail -gt 0) {
  Write-Host "`n$fail check(s) failed." -ForegroundColor Red
  exit 1
}
Write-Host "`nAll checks passed." -ForegroundColor Green
exit 0
