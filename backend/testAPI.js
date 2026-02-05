import 'dotenv/config.js';

const API_URL = 'http://localhost:4000/api';

(async () => {
  try {
    // 1. Hacer login para obtener un token
    console.log('1️⃣ Intentando login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ossy2607@gmail.com',
        password: 'Usu123'
      })
    });
    
    if (!loginRes.ok) {
      const text = await loginRes.text();
      console.error('❌ Login failed:', loginRes.status, text);
      process.exit(1);
    }
    
    const loginData = await loginRes.json();
    
    if (!loginData.token) {
      console.error('❌ No token in response:', loginData);
      process.exit(1);
    }
    
    const token = loginData.token;
    console.log('✅ Login successful');

    // 2. Request salarios with token
    console.log('\n2️⃣ Requesting salarios...');
    const salariosRes = await fetch(`${API_URL}/salarios`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', salariosRes.status);
    const salariosData = await salariosRes.json();
    
    if (!salariosRes.ok) {
      console.error('❌ Error:', salariosData);
      process.exit(1);
    }
    
    console.log('✅ Got salarios:', salariosData.data.length);
    console.log('📊 First salary:', JSON.stringify(salariosData.data[0], null, 2));
    
    process.exit(0);
  } catch(err) {
    console.error('❌ Exception:', err.message);
    process.exit(1);
  }
})();
