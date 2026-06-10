@echo off
cd /d "%~dp0"
set "NODE_EXE=node"
where node >nul 2>nul
if errorlevel 1 (
  if exist "C:\Users\DELL\AppData\Local\OpenAI\Codex\bin\node.exe" (
    set "NODE_EXE=C:\Users\DELL\AppData\Local\OpenAI\Codex\bin\node.exe"
  ) else (
    echo No se encontro Node.js en este computador.
    echo Instala Node.js LTS desde https://nodejs.org/ y vuelve a ejecutar este archivo.
    pause
    exit /b 1
  )
)
if exist node_modules\next\dist\bin\next (
  echo Iniciando Achiki en http://localhost:3000
  "%NODE_EXE%" "node_modules\next\dist\bin\next" dev -p 3000
  pause
  exit /b 0
)
if exist ".tools\package\dist\pnpm.mjs" (
  echo Instalando dependencias con pnpm local...
  "%NODE_EXE%" ".tools\package\dist\pnpm.mjs" install --frozen-lockfile
) else (
  where pnpm >nul 2>nul
  if errorlevel 1 (
    echo pnpm no esta instalado. Descargando pnpm local...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $tools=Join-Path (Get-Location) '.tools'; New-Item -ItemType Directory -Path $tools -Force | Out-Null; $meta=Invoke-RestMethod -Uri 'https://registry.npmjs.org/@pnpm/exe'; $latest=$meta.'dist-tags'.latest; $tarball=$meta.versions.$latest.dist.tarball; Invoke-WebRequest -Uri $tarball -OutFile (Join-Path $tools 'pnpm-exe.tgz'); tar -xzf (Join-Path $tools 'pnpm-exe.tgz') -C $tools"
    if not exist ".tools\package\dist\pnpm.mjs" (
      echo No se pudo descargar pnpm.
      pause
      exit /b 1
    )
    echo Instalando dependencias con pnpm local...
    "%NODE_EXE%" ".tools\package\dist\pnpm.mjs" install --frozen-lockfile
  ) else (
    echo Instalando dependencias...
    pnpm install
  )
)
echo Iniciando Achiki en http://localhost:3000
"%NODE_EXE%" "node_modules\next\dist\bin\next" dev -p 3000
pause
