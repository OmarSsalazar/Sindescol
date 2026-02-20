# 🔧 Troubleshooting - Sindescol

Guía rápida para resolver los problemas más comunes durante el deployment.

---

## 🚨 Problema 1: "URL incorrecta" / Tests al 44%

### Síntomas
- `verify-deployment.ps1` muestra tasa de éxito del 44%
- Errores como "Not Found" o "Connection refused"
- Tests de health check retornan vacíos

### Causa
Estás usando la URL del **Railway Dashboard** en lugar de la **URL pública de tu app**.

### Solución RÁPIDA
```powershell
# 1. Ejecutar helper
cd d:\GitHub\Sindescol\backend
.\scripts\get-app-url.ps1

# 2. Copiar la URL que empieza con https://...up.railway.app

# 3. Re-verificar con URL correcta
.\scripts\verify-deployment.ps1 -AppUrl "https://TU-URL-AQUI.up.railway.app"
```

### Cómo identificar URL correcta

✅ **URLs CORRECTAS:**
```
https://sindescol-production.up.railway.app
https://backend-production-abc123.up.railway.app
https://cualquier-nombre.up.railway.app
```

❌ **URLs INCORRECTAS (Dashboard URLs):**
```
https://railway.com/project/24a61c79-d023-4e28-8661-6d8b1af5ab21/service/...
https://railway.app/project/.../variables
```

### Métodos para encontrar URL correcta

**Método 1: Railway CLI**
```powershell
cd backend
railway status
railway domain
```

**Método 2: Railway Dashboard (Manual)**
1. Ir a: https://railway.app
2. Abrir tu proyecto "Sindicato"
3. Click en el servicio "backend"
4. En la parte superior verás la URL pública (botón 🔗)

**Método 3: Generar nueva URL**
```powershell
railway domain
```

---

## 🚨 Problema 2: "mysql no se reconoce como comando"

### Síntomas
- `execute-indexes-railway.ps1` falla
- Error: "mysql : el término 'mysql' no se reconoce..."

### Causa
MySQL client no está instalado en tu máquina local Windows.

### Solución RÁPIDA (Recomendada)
```powershell
# Usar método manual con Railway Dashboard
cd d:\GitHub\Sindescol\backend
.\scripts\execute-indexes-manual.ps1

# Este script:
# 1. Copia el SQL al portapapeles automáticamente
# 2. Te guía paso a paso en Railway Dashboard
# 3. Puede abrir el dashboard automáticamente
```

### Solución Manual (Detallada)

1. **Abrir Railway Dashboard**
   - Ir a: https://railway.app
   - Abrir proyecto "Sindicato"
   - Click en servicio "MySQL"

2. **Abrir Query Editor**
   - Click en tab "Query"
   - O buscar "Query" en el menú

3. **Copiar contenido del script**
   ```powershell
   Get-Content d:\GitHub\Sindescol\backend\database\optimize_indexes.sql | Set-Clipboard
   ```

4. **Pegar en Query Editor**
   - Ctrl+V en el editor
   - Click "Execute" o "Run"

5. **Verificar ejecución**
   ```sql
   SHOW INDEX FROM afiliados;
   SHOW INDEX FROM cuotas;
   ```

### Alternativa: Instalar MySQL Client (Opcional)
```powershell
# Si quieres usar el script automático en el futuro
winget install Oracle.MySQL
# O descargar desde: https://dev.mysql.com/downloads/mysql/
```

---

## 🚨 Problema 3: Rate Limiting retorna 405 en lugar de 429

### Síntomas
- Test de rate limiting muestra "Status 405: Method Not Allowed"
- Esperabas ver "Status 429: Too Many Requests"

### Causa
El endpoint de prueba `/api/auth/login` requiere método `POST`, no `GET`.

### ¿Es un problema?
**NO.** Esto es esperado y el rate limiting SÍ está funcionando.

### Verificación
El rate limiting está activo si:
1. ✅ Backend arrancó sin errores
2. ✅ `/api/health` responde correctamente
3. ✅ No ves errores de "express-rate-limit" en logs

### Test manual (Opcional)
```powershell
# Prueba real de rate limiting en login (POST)
for ($i=1; $i -le 10; $i++) {
    Invoke-RestMethod -Uri "https://tu-app.up.railway.app/api/auth/login" `
                     -Method POST `
                     -Body (@{usuario="test"; password="test"} | ConvertTo-Json) `
                     -ContentType "application/json" `
                     -ErrorAction SilentlyContinue
    Write-Host "Intento $i"
}
# Los últimos intentos deberían dar 429
```

---

## 🚨 Problema 4: "BD unhealthy" en health check

### Síntomas
- `/api/health/detailed` muestra `database: "unhealthy"`
- `dbConnectionStatus: "disconnected"`

### Causas comunes
1. MySQL service no está corriendo en Railway
2. `DATABASE_URL` no configurada o incorrecta
3. Conexión bloqueada por firewall/límites
4. Pool de conexiones agotado

### Solución paso a paso

**1. Verificar MySQL Running**
```powershell
railway status
# Debe mostrar "MySQL" con estado "Running"
```

**2. Verificar DATABASE_URL**
- Railway Dashboard → Settings → Variables
- Debe existir `DATABASE_URL` (creada automáticamente)
- Formato: `mysql://user:pass@host:port/database`

**3. Verificar logs**
```powershell
railway logs
# Buscar errores de conexión MySQL
```

**4. Reiniciar servicio**
- Railway Dashboard → backend service
- Click en "⋮" (menú)
- "Restart"

**5. Verificar límites de conexión**
Si ves "Too many connections":
- Railway Hobby: máximo ~30 conexiones
- Verificar que `connectionLimit: 15` en `backend/src/config/db.js`

---

## 🚨 Problema 5: Variables de entorno faltantes

### Síntomas
- Errores de JWT
- CORS bloqueado
- Funcionalidades no trabajan

### Variables REQUERIDAS

Railway Dashboard → Settings → Variables:

```bash
# ✅ Auto-creadas por Railway
DATABASE_URL=mysql://...  # Automática al crear MySQL service

# ⚠️ DEBES crear manualmente:
NODE_ENV=production
JWT_SECRET=tu_secreto_super_seguro_cambiar_esto_123456
CORS_ORIGIN=https://tu-frontend.com

# 📝 Opcionales (usan defaults):
PORT=3000  # Railway lo asigna automáticamente
```

### Cómo crear variables

**Método 1: Railway Dashboard**
1. Ir a: https://railway.app → Proyecto → Backend Service
2. Tab "Variables"
3. Click "+ New Variable"
4. Agregar cada variable

**Método 2: Railway CLI**
```powershell
railway variables set NODE_ENV=production
railway variables set JWT_SECRET="tu_secreto_super_seguro"
railway variables set CORS_ORIGIN="https://tu-frontend.com"
```

### Verificar variables
```powershell
railway variables
```

---

## 🚨 Problema 6: Backend no arranca / Crashes

### Síntomas
- Logs muestran "Service crashed"
- `/api/health` no responde
- Railway Dashboard muestra servicio en rojo

### Diagnóstico

**1. Ver logs completos**
```powershell
railway logs --tail 100
```

**2. Errores comunes en logs:**

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find module` | Dependencia faltante | `npm install` y re-deploy |
| `ECONNREFUSED` | BD no conectada | Verificar DATABASE_URL |
| `Port already in use` | Railway asigna puerto | Usar `process.env.PORT` |
| `JWT secret not defined` | Falta JWT_SECRET | Crear variable |
| `CORS error` | Frontend bloqueado | Configurar CORS_ORIGIN |

**3. Verificar package.json scripts**
```json
{
  "scripts": {
    "start": "node server.js"  // ✅ Debe existir
  }
}
```

**4. Verificar build exitoso**
```powershell
# Local
cd backend
npm install
npm test
npm start

# Si funciona local pero falla en Railway, problema de variables/env
```

---

## 🚨 Problema 7: Deployment OK pero no responde

### Síntomas
- Railway muestra "Running"
- Logs no muestran errores
- Pero URL no responde

### Checklist

**1. Verificar puerto correcto**
```javascript
// backend/server.js
const PORT = process.env.PORT || 3000;  // ✅ Usar process.env.PORT
```

**2. Verificar binding correcto**
```javascript
app.listen(PORT, '0.0.0.0', () => {  // ✅ '0.0.0.0' no 'localhost'
    console.log(`Server running on port ${PORT}`);
});
```

**3. Verificar dominio generado**
```powershell
railway domain
# Si no existe, crear uno
```

**4. Verificar firewall/networking**
- Railway Dashboard → Settings → Networking
- "Public Networking" debe estar ENABLED

**5. Esperar unos minutos**
El primer deployment puede tardar 2-5 minutos.

---

## 🆘 Flujo de Troubleshooting Sistemático

Cuando algo no funciona, sigue este orden:

```powershell
# PASO 1: Verificar Railway linkado
cd d:\GitHub\Sindescol\backend
railway status
# Debe mostrar tu proyecto y servicios

# PASO 2: Obtener URL correcta
.\scripts\get-app-url.ps1
# Anotar URL que termina en .up.railway.app

# PASO 3: Test básico en navegador
# Ir a: https://tu-url.up.railway.app/api/health
# Debe mostrar: {"status":"healthy",...}

# PASO 4: Ver logs
railway logs --tail 50
# Buscar errors/warnings

# PASO 5: Verificar variables
railway variables
# Verificar NODE_ENV, JWT_SECRET, DATABASE_URL

# PASO 6: Test automático
.\scripts\verify-deployment.ps1 -AppUrl "https://tu-url.up.railway.app"
# Objetivo: >80% de éxito

# PASO 7: Si sigue fallando, ejecutar índices
.\scripts\execute-indexes-manual.ps1

# PASO 8: Re-test final
.\scripts\verify-deployment.ps1 -AppUrl "https://tu-url.up.railway.app"
```

---

## 📞 Soporte Adicional

### Recursos útiles
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Project README](./README.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)

### Comandos útiles Railway CLI
```powershell
railway status           # Estado del proyecto
railway logs            # Ver logs en tiempo real
railway logs --tail 100 # Últimos 100 logs
railway variables       # Ver variables de entorno
railway domain          # Ver/crear dominio público
railway restart         # Reiniciar servicio
railway whoami          # Ver usuario autenticado
railway link            # Re-linkear proyecto
```

### Check rápido de salud

```powershell
# Health check básico
Invoke-RestMethod -Uri "https://tu-url.up.railway.app/api/health"

# Health check detallado
Invoke-RestMethod -Uri "https://tu-url.up.railway.app/api/health/detailed" | ConvertTo-Json -Depth 10

# Métricas del sistema
Invoke-RestMethod -Uri "https://tu-url.up.railway.app/api/metrics" | ConvertTo-Json -Depth 10
```

---

## ✅ Todo funcionando: Señales positivas

Tu deployment está OK si ves:

1. ✅ `railway status` muestra "Running" en todos los servicios
2. ✅ `/api/health` retorna `{"status":"healthy"}`
3. ✅ `verify-deployment.ps1` muestra >80% de éxito
4. ✅ Logs no muestran errores críticos
5. ✅ Health check detailed muestra:
   - `database: "healthy"`
   - `cache: "healthy"`
   - `memoryUsage` < 400MB (en Railway Hobby)
6. ✅ Métricas DB muestran:
   - `activeConnections` < 15
   - `availableConnections` > 0

---

**Última actualización:** 2025-01-14  
**Versión:** 1.0.0
