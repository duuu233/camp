param([int]$PosterWidth = 1200, [int]$Quality = 85)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$originalRoot = Join-Path $projectRoot '.asset-originals'
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$sharedPosters = @('package-2p', 'package-4p', 'package-4p-mahjong', 'package-6p', 'housekeeping-rules')
$report = @()
foreach ($source in Get-ChildItem -LiteralPath $originalRoot -Filter '*.png' -Recurse -File) {
    $isLogo = $source.BaseName.StartsWith('logo-')
    $isIngredient = $source.Directory.Name -eq 'Ingredients'
    $widthLimit = if ($source.BaseName -eq 'logo-mark') { 192 } elseif ($isLogo) { 512 } elseif ($isIngredient) { 1000 } else { $PosterWidth }
    $imageQuality = if ($isIngredient) { 75 } else { $Quality }
    $folder = if ($isLogo) { 'static' } elseif ($source.Directory.Name -eq 'Ingredients') { 'pages/ingredients/static' } elseif ($sharedPosters -contains $source.BaseName) { 'static/posters' } else { 'pages/packages/static' }
    $extension = if ($isLogo) { '.png' } else { '.jpg' }
    $targetDirectory = Join-Path $projectRoot $folder
    [void][System.IO.Directory]::CreateDirectory($targetDirectory)
    $target = Join-Path $targetDirectory ($source.BaseName + $extension)
    $original = [System.Drawing.Image]::FromFile($source.FullName)
    $scale = [Math]::Min(1.0, [double]$widthLimit / $original.Width)
    $width = [int][Math]::Round($original.Width * $scale)
    $height = [int][Math]::Round($original.Height * $scale)
    $bitmap = [System.Drawing.Bitmap]::new($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    if (!$isLogo) { $graphics.Clear([System.Drawing.Color]::White) }
    $graphics.DrawImage($original, 0, 0, $width, $height)
    if ($isLogo) {
        $bitmap.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
    } else {
        $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
        $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]$imageQuality)
        $bitmap.Save($target, $jpegCodec, $parameters)
        $parameters.Dispose()
    }
    $report += [pscustomobject]@{ File="$folder/$($source.BaseName)$extension"; OriginalBytes=$source.Length; Bytes=(Get-Item -LiteralPath $target).Length; Width=$width; Height=$height }
    $graphics.Dispose()
    $bitmap.Dispose()
    $original.Dispose()
}
$report | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $originalRoot 'compression-report.json') -Encoding utf8
$report | Format-Table -AutoSize
$report | Group-Object { if ($_.File.StartsWith('pages/ingredients')) { 'ingredients' } elseif ($_.File.StartsWith('pages/packages')) { 'packages' } else { 'main' } } | ForEach-Object { [pscustomobject]@{Package=$_.Name; Bytes=($_.Group | Measure-Object Bytes -Sum).Sum} } | Format-Table
