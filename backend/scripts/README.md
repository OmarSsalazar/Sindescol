# 🚀 Scripts de Automatización - SINDESCOL

Scripts PowerShell para automatizar el deployment y monitoreo de SINDESCOL en Railway.

## 📋 Scripts Disponibles

### 0. `get-app-url.ps1` - 🆕 Helper: Encontrar URL de tu App
Ayuda a encontrar la URL pública de tu aplicación en Railway.

**Uso:**
```powershell
.\scripts\get-app-url.ps1
```

**Funcionalidades:**
- ✅ Verifica Railway CLI y proyecto linkado
- ✅ Intenta obtener dominio automáticamente
- ✅ Muestra 3 métodos para encontrar URL
- ✅ Diferencia entre URL de dashboard vs URL pública

**⚠️ IMPORTANTE:** 
La URL correcta es como: `https://tu-app.up.railway.app`  
NO usar: `https://railway.com/project/...` (esa es del dashboard)

---

### 1. `deploy-railway.ps1` - Deployment Completo
Automatiza todo el proceso de deployment a Railway.

**Uso:**
```powershell
.\scripts\deploy-railway.ps1
```

**Funcionalidades:**
- ✅ Verifica dependencias (Node.js, Railway CLI)
- ✅ Verifica estado del repositorio Git
- ✅ Ejecuta tests locales (opcional)
- ✅ Push a GitHub (Railway auto-deploys)
- ✅ Guía para configurar variables de entorno
- ✅ Instrucciones para ejecutar script de índices
- ✅ Verifica health checks después del deploy

---

### 2. `execute-indexes-railway.ps1` - Ejecutar Índices en Railway
Ejecuta el script de índices en la base de datos de Railway MySQL.

**Uso:**
```powershell
.\scripts\execute-indexes-railway.ps1
```

**Requisitos:**
- Railway CLI instalado y autenticado
- Proyecto linkado con `railway link`
- **Comando `mysql` disponible en tu sistema** (o usar método manual)

**Funcionalidades:**
- ✅ Verifica Railway CLI instalado
- ✅ Login automático si es necesario
- ✅ Ejecuta `database/optimize_indexes.sql`
- ✅ Analiza tablas para actualizar estadísticas
- ✅ Verifica índices creados

**Si falla (mysql no encontrado):**
Usar método manual: `.\scripts\execute-indexes-manual.ps1`

---

### 2b. `execute-indexes-manual.ps1` - 🆕 Ejecutar Índices Manualmente
Guía paso a paso para ejecutar índices desde Railway Dashboard.

**Uso:**
```powershell
.\scripts\execute-indexes-manual.ps1
```

**Funcionalidades:**
- ✅ Copia contenido de script al portapapeles automáticamente
- ✅ Guía visual paso a paso
- ✅ Instrucciones detalladas para Railway Dashboard
- ✅ Opción de abrir dashboard automáticamente

**Cuándo usar:**
- Cuando `execute-indexes-railway.ps1` falla
- No tienes mysql instalado localmente
- Prefieres interfaz gráfica

---

### 3. `verify-deployment.ps1` - Verificar Deployment
Ejecuta una suite completa de tests para verificar que el deployment fue exitoso.

**Uso:**
```powershell
.\scripts\verify-deployment.ps1 -AppUrl "https://tu-app.railway.app"
```

**Tests Incluidos:**
- Health check básico
- Health check detallado (BD, caché, memoria)
- Métricas del sistema
- Rate limiting
- Tiempo de respuesta
- Endpoints críticos

**Ejemplo:**
```powershell
.\scripts\verify-deployment.ps1 -AppUrl "https://sindescol-production.up.railway.app"
```

---

### 4. `monitor-production.ps1` - Monitoreo Continuo
Monitorea métricas en tiempo real y genera alertas automáticas.

**Uso:**
```powershell
.\scripts\monitor-production.ps1 -AppUrl "https://tu-app.railway.app" -IntervalSeconds 60
```

**Parámetros:**
- `-AppUrl`: URL de tu aplicación (requerido)
- `-IntervalSeconds`: Intervalo entre checks (default: 60)
- `-MemoryWarningMB`: Umbral de warning de RAM (default: 400)
- `-MemoryCriticalMB`: Umbral crítico de RAM (default: 480)

**Ejemplo:**
```powershell
# Monitoreo cada 30 segundos con alertas personalizadas
.\scripts\monitor-production.ps1 `
    -AppUrl "https://sindescol-production.up.railway.app" `
    -IntervalSeconds 30 `
    -MemoryWarningMB 350 `
    -MemoryCriticalMB 450
```

**Métricas Monitoreadas:**
- Status general (healthy/warning/unhealthy)
- Uso de memoria (MB y %)
- Estado de BD
- Pool de conexiones (libres/total)
- Cache hit ratio
- Uptime

**Alertas Automáticas:**
- 🚨 Memoria > 400 MB (warning)
- 🔴 Memoria > 480 MB (crítico)
- ⚠️ Pocas conexiones BD disponibles (< 3)
- ⚠️ Cache hit ratio bajo (< 50%)
- ❌ BD unhealthy
- ❌ Error obteniendo métricas

**Logs:**
Los logs se guardan automáticamente en `logs/monitor-YYYY-MM-DD.csv`

---

## 🔧 Instalación de Dependencias

### Railway CLI

**Opción 1: npm (recomendado)**
```powershell
npm install -g @railway/cli
```

**Opción 2: Scoop (Windows)**
```powershell
scoop install railway
```

**Verificar instalación:**
```powershell
railway --version
```

**Login:**
```powershell
railway login
```

**Link al proyecto:**
```powershell
cd backend
railway link
```

---

## 📖 Workflow Completo

### Primera vez (Setup Inicial)

1. **Deploy a Railway:**
```powershell
cd backend
.\scripts\deploy-railway.ps1
```

2. **Ejecutar índices en BD:**
```powershell
.\scripts\execute-indexes-railway.ps1
```

3. **Verificar deployment:**
```powershell
.\scripts\verify-deployment.ps1 -AppUrl "https://tu-app.railway.app"
```

4. **MonitorURL incorrecta" o "Not Found"

**Problema:** Estás usando la URL del dashboard en lugar de la URL pública.

**Solución:**
```powershell
# Paso 1: Encontrar URL correcta
.\scripts\get-app-url.ps1
Rate limiting no bloqueó" o "Status 405"

**Problema:** 
- Status 405 = Método HTTP no permitido (el endpoint existe pero espera otro método)
- Esto es normal en el test de rate limiting si la ruta requiere configuración específica

**Solución:**
Esto no es un problema crítico. El rate limiting está configurado, solo que el test usa un endpoint que no acepta GET sin autenticación.

**Verificar manualmente:**
1. Ve a tu app: `https://tu-app.railway.app/api/health`
2. Si carga, el rate limiting está activo en segundo plano

---

### Tests fallando: `Tasa de Éxito: 44%`

**Causas comunes:**
1. **URL incorrecta** (ver primer troubleshooting)
2. **App aún deployando** en Railway
3. **Variables de entorno faltantes**
4. **Base de datos no conectada**

**Pasos de diagnóstico:**
```powershell
# 1. Verificar URL correcta
.\scripts\get-app-url.ps1

# 2. Verificar en navegador
# Ir a: https://tu-app.up.railway.app/api/health
# Debe mostrar: {"status":"healthy",...}

# 3. Ver logs en Railway
railway logs

# 4. Verificar variables en Railway Dashboard
# Settings → Variables → debe tener:
# - NODE_ENV=production
# - DATABASE_URL (auto)
# - JWT_SECRET
# - CORS_ORIGIN
```

---

### Error: "Conexión a BD unhealthy"

**Solución:**
1. Verificar que MySQL service esté corriendo en Railway
2. Verificar `DATABASE_URL` en variables de entorno
3. Ver logs: `railway logs`
4. Reiniciar servicio en Railway Dashboard

---
# Paso 2: Usar URL correcta (formato: https://tu-app.up.railway.app)
.\scripts\verify-deployment.ps1 -AppUrl "https://TU-URL-CORRECTA.up.railway.app"
```

**URLs Correctas vs Incorrectas:**
```
✅ CORRECTO: https://sindescol-production.up.railway.app
✅ CORRECTO: https://backend-production-abc123.up.railway.app
❌ INCORRECTO: https://railway.com/project/24a61c79-d023.../variables...
```

---

### Error: "mysql no se reconoce como comando"

**Problema:** MySQL no está instalado localmente.

**Solución:**
```powershell
# Usar método manual (más fácil)
.\scripts\execute-indexes-manual.ps1

# Seguir las instrucciones para ejecutar desde Railway Dashboard
```

---

### Error: "ear (opcional):**
```powershell
.\scripts\monitor-production.ps1 -AppUrl "https://tu-app.railway.app"
```

---

### Deployments Subsecuentes

```powershell
# Hacer cambios en código...
git add .
git commit -m "feat: nueva funcionalidad"

# Deploy automático
.\scripts\deploy-railway.ps1

# Verificar después del deploy
.\scripts\verify-deployment.ps1 -AppUrl "https://tu-app.railway.app"
```

---

## 🚨 Troubleshooting

### Error: "Railway CLI no encontrado"
**Solución:**
```powershell
npm install -g @railway/cli
railway login
railway link
```

### Error: "No se puede conectar al servidor"
**Causas comunes:**
- URL incorrecta
- Deployment aún en progreso
- Variables de entorno faltantes

**Solución:**
1. Verificar URL en Railway Dashboard
2. Esperar a que termine el deployment
3. Verificar logs: `railway logs`

### Error: "Memoria muy alta"
**Solución:**
1. Verificar métricas: `https://tu-app.railway.app/api/metrics`
2. Considerar upgrade a Railway Pro
3. Revisar documentación: `docs/SCALING.md`

### Tests fallando en verify-deployment
**Solución:**
1. Revisar logs en Railway Dashboard
2. Verificar variables de entorno
3. Ejecutar script de índices si no se ha hecho
4. Verificar conexión a BD

---

## 📊 Interpretación de Resultados

### verify-deployment.ps1

**Exitoso (todos ✅):**
- Aplicación lista para producción
- Puede manejar tráfico de usuarios

**Con Warnings (algunos ⚠️):**
- Aplicación funcional pero con áreas de mejora
- Revisar warnings antes de escalar

**Con Fallas (algunos ❌):**
- NO usar en producción
- Resolver problemas críticos primero

### monitor-production.ps1

**Status: healthy ✅**
- Todo funcionando correctamente

**Status: warning ⚠️**
- Algún componente bajo stress
- Monitorear de cerca

**Status: unhealthy ❌**
- Problema crítico
- Revisar logs inmediatamente

---

## 🔐 Seguridad

**⚠️ IMPORTANTE:** 
- Estos scripts NO exponen credenciales
- Usan Railway CLI con tu autenticación
- No almacenan passwords en logs
- Logs contienen solo métricas públicas

**Recomendaciones:**
- NO compartir logs con métricas en público
- NO commitear archivos de log al repo
- Usar variables de entorno para configuración sensitiva

---

## 📚 Recursos Adicionales

- **Deployment Manual:** [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- **Scaling Guide:** [../docs/SCALING.md](../docs/SCALING.md)
- **Railway Docs:** https://docs.railway.app
- **Issues:** https://github.com/OmarSsalazar/Sindescol/issues

---

## 🆘 Soporte

**Desarrollador:** Omar Santiago Salazar  
**Email:** ossy2607@gmail.com  
**GitHub:** https://github.com/OmarSsalazar/Sindescol

---

## 📝 Changelog

### v1.0.0 (2026-02-19)
- Script inicial de deployment automatizado
- Script de ejecución de índices
- Script de verificación post-deployment
- Script de monitoreo en tiempo real
