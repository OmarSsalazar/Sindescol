import 'dotenv/config.js';

const API_URL = 'http://localhost:4000/api';

(async () => {
  try {
    // 1. Hacer login para obtener un token
    console.log('1️⃣  Intentando login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ossy2607@gmail.com',
        password: 'Usu123'
      })
    });
    
    const loginData = await loginRes.json();
    
    if (!loginData.token) {
      console.error('❌ Error en login:', loginData);
      process.exit(1);
    }
    
    const token = loginData.token;
    console.log('✅ Login exitoso. Token:', token.substring(0, 20) + '...');

    // 2. Ahora hacer la solicitud a salarios con el token
    console.log('\n2️⃣  Solicitando salarios...');
    const salariosRes = await fetch(`${API_URL}/salarios`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const salariosData = await salariosRes.json();
    
    if (!salariosRes.ok) {
      console.error('❌ Error:', salariosData);
      process.exit(1);
    }
    
    console.log('✅ Salarios obtenidos:', salariosData.data.length);
    console.log('📊 Primer salario:', JSON.stringify(salariosData.data[0], null, 2));
    
    process.exit(0);
  } catch(err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
