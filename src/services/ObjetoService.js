import axiosInstance from "../components/context/axiosInstance.js";

export const getObjetos = async () => {
    try {
        const response = await axiosInstance.get("api/objetos");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getObjetoById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/objetos/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createObjeto = async (objeto) => {
    try {
        const response = await axiosInstance.post("api/objetos", objeto);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateObjeto = async (id, objeto) => {
    try {
        const response = await axiosInstance.put(`api/objetos/${id}`, objeto);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteObjeto = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/objetos/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};