import * as cargosService from "../services/cargosService.js";

export const getCargos = async (req, res) => {
  try {
    const cargos = await cargosService.getCargos();
    res.json({ success: true, data: cargos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCargoById = async (req, res) => {
  try {
    const { id } = req.params;
    const cargo = await cargosService.getCargoById(id);
    if (!cargo) return res.status(404).json({ success: false, error: "Cargo no encontrado" });
    res.json({ success: true, data: cargo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createCargo = async (req, res) => {
  try {
    const cargo = await cargosService.createCargo(req.body);
    res.status(201).json({ success: true, data: cargo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCargo = async (req, res) => {
  try {
    const { id } = req.params;
    const cargo = await cargosService.updateCargo(id, req.body);
    if (!cargo) return res.status(404).json({ success: false, error: "Cargo no encontrado" });
    res.json({ success: true, data: cargo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCargo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await cargosService.deleteCargo(id);
    if (!deleted) return res.status(404).json({ success: false, error: "Cargo no encontrado" });
    res.json({ success: true, message: "Cargo eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
