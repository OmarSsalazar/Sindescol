import pool from "../config/db.js";

export const getCuotas = async () => {
  const [rows] = await pool.query("SELECT * FROM cuotas");
  return rows;
};

export const getCuotaById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM cuotas WHERE id_cuota = ?", [id]);
  return rows[0];
};

export const getCuotasByCedula = async (cedula) => {
  const [rows] = await pool.query("SELECT * FROM cuotas WHERE cedula = ?", [cedula]);
  return rows;
};

export const createCuota = async (data) => {
  const { cedula, mes, anio, valor } = data;

  const [result] = await pool.query(
    "INSERT INTO cuotas (cedula, mes, anio, valor) VALUES (?, ?, ?, ?)",
    [cedula, mes, anio, valor]
  );

  return { id_cuota: result.insertId, ...data };
};

export const updateCuota = async (id, data) => {
  const { cedula, mes, anio, valor } = data;

  const [result] = await pool.query(
    "UPDATE cuotas SET cedula = ?, mes = ?, anio = ?, valor = ? WHERE id_cuota = ?",
    [cedula, mes, anio, valor, id]
  );

  if (result.affectedRows === 0) return null;
  return { id_cuota: id, ...data };
};

export const deleteCuota = async (id) => {
  const [result] = await pool.query("DELETE FROM cuotas WHERE id_cuota = ?", [id]);
  return result.affectedRows > 0;
};
