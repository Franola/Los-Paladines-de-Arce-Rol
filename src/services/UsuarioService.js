import axiosInstance from "../components/context/axiosInstance.js";

export const getUsuarios = async () => {
    try {
        const response = await axiosInstance.get("api/usuarios");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const registerUsuario = async (usuario) => {
    try {
        const response = await axiosInstance.post("api/usuarios/register", usuario);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUsuario = async (usuario) => {
    try {
        const response = await axiosInstance.post("api/usuarios/login", usuario);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUsuario = async () => {
    try {
        const response = await axiosInstance.post("api/usuarios/logout");
        return response.data;
    } catch (error) {
        throw error;
    }
};