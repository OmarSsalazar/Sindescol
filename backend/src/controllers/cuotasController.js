import * as cuotasService from "../services/cuotasService.js";

export const getCuotas = async (req, res) => {
  try {
    const cuotas = await cuotasService.getCuotas();
    res.json({ success: true, data: cuotas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCuotaById = async (req, res) => {
  try {
    const { id } = req.params;
    const cuota = await cuotasService.getCuotaById(id);
    if (!cuota) return res.status(404).json({ success: false, error: "Cuota no encontrada" });
    res.json({ success: true, data: cuota });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCuotasByCedula = async (req, res) => {
  try {
    const { cedula } = req.params;
    const cuotas = await cuotasService.getCuotasByCedula(cedula);
    res.json({ success: true, data: cuotas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createCuota = async (req, res) => {
  try {
    const cuota = await cuotasService.createCuota(req.body);
    res.status(201).json({ success: true, data: cuota });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCuota = async (req, res) => {
  try {
    const { id } = req.params;
    const cuota = await cuotasService.updateCuota(id, req.body);
    if (!cuota) return res.status(404).json({ success: false, error: "Cuota no encontrada" });
    res.json({ success: true, data: cuota });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCuota = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await cuotasService.deleteCuota(id);
    if (!deleted) return res.status(404).json({ success: false, error: "Cuota no encontrada" });
    res.json({ success: true, message: "Cuota eliminada" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
