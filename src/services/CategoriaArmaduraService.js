import axiosInstance from "../components/context/axiosInstance.js";

export const getCategoriasArmadura = async () => {
    try {
        const response = await axiosInstance.get("api/categoriasArmadura");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCategoriaArmaduraById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/categoriasArmadura/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCategoriaArmadura = async (categoriaArmadura) => {
    try {
        const response = await axiosInstance.post("api/categoriasArmadura", categoriaArmadura);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCategoriaArmadura = async (id, categoriaArmadura) => {
    try {
        const response = await axiosInstance.put(`api/categoriasArmadura/${id}`, categoriaArmadura);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCategoriaArmadura = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/categoriasArmadura/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};