import "dotenv/config.js";
import db from "./src/config/db.js";

const run = async () => {
  try {
    console.log('Creando tabla `salarios` si no existe...');

    await db.query(`
      CREATE TABLE IF NOT EXISTS salarios (
        id_salario INT AUTO_INCREMENT PRIMARY KEY,
        id_cargo INT NOT NULL,
        id_municipio INT NOT NULL,
        salario DECIMAL(12,2) NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `);

    console.log('Tabla creada (o ya existía). Insertando filas de ejemplo...');

    // Insertar ejemplo si no existe fila para id_cargo=1,id_municipio=1
    const [rows] = await db.query(
      'SELECT COUNT(*) AS cnt FROM salarios WHERE id_cargo = ? AND id_municipio = ?',
      [1, 1]
    );

    if (rows[0].cnt === 0) {
      await db.query(
        'INSERT INTO salarios (id_cargo, id_municipio, salario) VALUES (?, ?, ?)',
        [1, 1, 2000000.00]
      );
      console.log('Inserción: salario para id_cargo=1,id_municipio=1 -> 2000000.00');
    } else {
      console.log('Ya existe salario para id_cargo=1,id_municipio=1, no se inserta.');
    }

    // Insertar algunas filas extra útiles
    const extra = [
      [2, 1, 1800000.00],
      [1, 2, 2100000.00],
      [3, 4, 1500000.00]
    ];

    for (const [id_cargo, id_municipio, salario] of extra) {
      const [r] = await db.query('SELECT COUNT(*) AS cnt FROM salarios WHERE id_cargo = ? AND id_municipio = ?', [id_cargo, id_municipio]);
      if (r[0].cnt === 0) {
        await db.query('INSERT INTO salarios (id_cargo, id_municipio, salario) VALUES (?, ?, ?)', [id_cargo, id_municipio, salario]);
        console.log(`Inserción: salario para id_cargo=${id_cargo},id_municipio=${id_municipio} -> ${salario}`);
      }
    }

    console.log('Hecho. Ahora probando el endpoint /api/salarios?id_cargo=1&id_municipio=1');

    // Probar usando fetch
    const fetch = global.fetch || (await import('node-fetch')).default;
    const res = await fetch('http://localhost:4000/api/salarios?id_cargo=1&id_municipio=1', { method: 'GET' });
    const text = await res.text();
    console.log('/api/salarios response status:', res.status);
    console.log(text);

    process.exit(0);
  } catch (err) {
    console.error('Error creando/sembrando tabla salarios:', err.message);
    process.exit(1);
  }
};

run();
