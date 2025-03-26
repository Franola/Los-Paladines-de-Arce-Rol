import './Usuario.css';
import  Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getFirestore,
    getDocs,
    collection,
    where,
    query,
    doc,
    setDoc
} from "firebase/firestore";
import Swal from 'sweetalert2';
import LoadingSpiner from './LoadingSpiner';

function Usuario() {
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setSent(true);
        const form = e.target;
        const usuario = form.formUser.value;
        const password = form.formBasicPassword.value;
        const confirmPassword = form.formBasicConfirmPassword.value;
        const admin = form.formBasicCheckbox.checked;

        if (password !== confirmPassword) {
            setLoading(false);
            setSent(false);
            setError('Las contraseñas no coinciden');
            return;
        }

        const db = getFirestore();
        const refCollection = collection(db, "Usuarios");
        const q = query(refCollection, where("usuario", "==", usuario));
        await getDocs(q)
            .then((snapshot) => {
                if (snapshot.size > 0) {
                    setLoading(false);
                    setError('El usuario ya existe');
                    setSent(false);
                } else {
                    setError('');
                    
                    try{
                        setDoc(doc(refCollection), {
                            usuario: usuario,
                            contra: password,
                            admin: admin
                        });

                        setLoading(false);

                        Swal.fire({
                            title: 'Usuario registrado',
                            icon: 'success',
                            confirmButtonText: 'Ok',
                            theme: 'dark',
                        }).then(() => {
                            navigate('/');
                        }); 
                    } catch (e) {
                        setLoading(false);
                        console.error('Error al registrar el usuario', e);
                        Swal.fire({
                            title: 'Error',
                            text: 'Error al registrar el usuario',
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            theme: 'dark',
                        });
                        return;
                    } finally {
                        setSent(false);
                    }                   
                }
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <Container className="pb-2 mt-4 mb-2">
            <Form onSubmit={handleSubmit} className='w-50 m-auto'>
                <Form.Group controlId="formUser" className='mb-3'>
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control type="text" placeholder="Ingrese el usuario" required />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className='mb-3'>
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Ingrese la contraseña" required />
                </Form.Group>

                <Form.Group controlId="formBasicConfirmPassword" className='mb-3'>
                    <Form.Label>Corfirmar contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Repita la contraseña" required />
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox" className='mb-3'>
                    <Form.Check type="checkbox" label="Usuario administrador" />
                </Form.Group>

                {error && <p className="text-danger">{error}</p>}

                <Button className="m-auto" variant="primary" type="submit" disabled={sent}>
                    Registrar
                </Button>
                {loading && <LoadingSpiner/>}
            </Form>
        </Container>
    );
}

export default Usuario