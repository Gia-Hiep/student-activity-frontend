param(
    # Thư mục project React (chứa package.json)
    [string]$ProjectRoot = "."
)

# Đường dẫn src
$srcRoot = Join-Path $ProjectRoot "src"

# ====== Các folder cần tạo ======
$folders = @(
    "$srcRoot",
    "$srcRoot\api",
    "$srcRoot\components",
    "$srcRoot\components\Layout",
    "$srcRoot\pages",
    "$srcRoot\pages\Auth",
    "$srcRoot\pages\Student",
    "$srcRoot\pages\Admin",
    "$srcRoot\redux",
    "$srcRoot\redux\slices"
)

Write-Host "==> Creating folders..."
foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "Created: $folder"
    } else {
        Write-Host "Exists : $folder"
    }
}

# ====== Các file cần tạo (để trống) ======
$files = @(
    "api\api.js",
    "components\Layout\Header.jsx",
    "components\Layout\Sidebar.jsx",
    "components\ProtectedRoute.jsx",
    "pages\Auth\LoginPage.jsx",
    "pages\Student\Dashboard.jsx",
    "pages\Student\ActivityList.jsx",
    "pages\Student\MyRegistrations.jsx",
    "pages\Student\SubmitEvidence.jsx",
    "pages\Student\MyScore.jsx",
    "pages\Admin\ActivityManagement.jsx",
    "pages\Admin\ApprovalList.jsx",
    "pages\Admin\ReportExport.jsx",
    "redux\slices\authSlice.js",
    "redux\slices\activitySlice.js",
    "redux\store.js",
    "App.jsx",
    "index.js"
)

Write-Host "==> Creating empty files..."
foreach ($relPath in $files) {
    $fullPath = Join-Path $srcRoot $relPath

    if (-not (Test-Path $fullPath)) {
        # Tạo file rỗng
        New-Item -ItemType File -Path $fullPath | Out-Null
        Write-Host "Created: $fullPath"
    } else {
        Write-Host "Exists : $fullPath"
    }
}

Write-Host "==> DONE. React src structure created."
