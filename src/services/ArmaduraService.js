import axiosInstance from "../components/context/axiosInstance.js";

export const getArmaduras = async () => {
    try {
        const response = await axiosInstance.get("api/armaduras");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getArmaduraById = async (id) => {
    try {
        const response = await axiosInstance.get(`api/armaduras/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createArmadura = async (armadura) => {
    try {
        const response = await axiosInstance.post("api/armaduras", armadura);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateArmadura = async (id, armadura) => {
    try {
        const response = await axiosInstance.put(`api/armaduras/${id}`, armadura);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteArmadura = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/armaduras/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};