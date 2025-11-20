import * as afiliadosService from "../services/afiliadosService.js";

export const getAfiliados = async (req, res) => {
  try {
    const afiliados = await afiliadosService.getAfiliados();
    res.json({ success: true, data: afiliados });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAfiliadoById = async (req, res) => {
  try {
    const { id } = req.params;
    const afiliado = await afiliadosService.getAfiliadoById(id);
    if (!afiliado) return res.status(404).json({ success: false, error: "Afiliado no encontrado" });
    res.json({ success: true, data: afiliado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAfiliadoByCedula = async (req, res) => {
  try {
    const { cedula } = req.params;
    const afiliado = await afiliadosService.getAfiliadoByCedula(cedula);
    if (!afiliado) return res.status(404).json({ success: false, error: "Afiliado no encontrado" });
    res.json({ success: true, data: afiliado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAfiliado = async (req, res) => {
  try {
    const afiliado = await afiliadosService.createAfiliado(req.body);
    res.status(201).json({ success: true, data: afiliado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAfiliado = async (req, res) => {
  try {
    const { id } = req.params;
    const afiliado = await afiliadosService.updateAfiliado(id, req.body);
    if (!afiliado) return res.status(404).json({ success: false, error: "Afiliado no encontrado" });
    res.json({ success: true, data: afiliado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAfiliado = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await afiliadosService.deleteAfiliado(id);
    if (!deleted) return res.status(404).json({ success: false, error: "Afiliado no encontrado" });
    res.json({ success: true, message: "Afiliado eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
