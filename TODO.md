# TODO: Fix API Errors in Frontend

## 1. Update vite.config.js
- Add proxy configuration to forward /api requests to http://localhost:4000/api

## 2. Update Afiliados.jsx
- Replace direct fetch calls with getAfiliados and createAfiliado from api.js
- Handle API responses properly (axios vs fetch)

## 3. Update ModalCrearAfiliado.jsx
- Replace direct fetch calls with API functions from api.js for all endpoints (cargos, instituciones, eps, arl, pension, cesantias, religiones, municipios)
- Handle API responses properly

## 4. Update App.jsx
- Add future flags to Router to suppress React Router warnings (v7_startTransition, v7_relativeSplatPath)

## 5. Test the application
- Start frontend server
- Verify afiliados page loads without errors
- Verify modal loads options without errors
