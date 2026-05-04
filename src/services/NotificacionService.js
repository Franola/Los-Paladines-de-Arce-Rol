import axiosInstance from "../components/context/axiosInstance.js";

export const getNotificaciones = async () => {
    try {
        const response = await axiosInstance.get("api/notificaciones");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getNotificacionById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/notificaciones/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getNotificacionByUser = async (userId) => {
    try {
        const response = await axiosInstance.get(`api/notificaciones/usuario/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createNotificacion = async (notificacion) => {
    try {
        const response = await axiosInstance.post("api/notificaciones", notificacion);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateNotificacion = async (id, notificacion) => {
    try {
        const response = await axiosInstance.put(`api/notificaciones/${id}`, notificacion);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteNotificacion = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/notificaciones/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};