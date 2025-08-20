import axiosInstance from "../components/context/axiosInstance.js";

export const getRamas = async () => {
    try {
        const response = await axiosInstance.get("api/Ramas");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRamaById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/Ramas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createRama = async (rama) => {
    try {
        const response = await axiosInstance.post("api/Ramas", rama);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateRama = async (id, rama) => {
    try {
        const response = await axiosInstance.put(`api/Ramas/${id}`, rama);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteRama = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/Ramas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};