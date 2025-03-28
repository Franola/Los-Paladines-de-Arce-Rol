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
import LoadingSpiner from './LoadingSpiner';

function Login() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { usuario, setUsuario } = useContext(UsuarioContext);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        setLoading(true);
        setError('');
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
                    console.log('Guardando usuario en localStorage');
                    localStorage.setItem('usuario', JSON.stringify(userData)); // Guardar en localStorage
                    navigate('/');                    
                } else {
                    setError('Usuario o contraseña incorrectos');
                }
            })
            .finally(() => {
                setLoading(false);
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