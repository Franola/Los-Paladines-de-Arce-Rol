import axiosInstance from "../components/context/axiosInstance.js";

export const getArmas = async () => {
    try {
        const response = await axiosInstance.get("api/armas");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getArmaById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/armas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createArma = async (arma) => {
    try {
        const response = await axiosInstance.post("api/armas", arma);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateArma = async (id, arma) => {
    try {
        const response = await axiosInstance.put(`api/armas/${id}`, arma);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteArma = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/armas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};