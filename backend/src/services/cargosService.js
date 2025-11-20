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
  const { nombre_cargo } = data;

  const [result] = await pool.query(
    "INSERT INTO cargos (nombre_cargo) VALUES (?)",
    [nombre_cargo]
  );

  return { id_cargo: result.insertId, nombre_cargo };
};

export const updateCargo = async (id, data) => {
  const { nombre_cargo } = data;

  const [result] = await pool.query(
    "UPDATE cargos SET nombre_cargo = ? WHERE id_cargo = ?",
    [nombre_cargo, id]
  );

  if (result.affectedRows === 0) return null;
  return { id_cargo: id, nombre_cargo };
};

export const deleteCargo = async (id) => {
  const [result] = await pool.query("DELETE FROM cargos WHERE id_cargo = ?", [id]);
  return result.affectedRows > 0;
};
