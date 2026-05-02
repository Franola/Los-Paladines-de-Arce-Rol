import axiosInstance from "../components/context/axiosInstance.js";

export const getHechizos = async () => {
    try {
        const response = await axiosInstance.get("api/hechizos");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getHechizoById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/hechizos/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createHechizo = async (hechizo) => {
    try {
        const response = await axiosInstance.post("api/hechizos", hechizo);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateHechizo = async (id, hechizo) => {
    try {
        const response = await axiosInstance.put(`api/hechizos/${id}`, hechizo);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteHechizo = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/hechizos/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};