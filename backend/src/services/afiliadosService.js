import pool from "../config/db.js";

export const getAfiliados = async () => {
  const [rows] = await pool.query(
    `SELECT a.*, c.nombre_cargo, i.nombre_institucion
     FROM afiliados a
     LEFT JOIN cargos c ON a.id_cargo = c.id_cargo
     LEFT JOIN instituciones i ON a.id_institucion = i.id_institucion`
  );
  return rows;
};

export const getAfiliadoById = async (id) => {
  const [rows] = await pool.query(
    `SELECT a.*, c.nombre_cargo, i.nombre_institucion
     FROM afiliados a
     LEFT JOIN cargos c ON a.id_cargo = c.id_cargo
     LEFT JOIN instituciones i ON a.id_institucion = i.id_institucion
     WHERE a.id_afiliado = ?`,
    [id]
  );
  return rows[0];
};

export const getAfiliadoByCedula = async (cedula) => {
  const [rows] = await pool.query(
    `SELECT a.*, c.nombre_cargo, i.nombre_institucion
     FROM afiliados a
     LEFT JOIN cargos c ON a.id_cargo = c.id_cargo
     LEFT JOIN instituciones i ON a.id_institucion = i.id_institucion
     WHERE a.cedula = ?`,
    [cedula]
  );
  return rows[0];
};

export const createAfiliado = async (data) => {
  const { cedula, nombres, apellidos, direccion, celular, estudios, id_cargo } = data;

  const [result] = await pool.query(
    "INSERT INTO afiliados (cedula, nombres, apellidos, direccion, celular, estudios, id_cargo) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [cedula, nombres, apellidos, direccion, celular, estudios, id_cargo]
  );

  return { id_afiliado: result.insertId, ...data };
};

export const updateAfiliado = async (id, data) => {
  const { cedula, nombres, apellidos, direccion, celular, estudios, id_cargo } = data;

  const [result] = await pool.query(
    "UPDATE afiliados SET cedula = ?, nombres = ?, apellidos = ?, direccion = ?, celular = ?, estudios = ?, id_cargo = ? WHERE id_afiliado = ?",
    [cedula, nombres, apellidos, direccion, celular, estudios, id_cargo, id]
  );

  if (result.affectedRows === 0) return null;
  return { id_afiliado: id, ...data };
};

export const deleteAfiliado = async (id) => {
  const [result] = await pool.query("DELETE FROM afiliados WHERE id_afiliado = ?", [id]);
  return result.affectedRows > 0;
};
