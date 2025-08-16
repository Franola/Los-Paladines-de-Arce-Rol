import axiosInstance from "../components/context/axiosInstance.js";

export const getClases = async () => {
    try {
        const response = await axiosInstance.get("api/clases");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getClaseById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/clases/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createClase = async (clase) => {
    try {
        const response = await axiosInstance.post("api/clases", clase);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateClase = async (id, clase) => {
    try {
        const response = await axiosInstance.put(`api/clases/${id}`, clase);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteClase = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/clases/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};