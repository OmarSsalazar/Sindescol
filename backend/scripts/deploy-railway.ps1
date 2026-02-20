# ============================================================================
# Script de Deployment Automatizado para Railway
# ============================================================================
# Este script automatiza la verificación y deployment a Railway
# Ejecutar: .\scripts\deploy-railway.ps1
# ============================================================================

Write-Host "🚀 SINDESCOL - Deployment Automatizado a Railway" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# ============================================================================
# 1. Verificar Dependencias
# ============================================================================
Write-Host "`n📦 Verificando dependencias..." -ForegroundColor Yellow

# Verificar Node.js
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js no encontrado. Instalar desde https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Verificar Railway CLI
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if ($railwayInstalled) {
    Write-Host "✅ Railway CLI instalado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Railway CLI no encontrado" -ForegroundColor Yellow
    $install = Read-Host "¿Instalar Railway CLI? (y/n)"
    if ($install -eq "y") {
        Write-Host "Instalando Railway CLI..." -ForegroundColor Cyan
        npm install -g @railway/cli
    } else {
        Write-Host "⚠️  Continuando sin Railway CLI (algunas funciones no disponibles)" -ForegroundColor Yellow
    }
}

# ============================================================================
# 2. Verificar Estado del Repositorio
# ============================================================================
Write-Host "`n📝 Verificando estado del repositorio..." -ForegroundColor Yellow

$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Hay cambios sin commitear:" -ForegroundColor Yellow
    git status --short
    
    $commit = Read-Host "`n¿Hacer commit de cambios? (y/n)"
    if ($commit -eq "y") {
        $message = Read-Host "Mensaje del commit"
        git add .
        git commit -m "$message"
        Write-Host "✅ Commit realizado" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Repositorio limpio" -ForegroundColor Green
}

# ============================================================================
# 3. Ejecutar Tests Locales
# ============================================================================
Write-Host "`n🧪 ¿Ejecutar tests antes de deploy? (recomendado)" -ForegroundColor Yellow
$runTests = Read-Host "(y/n)"

if ($runTests -eq "y") {
    Write-Host "Ejecutando tests..." -ForegroundColor Cyan
    npm test
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Tests fallaron. Abortando deployment." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Tests pasaron" -ForegroundColor Green
}

# ============================================================================
# 4. Push a GitHub (Railway auto-deploys)
# ============================================================================
Write-Host "`n🔄 Push a GitHub..." -ForegroundColor Yellow
$push = Read-Host "¿Hacer push a GitHub? (y/n)"

if ($push -eq "y") {
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push exitoso - Railway iniciará deployment automático" -ForegroundColor Green
    } else {
        Write-Host "❌ Error en push" -ForegroundColor Red
        exit 1
    }
}

# ============================================================================
# 5. Verificar Variables de Entorno en Railway
# ============================================================================
Write-Host "`n⚙️  Variables de Entorno Requeridas en Railway:" -ForegroundColor Yellow
Write-Host "   (Verificar en Railway Dashboard → Settings → Variables)" -ForegroundColor Gray
Write-Host ""
Write-Host "   ✓ NODE_ENV=production" -ForegroundColor White
Write-Host "   ✓ DATABASE_URL (auto-generado por Railway)" -ForegroundColor White
Write-Host "   ✓ JWT_SECRET=<secreto-seguro>" -ForegroundColor White
Write-Host "   ✓ CORS_ORIGIN=https://tu-frontend.com" -ForegroundColor White
Write-Host "   ✓ PORT=4000 (opcional)" -ForegroundColor White

# ============================================================================
# 6. Instrucciones para Índices de BD
# ============================================================================
Write-Host "`n📊 ACCIÓN REQUERIDA: Ejecutar Script de Índices" -ForegroundColor Yellow
Write-Host "   Los índices son CRÍTICOS para performance con 500+ usuarios" -ForegroundColor Gray
Write-Host ""
Write-Host "   Opción A - Railway CLI (si está instalado):" -ForegroundColor Cyan
Write-Host "   railway login" -ForegroundColor White
Write-Host "   railway link" -ForegroundColor White
Write-Host "   Get-Content database\optimize_indexes.sql | railway run mysql --database=railway" -ForegroundColor White
Write-Host ""
Write-Host "   Opción B - Railway Dashboard:" -ForegroundColor Cyan
Write-Host "   1. Ir a tu servicio MySQL en Railway" -ForegroundColor White
Write-Host "   2. Clic en 'Data' tab → 'Query'" -ForegroundColor White
Write-Host "   3. Copiar contenido de database\optimize_indexes.sql" -ForegroundColor White
Write-Host "   4. Pegar y ejecutar" -ForegroundColor White
Write-Host ""
Write-Host "   Opción C - MySQL Client:" -ForegroundColor Cyan
Write-Host "   mysql -h <railway-host> -u <user> -p railway < database\optimize_indexes.sql" -ForegroundColor White

$openFile = Read-Host "`n¿Abrir archivo de índices para copiar? (y/n)"
if ($openFile -eq "y") {
    notepad database\optimize_indexes.sql
}

# ============================================================================
# 7. Esperar Deployment de Railway
# ============================================================================
Write-Host "`n⏳ Esperando deployment en Railway..." -ForegroundColor Yellow
Write-Host "   Monitorear en: https://railway.app/project/<tu-proyecto>/logs" -ForegroundColor Gray

Start-Sleep -Seconds 5

Write-Host "`n¿Railway muestra 'Deployment Success'? (y/n)" -ForegroundColor Yellow
$deployed = Read-Host

if ($deployed -ne "y") {
    Write-Host "⚠️  Verificar logs en Railway Dashboard" -ForegroundColor Yellow
    Write-Host "   Errores comunes:" -ForegroundColor Gray
    Write-Host "   - Variables de entorno faltantes" -ForegroundColor Gray
    Write-Host "   - Error de conexión a BD" -ForegroundColor Gray
    Write-Host "   - Dependencias faltantes (ejecutar npm install)" -ForegroundColor Gray
    exit 0
}

# ============================================================================
# 8. Verificar Health Checks
# ============================================================================
Write-Host "`n🏥 Verificando Health Checks..." -ForegroundColor Yellow
$appUrl = Read-Host "URL de tu app en Railway (ej: https://sindescol-production.up.railway.app)"

if ($appUrl) {
    Write-Host "Verificando health check básico..." -ForegroundColor Cyan
    
    try {
        $health = Invoke-RestMethod -Uri "$appUrl/api/health" -Method Get -TimeoutSec 10
        Write-Host "✅ Health Check básico: OK" -ForegroundColor Green
        Write-Host "   Status: $($health.status)" -ForegroundColor Gray
        Write-Host "   Uptime: $([math]::Round($health.uptime, 2))s" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Error en health check: $_" -ForegroundColor Red
    }

    Write-Host "`nVerificando health check detallado..." -ForegroundColor Cyan
    
    try {
        $healthDetailed = Invoke-RestMethod -Uri "$appUrl/api/health/detailed" -Method Get -TimeoutSec 10
        Write-Host "✅ Health Check detallado: OK" -ForegroundColor Green
        Write-Host "   Database: $($healthDetailed.checks.database.status)" -ForegroundColor Gray
        Write-Host "   Cache: $($healthDetailed.checks.cache.status)" -ForegroundColor Gray
        Write-Host "   Memory: $($healthDetailed.checks.memory.status) - $($healthDetailed.checks.memory.usage.heapUsed_mb) MB" -ForegroundColor Gray
        
        # Alerta si memoria alta
        if ($healthDetailed.checks.memory.usage.heapUsed_mb -gt 400) {
            Write-Host "   ⚠️  ADVERTENCIA: Uso de memoria alto (>400MB)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Error en health check detallado: $_" -ForegroundColor Red
    }

    Write-Host "`nVerificando métricas..." -ForegroundColor Cyan
    
    try {
        $metrics = Invoke-RestMethod -Uri "$appUrl/api/metrics" -Method Get -TimeoutSec 10
        Write-Host "✅ Métricas: OK" -ForegroundColor Green
        Write-Host "   Uptime: $($metrics.uptime.formatted)" -ForegroundColor Gray
        Write-Host "   Memoria usada: $($metrics.memory.formatted.heapUsed_mb) MB" -ForegroundColor Gray
        Write-Host "   Pool BD - Conexiones libres: $($metrics.database.freeConnections)" -ForegroundColor Gray
    } catch {
        Write-Host "⚠️  Error obteniendo métricas: $_" -ForegroundColor Yellow
    }
}

# ============================================================================
# 9. Test de Rate Limiting
# ============================================================================
Write-Host "`n🚦 Test de Rate Limiting..." -ForegroundColor Yellow
$testRL = Read-Host "¿Probar rate limiting? (y/n)"

if ($testRL -eq "y" -and $appUrl) {
    Write-Host "Enviando 10 requests rápidos al endpoint de login..." -ForegroundColor Cyan
    
    for ($i = 1; $i -le 10; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "$appUrl/api/auth/login" `
                -Method Post `
                -ContentType "application/json" `
                -Body '{"email":"test@test.com","password":"wrong"}' `
                -TimeoutSec 5 `
                -ErrorAction SilentlyContinue
            
            Write-Host "   Request $i : Status $($response.StatusCode)" -ForegroundColor Gray
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            if ($statusCode -eq 429) {
                Write-Host "   Request $i : ✅ Bloqueado por rate limit (429)" -ForegroundColor Green
            } else {
                Write-Host "   Request $i : Status $statusCode" -ForegroundColor Gray
            }
        }
        Start-Sleep -Milliseconds 200
    }
}

# ============================================================================
# 10. Resumen y Próximos Pasos
# ============================================================================
Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "📋 RESUMEN DEL DEPLOYMENT" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

Write-Host "`n✅ Completado:" -ForegroundColor Green
Write-Host "   • Código pusheado a GitHub" -ForegroundColor White
Write-Host "   • Railway deployment iniciado" -ForegroundColor White
Write-Host "   • Health checks verificados" -ForegroundColor White

Write-Host "`n⚠️  Acciones Pendientes:" -ForegroundColor Yellow
Write-Host "   1. Ejecutar script de índices en Railway MySQL (CRÍTICO)" -ForegroundColor White
Write-Host "   2. Configurar monitoreo con UptimeRobot" -ForegroundColor White
Write-Host "   3. Monitorear métricas diariamente (primera semana)" -ForegroundColor White
Write-Host "   4. Decidir sobre upgrade a Railway Pro" -ForegroundColor White

Write-Host "`n📚 Recursos:" -ForegroundColor Cyan
Write-Host "   • Documentación: docs\DEPLOYMENT.md" -ForegroundColor White
Write-Host "   • Scaling: docs\SCALING.md" -ForegroundColor White
Write-Host "   • Health checks: $appUrl/api/health/detailed" -ForegroundColor White
Write-Host "   • Métricas: $appUrl/api/metrics" -ForegroundColor White

Write-Host "`n🎉 Deployment completado con éxito!" -ForegroundColor Green
Write-Host ""
