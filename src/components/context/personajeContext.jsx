import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { UsuarioContext } from "./usuarioContext.jsx";
import { getPersonajesByUser, getPersonajes } from "../../services/PersonajeService.js";
import { getInventarioByPersonaje } from "../../services/InventarioService.js";

export const PersonajeContext = createContext();

export const PersonajeProvider = ({ children }) => {
    const { usuario, loading: loadingUsuario } = useContext(UsuarioContext);
    const [personajes, setPersonajes] = useState([]);
    const [personajeActivo, setPersonajeActivoState] = useState(null);
    const [inventario, setInventario] = useState([]);
    const [loadingPersonajes, setLoadingPersonajes] = useState(true);
    const [loadingInventario, setLoadingInventario] = useState(false);

    const esAdmin = usuario?.rol === "admin";

    // Cargar la lista de personajes
    const fetchPersonajes = useCallback(async () => {
        if (!usuario) {
            setPersonajes([]);
            setPersonajeActivoState(null);
            setInventario([]);
            setLoadingPersonajes(false);
            return;
        }

        try {
            setLoadingPersonajes(true);
            let data = [];
            if (usuario.rol === "admin") {
                // El admin carga TODOS los personajes del sistema
                data = await getPersonajes();
            } else {
                // El usuario estándar carga solo sus personajes
                data = await getPersonajesByUser(usuario.id || usuario.usuario);
            }

            const listaPersonajes = Array.isArray(data) ? data : (data?.result || []);
            setPersonajes(listaPersonajes);

            // Seleccionar personaje activo
            const savedId = localStorage.getItem("personajeActivoId");

            if (usuario.rol === "admin") {
                if (savedId && savedId !== "master") {
                    const personajeGuardado = listaPersonajes.find(p => String(p.id) === String(savedId));
                    setPersonajeActivoState(personajeGuardado || null);
                } else {
                    // Por defecto en admin es Modo Master (null)
                    setPersonajeActivoState(null);
                    localStorage.setItem("personajeActivoId", "master");
                }
            } else {
                // Para jugador regular:
                const personajeGuardado = listaPersonajes.find(p => String(p.id) === String(savedId));
                if (personajeGuardado) {
                    setPersonajeActivoState(personajeGuardado);
                } else if (listaPersonajes.length > 0) {
                    setPersonajeActivoState(listaPersonajes[0]);
                    localStorage.setItem("personajeActivoId", String(listaPersonajes[0].id));
                } else {
                    setPersonajeActivoState(null);
                    localStorage.removeItem("personajeActivoId");
                }
            }
        } catch (error) {
            console.error("Error al cargar personajes:", error);
            setPersonajes([]);
            setPersonajeActivoState(null);
        } finally {
            setLoadingPersonajes(false);
        }
    }, [usuario]);

    useEffect(() => {
        if (!loadingUsuario) {
            fetchPersonajes();
        }
    }, [loadingUsuario, fetchPersonajes]);

    // Cargar inventario del personaje activo
    const fetchInventario = useCallback(async () => {
        if (!personajeActivo?.id) {
            setInventario([]);
            setLoadingInventario(false);
            return;
        }

        try {
            setLoadingInventario(true);
            const data = await getInventarioByPersonaje(personajeActivo.id);
            setInventario(Array.isArray(data) ? data : (data?.result || []));
        } catch (error) {
            console.error(`Error al cargar inventario del personaje ${personajeActivo.id}:`, error);
            setInventario([]);
        } finally {
            setLoadingInventario(false);
        }
    }, [personajeActivo?.id]);

    useEffect(() => {
        fetchInventario();
    }, [fetchInventario]);

    // Función para cambiar de personaje activo o pasar a modo Master (null)
    const setPersonajeActivo = (personaje) => {
        if (!personaje || personaje === "master") {
            setPersonajeActivoState(null);
            localStorage.setItem("personajeActivoId", "master");
            return;
        }

        const personajeEncontrado = typeof personaje === "object" 
            ? personaje 
            : personajes.find(p => String(p.id) === String(personaje));

        if (personajeEncontrado) {
            setPersonajeActivoState(personajeEncontrado);
            localStorage.setItem("personajeActivoId", String(personajeEncontrado.id));
        }
    };

    return (
        <PersonajeContext.Provider value={{
            personajes,
            personajeActivo,
            inventario,
            loadingPersonajes,
            loadingInventario,
            esAdmin,
            setPersonajeActivo,
            fetchPersonajes,
            fetchInventario
        }}>
            {children}
        </PersonajeContext.Provider>
    );
};
