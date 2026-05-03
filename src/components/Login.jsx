import './Login.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
    getFirestore,
    getDocs,
    collection,
    where,
    query,
} from "firebase/firestore";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UsuarioContext } from './context/usuarioContext';
import LoadingSpiner from './LoadingSpiner';
import { loginUsuario } from '../services/UsuarioService.js';
import ErrorPopUp from './Popups/Error.jsx';

function Login() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { usuario, setUsuario } = useContext(UsuarioContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (usuario) {
            navigate('/');
        }
    }, [usuario, navigate]);

    const handleSubmit = async (e) => {
        setLoading(true);
        setError('');
        e.preventDefault();
        const username = e.target.elements.formGroupUsername.value.trim();
        const password = e.target.elements.formGroupPassword.value.trim();

        try{
            const user = await loginUsuario({ usuario: username, password: password });
            console.log("Usuario logueado: ", user);
            setUsuario(user.usuarioLogueado);
            
            navigate('/');
        }
        catch(error){
            console.error("Error al iniciar sesión: ", error);
            ErrorPopUp(error.response.data.error || "Error al iniciar sesión");
        }
        finally{
            setLoading(false);
        }
    };
    
    return (
        <div className="login-form">
            <h1 className='titulo'>LPA</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formGroupUsername">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control type="text" placeholder="Ingrese el usuario" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Ingrese la contraseña" />
                </Form.Group>
                <div className='d-flex justify-content-between align-items-center'>
                    <Button className='boton-login' variant="primary" type="submit" disabled={loading}>
                        Aceptar
                    </Button>
                    {loading && <LoadingSpiner height={40} width={40} showLabel={false} paddingBottom={0}/>}
                    {error && <span className='text-danger'><b>{error}</b></span>}
                </div>
            </Form>
        </div>
    );
}

export default Login;