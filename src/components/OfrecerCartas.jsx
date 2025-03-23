import './OfrecerCartas.css';
import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import SelectorCartas from './SelectorCartas';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getFirestore,
    getDocs,
    collection,
    where,
    query,
    doc,
    setDoc,
    Timestamp
} from "firebase/firestore";
import Swal from 'sweetalert2';


function OfrecerCartas() {
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [cartas, setCartas] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({});
    const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);

    useEffect(() => {
        const db = getFirestore();

        const refCollection = collection(db, "Usuarios");
        const q = query(refCollection, where("admin", "==", false));
        getDocs(q)
            .then((snapshot) => {
                setUsuarios(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            })

        const refCollectionCartas = collection(db, "Cartas");
        
        getDocs(refCollectionCartas)
            .then((snapshot) => {
                setCartas(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            })

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSent(true);
        const form = e.target;
        const usuario = form.formUsuario.value;

        const db = getFirestore();
        const refCollection = collection(db, "Notificaciones");
        try{
            setDoc(doc(refCollection), {
                usuario: usuario,
                cartas: cartasSeleccionadas,
                vista: false,
                fecha: Timestamp.now(),
                tipo: 'Selección de carta'
            });

            Swal.fire({
                title: 'Notificación enviada',
                icon: 'success',
                confirmButtonText: 'Ok',
                theme: 'dark',
            }).then(() => {
                navigate('/');
            }); 
        } catch (e) {
            console.error('Error al registrar la notificación', e);
            Swal.fire({
                title: 'Error',
                text: 'Error al registrar la notificación',
                icon: 'error',
                confirmButtonText: 'Ok',
                theme: 'dark',
            });
            return;
        } finally {
            setSent(false);
        }
    }

    const handleChange = (e) => {
        const db = getFirestore();

        const refCollection = collection(db, "Usuarios");
        const q = query(refCollection, where("__name__", "==", e.target.value));
        getDocs(q)
            .then((snapshot) => {
                if (!snapshot.empty) {
                    console.log(snapshot.docs[0].data());
                    setUsuarioSeleccionado({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
                } else {
                    setUsuarioSeleccionado({});
                }
            })
    }

    return (
        <Container className="pb-2 mt-4 mb-2">
            <Form onSubmit={handleSubmit} className='w-75 m-auto'>
                <Form.Group controlId="formUsuario" className='mb-3'>
                    <Form.Label>Usuario</Form.Label>
                    <Form.Select aria-label="Seleccione el usuario" required onChange={handleChange}>
                        <option>Seleccione el usuario</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id} value={usuario.id}>{usuario.usuario}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formCartas" className='mb-3'>
                    <Form.Label>Cartas</Form.Label>
                    <SelectorCartas cartas={cartas} setCartas={setCartas} cartasSeleccionadas={cartasSeleccionadas} setCartasSeleccionadas={setCartasSeleccionadas} usuarioSeleccionado={usuarioSeleccionado}/>
                </Form.Group>

                {error && <p className="text-danger">{error}</p>}

                <Button className="m-auto" variant="primary" type="submit" disabled={sent}>
                    Aceptar
                </Button>
            </Form>
        </Container>
    );
}

export default OfrecerCartas