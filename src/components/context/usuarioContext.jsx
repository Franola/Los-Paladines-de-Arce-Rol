import { createContext, useState, useEffect } from "react";

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {
        console.log('Obteniendo usuario de localStorage');
        const savedUser = localStorage.getItem('usuario');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (usuario) {
            console.log('Guardando usuario en localStorage');
            localStorage.setItem('usuario', JSON.stringify(usuario));
        } else {
            console.log('Borrando usuario de localStorage');
            localStorage.removeItem('usuario');
        }
    }, [usuario]);
    
    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </UsuarioContext.Provider>
    );
}
