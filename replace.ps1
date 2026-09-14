$files = Get-ChildItem -Path . -Recurse -File -Exclude node_modules,.next,.git,*.svg,*.ico,*.png,*.jpg,*.sql
foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        if ($content -match 'BashaLagbe|BashaLagbe|BashaLagbe|BashaLagbe|logo-nest') {
            $newContent = $content -replace 'BashaLagbe', 'BashaLagbe' `
                                   -replace 'BashaLagbe', 'bashalagbe' `
                                   -replace 'BashaLagbe', 'BashaLagbe' `
                                   -replace 'BashaLagbe', 'bashalagbe' `
                                   -replace '<span className="logo-uiu">Basha</span><span className="logo-nest">Lagbe</span>', '<span className="logo-uiu">Basha</span><span className="logo-nest">Lagbe</span>'
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        }
    } catch {}
}

