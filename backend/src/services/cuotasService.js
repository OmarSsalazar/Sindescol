import pool from "../config/db.js";

export const getCuotas = async (departamento) => {
  const [rows] = await pool.query(`
    SELECT c.* FROM cuotas c
    INNER JOIN afiliados a ON c.cedula = a.cedula
    INNER JOIN municipios m ON a.municipio_trabajo = m.id_municipio
    WHERE m.departamento = ?
    ORDER BY c.id_cuota DESC
  `, [departamento]);
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

export const createCuota = async (data, departamento) => {
  const { cedula, mes, anio, valor } = data;

  // Validar que el afiliado pertenece al departamento del usuario
  const [afiliados] = await pool.query(`
    SELECT a.id_afiliado, m.departamento
    FROM afiliados a
    INNER JOIN municipios m ON a.municipio_trabajo = m.id_municipio
    WHERE a.cedula = ?
  `, [cedula]);

  if (afiliados.length === 0 || afiliados[0].departamento !== departamento) {
    throw new Error('El afiliado no pertenece a tu departamento');
  }

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
