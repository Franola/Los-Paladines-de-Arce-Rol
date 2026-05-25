import axiosInstance from "../components/context/axiosInstance.js";

export const getEspecies = async () => {
    try {
        const response = await axiosInstance.get("api/especies");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getEspecieById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/especies/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createEspecie = async (especie) => {
    try {
        const response = await axiosInstance.post("api/especies", especie);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateEspecie = async (id, especie) => {
    try {
        const response = await axiosInstance.put(`api/especies/${id}`, especie);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteEspecie = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/especies/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
