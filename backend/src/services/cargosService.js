import pool from "../config/db.js";

export const getCargos = async () => {
  const [rows] = await pool.query("SELECT * FROM cargos");
  return rows;
};

export const getCargoById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM cargos WHERE id_cargo = ?", [id]);
  return rows[0];
};

export const createCargo = async (data) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { nombre_cargo, salario, municipios } = data;

    // 1. Crear el cargo
    const [result] = await connection.query(
      "INSERT INTO cargos (nombre_cargo) VALUES (?)",
      [nombre_cargo]
    );

    const id_cargo = result.insertId;

    // 2. Si hay municipios y salario, crear las relaciones en salarios_municipios
    if (municipios && Array.isArray(municipios) && municipios.length > 0 && salario) {
      for (const id_municipio of municipios) {
        await connection.query(
          "INSERT INTO salarios_municipios (id_cargo, id_municipio, salario) VALUES (?, ?, ?)",
          [id_cargo, id_municipio, salario]
        );
      }
    }

    await connection.commit();
    return { id_cargo, nombre_cargo };

  } catch (error) {
    await connection.rollback();
    console.error('Error en createCargo:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export const updateCargo = async (id, data) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { nombre_cargo, salario, municipios } = data;

    // 1. Actualizar el nombre del cargo
    const [result] = await connection.query(
      "UPDATE cargos SET nombre_cargo = ? WHERE id_cargo = ?",
      [nombre_cargo, id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return null;
    }

    // 2. Si se proporcionan municipios y salario, actualizar salarios_municipios
    if (municipios && Array.isArray(municipios) && salario) {
      // Eliminar relaciones anteriores
      await connection.query(
        "DELETE FROM salarios_municipios WHERE id_cargo = ?",
        [id]
      );

      // Crear nuevas relaciones
      for (const id_municipio of municipios) {
        await connection.query(
          "INSERT INTO salarios_municipios (id_cargo, id_municipio, salario) VALUES (?, ?, ?)",
          [id, id_municipio, salario]
        );
      }
    }

    await connection.commit();
    return { id_cargo: id, nombre_cargo };

  } catch (error) {
    await connection.rollback();
    console.error('Error en updateCargo:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteCargo = async (id) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Eliminar primero las relaciones en salarios_municipios
    await connection.query("DELETE FROM salarios_municipios WHERE id_cargo = ?", [id]);
    
    // Eliminar el cargo
    const [result] = await connection.query("DELETE FROM cargos WHERE id_cargo = ?", [id]);
    
    await connection.commit();
    return result.affectedRows > 0;

  } catch (error) {
    await connection.rollback();
    console.error('Error en deleteCargo:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Nueva función para obtener los municipios asociados a un cargo
export const getMunicipiosByCargo = async (id_cargo) => {
  const query = `
    SELECT sm.*, m.nombre_municipio, m.departamento
    FROM salarios_municipios sm
    LEFT JOIN municipios m ON sm.id_municipio = m.id_municipio
    WHERE sm.id_cargo = ?
  `;
  const [rows] = await pool.query(query, [id_cargo]);
  return rows;
};