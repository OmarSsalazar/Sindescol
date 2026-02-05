-- Migration: create salarios table and seed example rows
CREATE TABLE IF NOT EXISTS salarios (
  id_salario INT AUTO_INCREMENT PRIMARY KEY,
  id_cargo INT NOT NULL,
  id_municipio INT NOT NULL,
  salario DECIMAL(12,2) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Seed example rows (won't duplicate if already present check in JS script)
INSERT INTO salarios (id_cargo, id_municipio, salario)
SELECT 1,1,2000000.00 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM salarios WHERE id_cargo=1 AND id_municipio=1);
INSERT INTO salarios (id_cargo, id_municipio, salario)
SELECT 2,1,1800000.00 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM salarios WHERE id_cargo=2 AND id_municipio=1);
INSERT INTO salarios (id_cargo, id_municipio, salario)
SELECT 1,2,2100000.00 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM salarios WHERE id_cargo=1 AND id_municipio=2);
INSERT INTO salarios (id_cargo, id_municipio, salario)
SELECT 3,4,1500000.00 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM salarios WHERE id_cargo=3 AND id_municipio=4);
