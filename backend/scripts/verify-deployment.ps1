# ============================================================================
# Script de Verificación Post-Deployment
# ============================================================================
# Verifica que todas las optimizaciones estén funcionando correctamente
# ============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$AppUrl
)

Write-Host "🔍 SINDESCOL - Verificación Post-Deployment" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "URL: $AppUrl" -ForegroundColor White
Write-Host ""

$passed = 0
$failed = 0
$warnings = 0

# ============================================================================
# Test 1: Health Check Básico
# ============================================================================
Write-Host "🏥 Test 1: Health Check Básico..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "$AppUrl/api/health" -Method Get -TimeoutSec 10
    
    if ($health.status -eq "healthy") {
        Write-Host "   ✅ PASS: Servidor respondiendo correctamente" -ForegroundColor Green
        Write-Host "      Uptime: $([math]::Round($health.uptime, 2))s" -ForegroundColor Gray
        $passed++
    } else {
        Write-Host "   ❌ FAIL: Status no es 'healthy': $($health.status)" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host "   ❌ FAIL: No se puede conectar al servidor" -ForegroundColor Red
    Write-Host "      Error: $_" -ForegroundColor Gray
    $failed++
}

# ============================================================================
# Test 2: Health Check Detallado
# ============================================================================
Write-Host "`n🏥 Test 2: Health Check Detallado..." -ForegroundColor Yellow

try {
    $healthDetailed = Invoke-RestMethod -Uri "$AppUrl/api/health/detailed" -Method Get -TimeoutSec 10
    
    # Check Database
    if ($healthDetailed.checks.database.status -eq "healthy") {
        Write-Host "   ✅ PASS: Conexión a BD funcionando" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "   ❌ FAIL: Problema con BD: $($healthDetailed.checks.database.message)" -ForegroundColor Red
        $failed++
    }
    
    # Check Cache
    if ($healthDetailed.checks.cache.status -eq "healthy") {
        Write-Host "   ✅ PASS: Caché funcionando" -ForegroundColor Green
        Write-Host "      Keys: $($healthDetailed.checks.cache.stats.keys)" -ForegroundColor Gray
        $passed++
    } else {
        Write-Host "   ⚠️  WARNING: Caché no óptimo" -ForegroundColor Yellow
        $warnings++
    }
    
    # Check Memory
    $memUsed = $healthDetailed.checks.memory.usage.heapUsed_mb
    if ($memUsed -lt 400) {
        Write-Host "   ✅ PASS: Uso de memoria OK ($memUsed MB < 400 MB)" -ForegroundColor Green
        $passed++
    } elseif ($memUsed -lt 480) {
        Write-Host "   ⚠️  WARNING: Uso de memoria alto ($memUsed MB)" -ForegroundColor Yellow
        Write-Host "      Límite Railway Hobby: 500 MB" -ForegroundColor Gray
        $warnings++
    } else {
        Write-Host "   ❌ FAIL: Uso de memoria crítico ($memUsed MB > 480 MB)" -ForegroundColor Red
        $failed++
    }
    
} catch {
    Write-Host "   ❌ FAIL: Error obteniendo health detallado: $_" -ForegroundColor Red
    $failed++
}

# ============================================================================
# Test 3: Métricas del Sistema
# ============================================================================
Write-Host "`n📊 Test 3: Métricas del Sistema..." -ForegroundColor Yellow

try {
    $metrics = Invoke-RestMethod -Uri "$AppUrl/api/metrics" -Method Get -TimeoutSec 10
    
    Write-Host "   ✅ PASS: Métricas accesibles" -ForegroundColor Green
    Write-Host "      Uptime: $($metrics.uptime.formatted)" -ForegroundColor Gray
    Write-Host "      Memoria: $($metrics.memory.formatted.heapUsed_mb) MB" -ForegroundColor Gray
    Write-Host "      Pool BD - Libres: $($metrics.database.freeConnections)" -ForegroundColor Gray
    
    # Verificar conexiones disponibles
    if ($metrics.database.freeConnections -gt 5) {
        Write-Host "   ✅ PASS: Suficientes conexiones BD disponibles" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "   ⚠️  WARNING: Pocas conexiones BD disponibles ($($metrics.database.freeConnections))" -ForegroundColor Yellow
        $warnings++
    }
    
    $passed++
} catch {
    Write-Host "   ❌ FAIL: Error obteniendo métricas: $_" -ForegroundColor Red
    $failed++
}

# ============================================================================
# Test 4: Rate Limiting
# ============================================================================
Write-Host "`n🚦 Test 4: Rate Limiting (Login)..." -ForegroundColor Yellow

$blocked = $false
$requestCount = 0

for ($i = 1; $i -le 7; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "$AppUrl/api/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body '{"email":"test@test.com","password":"wrong"}' `
            -TimeoutSec 5 `
            -ErrorAction Stop
        
        $requestCount++
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 429) {
            $blocked = $true
            Write-Host "   ✅ PASS: Rate limiting bloqueó en intento $i" -ForegroundColor Green
            break
        }
        $requestCount++
    }
    Start-Sleep -Milliseconds 200
}

if ($blocked) {
    $passed++
} elseif ($requestCount -eq 7) {
    Write-Host "   ⚠️  WARNING: Rate limiting no bloqueó después de 7 intentos" -ForegroundColor Yellow
    Write-Host "      Verificar configuración en rateLimiter.js" -ForegroundColor Gray
    $warnings++
} else {
    Write-Host "   ❌ FAIL: Rate limiting no funcionando correctamente" -ForegroundColor Red
    $failed++
}

# ============================================================================
# Test 5: Response Time
# ============================================================================
Write-Host "`n⚡ Test 5: Tiempo de Respuesta..." -ForegroundColor Yellow

$totalTime = 0
$requests = 5

for ($i = 1; $i -le $requests; $i++) {
    $start = Get-Date
    try {
        Invoke-RestMethod -Uri "$AppUrl/api/health" -Method Get -TimeoutSec 10 | Out-Null
        $end = Get-Date
        $time = ($end - $start).TotalMilliseconds
        $totalTime += $time
    } catch {
        Write-Host "   ⚠️  Request $i falló" -ForegroundColor Yellow
    }
    Start-Sleep -Milliseconds 100
}

$avgTime = $totalTime / $requests

if ($avgTime -lt 500) {
    Write-Host "   ✅ PASS: Tiempo promedio excelente ($([math]::Round($avgTime, 0)) ms < 500 ms)" -ForegroundColor Green
    $passed++
} elseif ($avgTime -lt 1000) {
    Write-Host "   ✅ PASS: Tiempo promedio aceptable ($([math]::Round($avgTime, 0)) ms < 1000 ms)" -ForegroundColor Green
    $passed++
} else {
    Write-Host "   ⚠️  WARNING: Tiempo promedio alto ($([math]::Round($avgTime, 0)) ms)" -ForegroundColor Yellow
    Write-Host "      Verificar índices de BD y caché" -ForegroundColor Gray
    $warnings++
}

# ============================================================================
# Test 6: Endpoints Críticos
# ============================================================================
Write-Host "`n🔍 Test 6: Endpoints Críticos Accesibles..." -ForegroundColor Yellow

$endpoints = @(
    "/api/health",
    "/api/health/detailed",
    "/api/metrics"
)

$endpointsPassed = 0

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$AppUrl$endpoint" -Method Get -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ $endpoint - OK" -ForegroundColor Green
            $endpointsPassed++
        }
    } catch {
        Write-Host "   ❌ $endpoint - FAIL" -ForegroundColor Red
    }
}

if ($endpointsPassed -eq $endpoints.Count) {
    Write-Host "   ✅ PASS: Todos los endpoints críticos accesibles" -ForegroundColor Green
    $passed++
} else {
    Write-Host "   ⚠️  WARNING: $($endpoints.Count - $endpointsPassed) endpoints no accesibles" -ForegroundColor Yellow
    $warnings++
}

# ============================================================================
# Resumen Final
# ============================================================================
Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "📋 RESUMEN DE VERIFICACIÓN" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

Write-Host "`n✅ Tests Pasados: $passed" -ForegroundColor Green
Write-Host "⚠️  Warnings: $warnings" -ForegroundColor Yellow
Write-Host "❌ Tests Fallidos: $failed" -ForegroundColor Red

$total = $passed + $warnings + $failed
$successRate = [math]::Round(($passed / $total) * 100, 0)

Write-Host "`n📊 Tasa de Éxito: $successRate%" -ForegroundColor White

if ($failed -eq 0) {
    Write-Host "`n🎉 ¡DEPLOYMENT EXITOSO!" -ForegroundColor Green
    Write-Host "   Tu aplicación está lista para producción" -ForegroundColor White
    
    if ($warnings -gt 0) {
        Write-Host "`n⚠️  Revisar warnings antes de escalar a 500+ usuarios" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⚠️  DEPLOYMENT CON PROBLEMAS" -ForegroundColor Yellow
    Write-Host "   Resolver los tests fallidos antes de usar en producción" -ForegroundColor White
}

Write-Host "`n📚 Acciones Recomendadas:" -ForegroundColor Cyan

if ($failed -gt 0) {
    Write-Host "   1. Revisar logs en Railway Dashboard" -ForegroundColor White
    Write-Host "   2. Verificar variables de entorno" -ForegroundColor White
    Write-Host "   3. Verificar conexión a BD" -ForegroundColor White
}

if ($warnings -gt 0) {
    Write-Host "   1. Monitorear uso de memoria en /api/metrics" -ForegroundColor White
    Write-Host "   2. Considerar ejecutar script de índices en BD" -ForegroundColor White
    Write-Host "   3. Ajustar configuración según warnings" -ForegroundColor White
}

Write-Host "   • Configurar monitoreo con UptimeRobot" -ForegroundColor White
Write-Host "   • Monitorear métricas diariamente (primera semana)" -ForegroundColor White
Write-Host "   • Revisar documentación: docs\DEPLOYMENT.md" -ForegroundColor White

Write-Host ""
