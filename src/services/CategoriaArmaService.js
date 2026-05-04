import axiosInstance from "../components/context/axiosInstance.js";

export const getCategoriasArma = async () => {
    try {
        const response = await axiosInstance.get("api/categoriasArma");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCategoriaArmaById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/categoriasArma/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCategoriaArma = async (categoriaArma) => {
    try {
        const response = await axiosInstance.post("api/categoriasArma", categoriaArma);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCategoriaArma = async (id, categoriaArma) => {
    try {
        const response = await axiosInstance.put(`api/categoriasArma/${id}`, categoriaArma);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCategoriaArma = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/categoriasArma/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};