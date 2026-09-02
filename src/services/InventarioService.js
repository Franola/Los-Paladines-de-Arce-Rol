import axiosInstance from "../components/context/axiosInstance.js";

export const getInventarios = async () => {
    try {
        const response = await axiosInstance.get("api/inventarios");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getInventarioById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/inventarios/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getInventarioByPersonaje = async (personajeId) => {
    try {
        const response = await axiosInstance.get(`api/inventarios/personaje/${personajeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createInventario = async (inventario) => {
    try {
        const response = await axiosInstance.post("api/inventarios", inventario);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateInventario = async (id, inventario) => {
    try {
        const response = await axiosInstance.put(`api/inventarios/${id}`, inventario);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteInventario = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/inventarios/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
