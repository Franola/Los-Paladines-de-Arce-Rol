import axiosInstance from "../components/context/axiosInstance.js";

export const getTiposArmadura = async () => {
    try {
        const response = await axiosInstance.get("api/tiposArmadura");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTipoArmaduraById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/tiposArmadura/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTipoArmadura = async (tipoArmadura) => {
    try {
        const response = await axiosInstance.post("api/tiposArmadura", tipoArmadura);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTipoArmadura = async (id, tipoArmadura) => {
    try {
        const response = await axiosInstance.put(`api/tiposArmadura/${id}`, tipoArmadura);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTipoArmadura = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/tiposArmadura/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};