import 'dotenv/config.js';
import db from './src/config/db.js';

(async () => {
  try {
    const query = `
      SELECT s.*, m.nombre_municipio, m.departamento, c.nombre_cargo
      FROM salarios_municipios s
      INNER JOIN municipios m ON s.id_municipio = m.id_municipio
      LEFT JOIN cargos c ON s.id_cargo = c.id_cargo
      LIMIT 5
    `;
    const [salarios] = await db.query(query);
    console.log('✅ Salarios encontrados:', salarios.length);
    console.log('📊 Primer salario:', JSON.stringify(salarios[0], null, 2));
    process.exit(0);
  } catch(err) {
    console.error('❌ Error:', err.message);
    console.error('🔍 Stack:', err.stack);
    process.exit(1);
  }
})();
