import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { UsuarioContext } from "./usuarioContext.jsx";
import { PersonajeContext } from "./personajeContext.jsx";
import { getNotificacionByUser, updateNotificacion } from "../../services/NotificacionService.js";

export const NotificacionContext = createContext();

export const NotificacionProvider = ({ children }) => {
    const { usuario, loading: loadingUsuario } = useContext(UsuarioContext);
    const { personajeActivo } = useContext(PersonajeContext);
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotificaciones = useCallback(async () => {
        if (!usuario) {
            setNotificaciones([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            let targetUserId = null;

            if (usuario.rol === "admin" && personajeActivo) {
                // Si el admin tiene un personaje seleccionado, carga las notificaciones del dueño de ese personaje
                targetUserId = personajeActivo.usuarioId || personajeActivo.usuario?.id || personajeActivo.usuario?.usuario;
            } else {
                // Usuario regular o admin en modo Master
                targetUserId = usuario.id || usuario.usuario;
            }

            if (!targetUserId) {
                setNotificaciones([]);
                setLoading(false);
                return;
            }

            const res = await getNotificacionByUser(targetUserId);
            setNotificaciones(res.result || res || []);
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
            setNotificaciones([]);
        } finally {
            setLoading(false);
        }
    }, [usuario, personajeActivo]);

    useEffect(() => {
        if (!loadingUsuario) {
            fetchNotificaciones();
        }
    }, [loadingUsuario, fetchNotificaciones]);

    const toggleVista = async (notificacionId, nuevaVista) => {
        try {
            await updateNotificacion(notificacionId, { vista: nuevaVista });
            // Actualización optimista en el estado global
            setNotificaciones(prev =>
                prev.map(n => n.id === notificacionId ? { ...n, vista: nuevaVista } : n)
            );
        } catch (error) {
            console.error("Error al actualizar estado de la notificación:", error);
            throw error;
        }
    };

    const marcarComoVista = async (notificacionId) => {
        return await toggleVista(notificacionId, true);
    };

    const cantNotif = notificaciones.filter(n => !n.vista).length;

    return (
        <NotificacionContext.Provider value={{
            notificaciones,
            setNotificaciones,
            cantNotif,
            loading,
            fetchNotificaciones,
            toggleVista,
            marcarComoVista
        }}>
            {children}
        </NotificacionContext.Provider>
    );
};
