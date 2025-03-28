import './notificaciones.css';
import { useEffect, useState } from "react";
import { Container } from 'react-bootstrap';
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
import { useContext } from 'react';
import { UsuarioContext } from './context/usuarioContext';
import ModalSeleccionarCartaNotif from './ModalSeleccionarCartaNotif';
import LoadingSpiner from './LoadingSpiner';

function Notificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);
    const { usuario } = useContext(UsuarioContext);
    const [modalShow, setModalShow] = useState(false);
    const [cartasModal, setCartasModal] = useState([]);
    const [notificacionModal, setNotificacionModal] = useState();
    const [loading, setLoading] = useState(true);
    
    const db = getFirestore();
    const refCollectionNotif = collection(db, "Notificaciones");

    useEffect(() => {
        setLoading(true);
        if (usuario) {
            const q = query(refCollectionNotif, where("usuario", "==", usuario.id), orderBy("fecha", "desc"));
            getDocs(q)
                .then((snapshot) => {
                    setNotificaciones(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                })
                .finally(() => {
                    setLoading(false);
                })
        }
    }, [usuario]);

    const hideModal = () => {
        setModalShow(false);
        setCartasModal([]);
        setNotificacionModal();
    }

    const formatearFecha = (fecha) => {
        return `${fecha.toDate().toLocaleDateString("en-GB")} - ${fecha.toDate().toLocaleTimeString("en-US", { hour12: false })}`;
    }

    const handleClick = (notif) => {
        if(!notif.vista){
            if(notif.tipo === 'Selección de carta') {
                setCartasModal(notif.cartas);
                setNotificacionModal(notif);
                setModalShow(true);
            }
        }
    }

    const mostrarNotificacion = (notif) => {
        return (
            <div className={`notificacion ${(!notif.vista ? "sin-ver" : "vista")}`} key={notif.id}>
                {notif.mensaje && notif.mensaje != "" && 
                    <p>{notif.mensaje}</p> }
                <p>{formatearFecha(notif.fecha)}</p>
            </div>
        );
    }

    const mostrarSeleccionCarta = (notif) => {
        return (
            <div className={`notificacion ${(!notif.vista ? "sin-ver" : "vista")}`} key={notif.id}>
                <p>Tienes cartas para seleccionar:</p>
                <Container className="cartas-notificacion d-flex flex-wrap align-items-center" onClick={()=>handleClick(notif)}>
                    {notif.cartas.map((carta) => {
                        return (
                                <img key={carta.id} src={`/src/assets/cartas/${carta.imagen}`} alt={carta.clase} className='carta-notificacion mx-1'/>
                            );
                    })}
                </Container>
                <p>{formatearFecha(notif.fecha)}</p>
            </div>
        );
    }

    return (
        <div className="notificaciones d-flex flex-column align-items-center">
            {loading && <LoadingSpiner/>}
            {notificaciones && (
                notificaciones.map((notif) => (
                    (notif.tipo === 'Selección de carta') ? mostrarSeleccionCarta(notif) : mostrarNotificacion(notif)
                ))
            )}

            <ModalSeleccionarCartaNotif
                show={modalShow}
                onHide={hideModal}
                cartas={cartasModal}
                notificacion={notificacionModal}
            />
        </div>
    );
}

export default Notificaciones;