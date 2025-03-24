import { use } from 'react';
import './ModalSeleccionarCartaNotif.css';
import Modal from 'react-bootstrap/Modal';
import { useEffect } from 'react';
import { useState } from 'react';
import {
    getFirestore,
    getDocs,
    collection,
    where,
    orderBy,
    query,
    doc,
    updateDoc,
    or,
    Timestamp
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function ModalSeleccionarCartaNotif(props) {
    const navigate = useNavigate();
    const [cartaSeleccionada, setCartaSeleccionada] = useState();

    const db = getFirestore();
    const refCollectionNotif = collection(db, "Notificaciones");
    const refCollectionCartas = collection(db, "Cartas");
    
    const handleClick = (carta) => {
        setCartaSeleccionada(carta);
    }

    const handleCancelar = () => {
        props.onHide();
        setCartaSeleccionada();
    }

    const handleAceptar = () => {
        if(!cartaSeleccionada){
            Swal.fire({
                title: 'Seleccione una carta antes de aceptar',
                icon: 'warning',
                confirmButtonText: 'Ok',
                theme: 'dark',
            });
        }
        else{
            const q = query(refCollectionCartas, where("__name__", "==", cartaSeleccionada.id));
            getDocs(q)
                .then((snapshot) => {
                    try{
                        let carta =  (snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                        updateDoc(doc(refCollectionCartas, carta[0].id), {
                            usuarios: [...carta[0].usuarios, props.notificacion.usuario]
                        });

                        updateDoc(doc(refCollectionNotif, props.notificacion.id), {
                            vista: true
                        });

                        Swal.fire({
                            title: 'Notificación aceptada',
                            icon: 'success',
                            confirmButtonText: 'Ok',
                            theme: 'dark',
                        }).then(() => {
                            props.onHide();
                            setCartaSeleccionada();
                            navigate(0);
                        }); 
                    } catch (error) {
                        console.error('Error al actualizar la notificación', error);
                        Swal.fire({
                            title: 'Error',
                            text: 'Error al actualizar la notificación',
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            theme: 'dark',
                        });
                    }
                })
        }
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className='modal-seleccionar-carta-notif'
            dialogClassName='modal-seleccionar-carta-notif-dialog'
            contentClassName='modal-seleccionar-carta-notif-content'
            backdrop="static"
            keyboard={false}
        >
            <h2 className='mx-auto'>Seleccione una carta</h2>
            <div className='cartas-seleccionables d-flex flex-wrap justify-content-center my-3'>
                {props.cartas.map((item) => (
                    <img className={`imagen-modal-seleccionar-carta ${(cartaSeleccionada && item.id === cartaSeleccionada.id ? "seleccionada" : "")}`} src={`/src/assets/cartas/${item.imagen}`} alt={item.clase} key={item.id} onClick={()=>handleClick(item)}/>
                ))}
            </div>
            <div className='mx-auto d-flex justify-content-center'>
                <button className='btn btn-danger mx-2' onClick={handleCancelar}>Cancelar</button>
                <button className='btn btn-success mx-2' onClick={handleAceptar}>Aceptar</button>
            </div>
        </Modal>
    );
}

export default ModalSeleccionarCartaNotif;