# Post-deploy verification for kuebler.fluxlab.agency
param(
  [string]$BaseUrl = "https://kuebler.fluxlab.agency",
  [string]$AssetVersion = "elev-20260805f"
)

$ErrorActionPreference = "Stop"
$fail = 0

function Ok($msg) { Write-Host "OK  $msg" -ForegroundColor Green }
function Bad($msg) { Write-Host "FAIL $msg" -ForegroundColor Red; $script:fail++ }

Write-Host "Verifying $BaseUrl (asset $AssetVersion) ..."

$publicPages = @(
  "/",
  "/about.html",
  "/services.html",
  "/ac-repair.html",
  "/installation-replacement.html",
  "/maintenance.html",
  "/indoor-air-quality.html",
  "/commercial.html",
  "/emergency.html",
  "/specials.html",
  "/financing.html",
  "/service-areas.html",
  "/gallery.html",
  "/faq.html",
  "/blog.html",
  "/videos.html",
  "/contact.html",
  "/careers.html",
  "/coupon-print.html"
)

try {
  $homePage = Invoke-WebRequest -Uri "$BaseUrl/?v=$(Get-Random)" -UseBasicParsing -TimeoutSec 30
} catch {
  Bad "Home request failed: $_"
  exit 1
}

if ($homePage.StatusCode -ne 200) { Bad "Home status $($homePage.StatusCode)" } else { Ok "Home 200" }

$html = $homePage.Content
if ($html -match 'hero--cinematic') { Ok "Cinematic hero markup" } else { Bad "Missing hero--cinematic" }
if ($html -match 'hero--craft') { Ok "Craft hero markup" } else { Bad "Missing hero--craft" }
if ($html -match 'service-install\.jpg') { Ok "Craft install hero image" } else { Bad "Hero not using craft install image" }
if ($html -match 'id="mission"') { Ok "Mission chapter on home" } else { Bad "Missing mission chapter" }
if ($html -match 'data-quote-beat') { Ok "Quote-beat markup" } else { Bad "Missing data-quote-beat" }
if ($html -notmatch 'hero--split') { Ok "No split-hero markup" } else { Bad "Old hero--split still present" }
if ($html -match [regex]::Escape("styles.css?v=$AssetVersion")) { Ok "CSS cache-bust $AssetVersion" } else { Bad "CSS not cache-busted to $AssetVersion" }
if ($html -match [regex]::Escape("main.js?v=$AssetVersion")) { Ok "JS cache-bust $AssetVersion" } else { Bad "JS not cache-busted to $AssetVersion" }
if ($html -match 'rel="canonical"') { Ok "Home has canonical" } else { Bad "Home missing canonical" }
if ($html -match 'og:url') { Ok "Home has og:url" } else { Bad "Home missing og:url" }
if ($html -match 'og:site_name') { Ok "Home has og:site_name" } else { Bad "Home missing og:site_name" }
if ($html -match 'rel="preload"[^>]+fontshare|fontshare[^>]+rel="preload"') { Ok "Fontshare preload" } else {
  if ($html -match 'rel="preload"' -and $html -match 'api\.fontshare\.com') { Ok "Fontshare preload" } else { Bad "Missing Fontshare preload" }
}

# Multi-page 200s
foreach ($path in $publicPages) {
  if ($path -eq "/") { continue }
  try {
    $r = Invoke-WebRequest -Uri "$BaseUrl$path" -UseBasicParsing -TimeoutSec 20
    if ($r.StatusCode -eq 200) { Ok "200 $path" } else { Bad "$path status $($r.StatusCode)" }
  } catch {
    Bad "$path request failed: $_"
  }
}

# robots + sitemap
foreach ($path in @("/robots.txt", "/sitemap.xml")) {
  try {
    $r = Invoke-WebRequest -Uri "$BaseUrl$path" -UseBasicParsing -TimeoutSec 15
    if ($r.StatusCode -eq 200) { Ok "200 $path" } else { Bad "$path status $($r.StatusCode)" }
  } catch {
    Bad "$path request failed: $_"
  }
}

try {
  $robots = (Invoke-WebRequest -Uri "$BaseUrl/robots.txt" -UseBasicParsing -TimeoutSec 15).Content
  if ($robots -match 'Disallow:\s*/compare\.html') { Ok "robots disallows compare.html" } else { Bad "robots missing compare disallow" }
  if ($robots -match 'Sitemap:\s*https://kuebler\.fluxlab\.agency/sitemap\.xml') { Ok "robots Sitemap URL" } else { Bad "robots missing Sitemap" }
} catch {
  Bad "robots content check failed: $_"
}

# Zero wp-content hotlinks across sampled public pages
$hotlinkHits = 0
$samplePaths = @("/", "/gallery.html", "/commercial.html", "/blog.html", "/about.html", "/services.html", "/contact.html")
foreach ($path in $samplePaths) {
  try {
    $uri = if ($path -eq "/") { "$BaseUrl/?v=$(Get-Random)" } else { "$BaseUrl$path" }
    $c = (Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 20).Content
    if ($c -match 'kueblermechanical\.com/wp-content') {
      $hotlinkHits++
      Bad "wp-content hotlink on $path"
    }
  } catch {
    Bad "hotlink scan failed for $path: $_"
  }
}
if ($hotlinkHits -eq 0) { Ok "Zero wp-content hotlinks (sampled pages)" }

$cssUrl = "$BaseUrl/assets/css/styles.css?v=$AssetVersion"
$css = Invoke-WebRequest -Uri $cssUrl -UseBasicParsing -TimeoutSec 30
if ($css.StatusCode -ne 200) { Bad "CSS status $($css.StatusCode)" } else { Ok "CSS 200 ($($css.RawContentLength) bytes)" }
if ($css.Headers['Content-Type'] -match 'text/css') { Ok "CSS Content-Type" } else { Bad "CSS Content-Type: $($css.Headers['Content-Type'])" }

$cssText = $css.Content
foreach ($needle in @('.quote-beat__panel', '.hero--cinematic', '.hero--craft', '.honor-stripe', '.js .reveal', '.mission-chapter', '--navy-950: #040b14')) {
  if ($cssText.Contains($needle)) { Ok "CSS has $needle" } else { Bad "CSS missing $needle" }
}

$js = Invoke-WebRequest -Uri "$BaseUrl/assets/js/main.js?v=$AssetVersion" -UseBasicParsing -TimeoutSec 30
if ($js.Content -match 'classList\.add\("js"\)') { Ok "JS sets html.js" } else { Bad "JS missing html.js boot" }
if ($js.Content -match 'bindCinematicHero') { Ok "JS cinematic binder" } else { Bad "JS missing bindCinematicHero" }
if ($js.Content -match 'bindMissionTimeline') { Ok "JS mission timeline binder" } else { Bad "JS missing bindMissionTimeline" }

$about = Invoke-WebRequest -Uri "$BaseUrl/about.html?v=$(Get-Random)" -UseBasicParsing -TimeoutSec 20
if ($about.Content -match 'honor-timeline') { Ok "About honor timeline" } else { Bad "About missing honor-timeline" }
if ($about.Content -match 'Marine') { Ok "About Marine story" } else { Bad "About missing Marine story" }

if ($fail -gt 0) {
  Write-Host "`n$fail check(s) failed." -ForegroundColor Red
  exit 1
}
Write-Host "`nAll checks passed." -ForegroundColor Green
exit 0
