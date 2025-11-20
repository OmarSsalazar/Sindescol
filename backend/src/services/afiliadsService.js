import db from "../config/database.js";

export const getAfiliados = async () => {
  const query = `
    SELECT a.*, 
           c.nombre_cargo,
           r.nombre_religion,
           md.nombre_municipio as municipio_domicilio_nombre,
           mr.nombre_municipio as municipio_residencia_nombre,
           e.nombre_eps,
           ar.nombre_arl,
           p.nombre_pension,
           ce.nombre_cesantias,
           ie.nombre_institucion
    FROM afiliados a
    LEFT JOIN cargos c ON a.id_cargo = c.id_cargo
    LEFT JOIN religiones r ON a.religion_id = r.id_religion
    LEFT JOIN municipios md ON a.municipio_domicilio = md.id_municipio
    LEFT JOIN municipios mr ON a.municipio_residencia = mr.id_municipio
    LEFT JOIN entidades_eps e ON a.id_eps = e.id_eps
    LEFT JOIN entidades_arl ar ON a.id_arl = ar.id_arl
    LEFT JOIN entidades_pension p ON a.id_pension = p.id_pension
    LEFT JOIN entidades_cesantias ce ON a.id_cesantias = ce.id_cesantias
    LEFT JOIN instituciones_educativas ie ON a.id_institucion = ie.id_institucion
  `;
  const [afiliados] = await db.query(query);
  return afiliados;
};

export const getAfiliadoById = async (id) => {
  const query = `
    SELECT a.*, 
           c.nombre_cargo,
           r.nombre_religion,
           md.nombre_municipio as municipio_domicilio_nombre,
           mr.nombre_municipio as municipio_residencia_nombre,
           e.nombre_eps,
           ar.nombre_arl,
           p.nombre_pension,
           ce.nombre_cesantias,
           ie.nombre_institucion
    FROM afiliados a
    LEFT JOIN cargos c ON a.id_cargo = c.id_cargo
    LEFT JOIN religiones r ON a.religion_id = r.id_religion
    LEFT JOIN municipios md ON a.municipio_domicilio = md.id_municipio
    LEFT JOIN municipios mr ON a.municipio_residencia = mr.id_municipio
    LEFT JOIN entidades_eps e ON a.id_eps = e.id_eps
    LEFT JOIN entidades_arl ar ON a.id_arl = ar.id_arl
    LEFT JOIN entidades_pension p ON a.id_pension = p.id_pension
    LEFT JOIN entidades_cesantias ce ON a.id_cesantias = ce.id_cesantias
    LEFT JOIN instituciones_educativas ie ON a.id_institucion = ie.id_institucion
    WHERE a.id_afiliado = ?
  `;
  const [afiliados] = await db.query(query, [id]);
  return afiliados[0];
};

export const getAfiliadoByCedula = async (cedula) => {
  const query = `
    SELECT a.*, 
           c.nombre_cargo,
           r.nombre_religion,
           md.nombre_municipio as municipio_domicilio_nombre,
           mr.nombre_municipio as municipio_residencia_nombre,
           e.nombre_eps,
           ar.nombre_arl,
           p.nombre_pension,
           ce.nombre_cesantias,
           ie.nombre_institucion
    FROM afiliados a
    LEFT JOIN cargos c ON a.id_cargo = c.id_cargo
    LEFT JOIN religiones r ON a.religion_id = r.id_religion
    LEFT JOIN municipios md ON a.municipio_domicilio = md.id_municipio
    LEFT JOIN municipios mr ON a.municipio_residencia = mr.id_municipio
    LEFT JOIN entidades_eps e ON a.id_eps = e.id_eps
    LEFT JOIN entidades_arl ar ON a.id_arl = ar.id_arl
    LEFT JOIN entidades_pension p ON a.id_pension = p.id_pension
    LEFT JOIN entidades_cesantias ce ON a.id_cesantias = ce.id_cesantias
    LEFT JOIN instituciones_educativas ie ON a.id_institucion = ie.id_institucion
    WHERE a.cedula = ?
  `;
  const [afiliados] = await db.query(query, [cedula]);
  return afiliados[0];
};

export const createAfiliado = async (data) => {
  const {
    cedula, nombres, apellidos, religion_id, fecha_nacimiento, fecha_afiliacion,
    direccion_domicilio, municipio_domicilio, municipio_residencia, direccion_residencia,
    id_cargo, id_eps, id_arl, id_pension, id_cesantias, id_institucion
  } = data;

  const query = `
    INSERT INTO afiliados 
    (cedula, nombres, apellidos, religion_id, fecha_nacimiento, fecha_afiliacion,
     direccion_domicilio, municipio_domicilio, municipio_residencia, direccion_residencia,
     id_cargo, id_eps, id_arl, id_pension, id_cesantias, id_institucion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    cedula, nombres, apellidos, religion_id, fecha_nacimiento, fecha_afiliacion,
    direccion_domicilio, municipio_domicilio, municipio_residencia, direccion_residencia,
    id_cargo, id_eps, id_arl, id_pension, id_cesantias, id_institucion
  ]);

  return getAfiliadoById(result.insertId);
};

export const updateAfiliado = async (id, data) => {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(", ");
  const values = Object.values(data);

  const query = `UPDATE afiliados SET ${fields} WHERE id_afiliado = ?`;
  await db.query(query, [...values, id]);

  return getAfiliadoById(id);
};

export const deleteAfiliado = async (id) => {
  const query = `DELETE FROM afiliados WHERE id_afiliado = ?`;
  const [result] = await db.query(query, [id]);
  return result.affectedRows > 0;
};

export const searchAfiliados = async (searchTerm) => {
  const query = `
    SELECT a.*, 
           c.nombre_cargo,
           ie.nombre_institucion
    FROM afiliados a
    LEFT JOIN cargos c ON a.id_cargo = c.id_cargo
    LEFT JOIN instituciones_educativas ie ON a.id_institucion = ie.id_institucion
    WHERE a.cedula LIKE ? OR a.nombres LIKE ? OR a.apellidos LIKE ?
  `;
  const term = `%${searchTerm}%`;
  const [afiliados] = await db.query(query, [term, term, term]);
  return afiliados;
};
