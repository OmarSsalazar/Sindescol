import 'dotenv/config.js';
import db from './src/config/db.js';

(async () => {
  try {
    // Consultar directamente desde la BD sin hacer requests HTTP
    const query = `
      SELECT s.*, m.nombre_municipio, m.departamento, c.nombre_cargo
      FROM salarios_municipios s
      INNER JOIN municipios m ON s.id_municipio = m.id_municipio
      LEFT JOIN cargos c ON s.id_cargo = c.id_cargo
      ORDER BY m.departamento, m.nombre_municipio
    `;
    const [salarios] = await db.query(query);
    console.log(`✅ Se encontraron ${salarios.length} salarios`);
    console.log(`🔍 Primeros 3 salarios:`);
    salarios.slice(0, 3).forEach((sal, i) => {
      console.log(`  ${i+1}. Cargo: ${sal.nombre_cargo}, Municipio: ${sal.nombre_municipio}, Depto: ${sal.departamento}, Salario: ${sal.salario}`);
    });
    process.exit(0);
  } catch(err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
