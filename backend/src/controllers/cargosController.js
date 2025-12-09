import * as cargosService from "../services/cargosService.js";

export const getCargos = async (req, res) => {
  try {
    const cargos = await cargosService.getCargos();
    res.json({ success: true, data: cargos });
  } catch (error) {
    console.error("❌ Error en getCargos:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCargoById = async (req, res) => {
  try {
    const { id } = req.params;
    const cargo = await cargosService.getCargoById(id);
    if (!cargo) {
      return res.status(404).json({ success: false, error: "Cargo no encontrado" });
    }
    res.json({ success: true, data: cargo });
  } catch (error) {
    console.error("❌ Error en getCargoById:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMunicipiosByCargo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Consultando municipios para cargo:", id);
    const municipios = await cargosService.getMunicipiosByCargo(id);
    res.json({ success: true, data: municipios });
  } catch (error) {
    console.error("❌ Error en getMunicipiosByCargo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createCargo = async (req, res) => {
  try {
    console.log("📝 Datos recibidos para crear cargo:", req.body);
    const cargo = await cargosService.createCargo(req.body);
    console.log("✅ Cargo creado exitosamente:", cargo);
    res.status(201).json({ success: true, data: cargo });
  } catch (error) {
    console.error("❌ Error en createCargo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCargo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("📝 Actualizando cargo:", id, req.body);
    const cargo = await cargosService.updateCargo(id, req.body);
    if (!cargo) {
      return res.status(404).json({ success: false, error: "Cargo no encontrado" });
    }
    console.log("✅ Cargo actualizado exitosamente");
    res.json({ success: true, data: cargo });
  } catch (error) {
    console.error("❌ Error en updateCargo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCargo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Eliminando cargo:", id);
    const deleted = await cargosService.deleteCargo(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Cargo no encontrado" });
    }
    console.log("✅ Cargo eliminado exitosamente");
    res.json({ success: true, message: "Cargo eliminado" });
  } catch (error) {
    console.error("❌ Error en deleteCargo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};