import axiosInstance from "../components/context/axiosInstance.js";

export const getComidas = async () => {
    try {
        const response = await axiosInstance.get("api/comidas");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getComidaById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/comidas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createComida = async (comida) => {
    try {
        const response = await axiosInstance.post("api/comidas", comida);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateComida = async (id, comida) => {
    try {
        const response = await axiosInstance.put(`api/comidas/${id}`, comida);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteComida = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/comidas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};