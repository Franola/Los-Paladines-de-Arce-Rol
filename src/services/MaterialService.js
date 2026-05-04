import axiosInstance from "../components/context/axiosInstance.js";

export const getMateriales = async () => {
    try {
        const response = await axiosInstance.get("api/materiales");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMaterialById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/materiales/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createMaterial = async (material) => {
    try {
        const response = await axiosInstance.post("api/materiales", material);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateMaterial = async (id, material) => {
    try {
        const response = await axiosInstance.put(`api/materiales/${id}`, material);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteMaterial = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/materiales/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};