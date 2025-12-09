import * as departamentosService from "../services/departamentosService.js";

export const getDepartamentos = async (req, res) => {
  try {
    const departamentos = await departamentosService.getDepartamentos();
    res.json({ success: true, data: departamentos });
  } catch (error) {
    console.error("❌ Error en getDepartamentos:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMunicipiosByDepartamento = async (req, res) => {
  try {
    const { departamento } = req.params;
    const municipios = await departamentosService.getMunicipiosByDepartamento(departamento);
    res.json({ success: true, data: municipios });
  } catch (error) {
    console.error("❌ Error en getMunicipiosByDepartamento:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createMunicipio = async (req, res) => {
  try {
    console.log("📝 Creando municipio:", req.body);
    const municipio = await departamentosService.createMunicipio(req.body);
    console.log("✅ Municipio creado exitosamente");
    res.status(201).json({ success: true, data: municipio });
  } catch (error) {
    console.error("❌ Error en createMunicipio:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateMunicipio = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📝 Actualizando municipio:", id, req.body);
    const municipio = await departamentosService.updateMunicipio(id, req.body);
    if (!municipio) {
      return res.status(404).json({ success: false, error: "Municipio no encontrado" });
    }
    console.log("✅ Municipio actualizado exitosamente");
    res.json({ success: true, data: municipio });
  } catch (error) {
    console.error("❌ Error en updateMunicipio:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteMunicipio = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Eliminando municipio:", id);
    const deleted = await departamentosService.deleteMunicipio(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Municipio no encontrado" });
    }
    console.log("✅ Municipio eliminado exitosamente");
    res.json({ success: true, message: "Municipio eliminado" });
  } catch (error) {
    console.error("❌ Error en deleteMunicipio:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createDepartamentoConMunicipios = async (req, res) => {
  try {
    console.log("📝 Creando departamento con municipios:", req.body);
    const resultado = await departamentosService.createDepartamentoConMunicipios(req.body);
    console.log("✅ Departamento creado exitosamente");
    res.status(201).json({ success: true, data: resultado });
  } catch (error) {
    console.error("❌ Error en createDepartamentoConMunicipios:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};