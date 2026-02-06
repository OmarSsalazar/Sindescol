import "dotenv/config.js";
import db from "./src/config/db.js";

const run = async () => {
  try {
    console.log('Eliminando filas de ejemplo de la tabla `salarios_municipios`...');
    const res = await db.query(
      `DELETE FROM salarios_municipios WHERE (id_cargo = 1 AND id_municipio = 1)
        OR (id_cargo = 2 AND id_municipio = 1)
        OR (id_cargo = 1 AND id_municipio = 2)
        OR (id_cargo = 3 AND id_municipio = 4)`
    );
    console.log('Filas eliminadas.');
    process.exit(0);
  } catch (err) {
    console.error('Error eliminando filas:', err.message);
    process.exit(1);
  }
};

run();
