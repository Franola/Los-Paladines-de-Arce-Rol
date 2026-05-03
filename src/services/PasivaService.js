import axiosInstance from "../components/context/axiosInstance.js";

export const getPasivas = async () => {
    try {
        const response = await axiosInstance.get("api/pasivas");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPasivaById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/pasivas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPasiva = async (pasiva) => {
    try {
        const response = await axiosInstance.post("api/pasivas", pasiva);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePasiva = async (id, pasiva) => {
    try {
        const response = await axiosInstance.put(`api/pasivas/${id}`, pasiva);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePasiva = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/pasivas/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};