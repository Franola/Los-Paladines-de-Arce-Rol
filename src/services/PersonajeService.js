import axiosInstance from "../components/context/axiosInstance.js";

export const getPersonajes = async () => {
    try {
        const response = await axiosInstance.get("api/personajes");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPersonajeById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/personajes/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPersonaje = async (personaje) => {
    try {
        const response = await axiosInstance.post("api/personajes", personaje);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePersonaje = async (id, personaje) => {
    try {
        const response = await axiosInstance.put(`api/personajes/${id}`, personaje);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePersonaje = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/personajes/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};