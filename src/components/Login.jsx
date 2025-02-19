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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UsuarioContext } from './context/usuarioContext';

function Login() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { usuario, setUsuario } = useContext(UsuarioContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const db = getFirestore();
        const refCollection = collection(db, "Usuarios");
        const username = e.target.elements.formGroupUsername.value.trim();
        const password = e.target.elements.formGroupPassword.value.trim();

        getDocs(refCollection)
            .then((snapshot) => {
                const user = snapshot.docs.find((doc) => {
                    const data = doc.data();
                    return data.usuario === username && data.contra === password;
                });

                if (user) {
                    const userData = { id: user.id, ...user.data() };
                    console.log("Usuario encontrado: ", userData);
                    setUsuario(userData);
                    navigate('/');                    
                } else {
                    setError('Usuario o contraseña incorrectos');
                }
            })
            .catch((error) => {
                console.error("Error al obtener los documentos: ", error);
                setError('Error al iniciar sesión');
            });
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
                <Button className='boton-login' variant="primary" type="submit">
                    Aceptar
                </Button>
                {error && <p>{error}</p>}
            </Form>
        </div>
    );
}

export default Login;