import { createContext, useState, useEffect } from "react";
import { currentUsuario } from "../../services/UsuarioService.js";

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Usuario en el provider:", usuario);
        async function fetchUsuario() {
            if (!usuario) {
                try{
                    const user = await currentUsuario();
                    setUsuario(user ? user.usuarioLogueado : null);
                }
                catch(error){
                    console.error("Error al obtener el usuario:", error);
                    setUsuario(null);
                }
                finally{
                    console.log("Usuario después de fetch:", usuario);
                    setLoading(false);
                }

            }
        }
        fetchUsuario();

    }, []);
    
    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario, loading }}>
            {children}
        </UsuarioContext.Provider>
    );
}
