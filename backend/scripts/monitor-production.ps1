# ============================================================================
# Script de Monitoreo Continuo para Producción
# ============================================================================
# Monitorea métricas en tiempo real y genera alertas
# Ejecutar: .\scripts\monitor-production.ps1 -AppUrl "https://tu-app.railway.app"
# ============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$AppUrl,
    
    [Parameter(Mandatory=$false)]
    [int]$IntervalSeconds = 60,
    
    [Parameter(Mandatory=$false)]
    [int]$MemoryWarningMB = 400,
    
    [Parameter(Mandatory=$false)]
    [int]$MemoryCriticalMB = 480
)

Write-Host "📊 SINDESCOL - Monitoreo de Producción" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "URL: $AppUrl" -ForegroundColor White
Write-Host "Intervalo: $IntervalSeconds segundos" -ForegroundColor Gray
Write-Host "Presiona CTRL+C para detener" -ForegroundColor Gray
Write-Host ""

$iteration = 0
$alerts = @()

while ($true) {
    $iteration++
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    Write-Host "`n[$timestamp] Iteración $iteration" -ForegroundColor Cyan
    Write-Host ("-" * 60) -ForegroundColor Gray
    
    try {
        # Obtener métricas
        $metrics = Invoke-RestMethod -Uri "$AppUrl/api/metrics" -Method Get -TimeoutSec 10
        $healthDetailed = Invoke-RestMethod -Uri "$AppUrl/api/health/detailed" -Method Get -TimeoutSec 10
        
        # Status General
        $status = $healthDetailed.status
        $statusColor = if ($status -eq "healthy") { "Green" } elseif ($status -eq "warning") { "Yellow" } else { "Red" }
        Write-Host "Status: " -NoNewline
        Write-Host $status.ToUpper() -ForegroundColor $statusColor
        
        # Memoria
        $memUsed = $healthDetailed.checks.memory.usage.heapUsed_mb
        $memTotal = $healthDetailed.checks.memory.usage.heapTotal_mb
        $memPercent = [math]::Round(($memUsed / 500) * 100, 1)
        
        Write-Host "Memoria: $memUsed MB / 500 MB ($memPercent%)" -NoNewline
        
        if ($memUsed -lt $MemoryWarningMB) {
            Write-Host " ✅" -ForegroundColor Green
        } elseif ($memUsed -lt $MemoryCriticalMB) {
            Write-Host " ⚠️  WARNING" -ForegroundColor Yellow
            $alerts += "[$timestamp] Memoria alta: $memUsed MB"
        } else {
            Write-Host " 🔴 CRÍTICO" -ForegroundColor Red
            $alerts += "[$timestamp] CRÍTICO: Memoria muy alta: $memUsed MB"
        }
        
        # Base de Datos
        $dbStatus = $healthDetailed.checks.database.status
        $dbColor = if ($dbStatus -eq "healthy") { "Green" } else { "Red" }
        Write-Host "Base de Datos: " -NoNewline
        Write-Host $dbStatus -ForegroundColor $dbColor
        
        if ($dbStatus -ne "healthy") {
            $alerts += "[$timestamp] BD no saludable: $($healthDetailed.checks.database.message)"
        }
        
        # Pool de Conexiones
        $poolFree = $metrics.database.freeConnections
        $poolTotal = $metrics.database.poolSize
        Write-Host "Pool BD: $poolFree libres / $poolTotal total" -NoNewline
        
        if ($poolFree -lt 3) {
            Write-Host " ⚠️  Pocas conexiones libres" -ForegroundColor Yellow
            $alerts += "[$timestamp] Pocas conexiones BD disponibles: $poolFree"
        } else {
            Write-Host " ✅" -ForegroundColor Green
        }
        
        # Caché
        $cacheKeys = $healthDetailed.checks.cache.stats.keys
        $cacheHits = $healthDetailed.checks.cache.stats.hits
        $cacheMisses = $healthDetailed.checks.cache.stats.misses
        
        if ($cacheHits + $cacheMisses -gt 0) {
            $hitRatio = [math]::Round(($cacheHits / ($cacheHits + $cacheMisses)) * 100, 1)
            Write-Host "Caché: $cacheKeys keys, Hit Ratio: $hitRatio%" -NoNewline
            
            if ($hitRatio -gt 80) {
                Write-Host " ✅" -ForegroundColor Green
            } elseif ($hitRatio -gt 50) {
                Write-Host " ⚠️" -ForegroundColor Yellow
            } else {
                Write-Host " ⚠️  Bajo" -ForegroundColor Yellow
                $alerts += "[$timestamp] Cache hit ratio bajo: $hitRatio%"
            }
        } else {
            Write-Host "Caché: $cacheKeys keys (sin estadísticas aún)" -ForegroundColor Gray
        }
        
        # Uptime
        Write-Host "Uptime: $($metrics.uptime.formatted)" -ForegroundColor Gray
        
        # Alertas Acumuladas
        if ($alerts.Count -gt 0) {
            Write-Host "`n🚨 ALERTAS ACTIVAS ($($alerts.Count)):" -ForegroundColor Red
            $alerts | Select-Object -Last 5 | ForEach-Object {
                Write-Host "   $_" -ForegroundColor Yellow
            }
        }
        
        # Guardar log
        $logEntry = "$timestamp,$status,$memUsed,$poolFree,$cacheKeys,$hitRatio"
        $logEntry | Out-File -FilePath "logs\monitor-$(Get-Date -Format 'yyyy-MM-dd').csv" -Append
        
    } catch {
        Write-Host "❌ ERROR: No se pudo obtener métricas" -ForegroundColor Red
        Write-Host "   $_" -ForegroundColor Gray
        $alerts += "[$timestamp] Error obteniendo métricas: $_"
    }
    
    # Esperar próxima iteración
    Write-Host "`nPróxima verificación en $IntervalSeconds segundos..." -ForegroundColor Gray
    Start-Sleep -Seconds $IntervalSeconds
}
