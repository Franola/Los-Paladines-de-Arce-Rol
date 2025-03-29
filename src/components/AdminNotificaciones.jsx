import './AdminNotificaciones.css';
import { useEffect, useState } from "react";
import { useContext } from 'react';
import { UsuarioContext } from './context/usuarioContext';
import DataTable from "react-data-table-component"
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
import LoadingSpiner from './LoadingSpiner';
import { Container } from 'react-bootstrap';
import ModalSeleccionarCartaNotif from './ModalSeleccionarCartaNotif';

function AdminNotificaciones(){
    const { usuario } = useContext(UsuarioContext);
    const [loading, setLoading] = useState(true);
    const [notificaciones, setNotificaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [cartasModal, setCartasModal] = useState([]);
    const [notificacionModal, setNotificacionModal] = useState();

    const db = getFirestore();
    const refCollectionNotif = collection(db, "Notificaciones");
    const refCollectionUsuarios = collection(db, "Usuarios");

    useEffect(() => {
        setLoading(true);
        if (usuario) {
            try{
                getDocs(refCollectionNotif)
                    .then((snapshot) => {
                        setNotificaciones(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                    })
                    .finally(() => {
                        setLoading(false);
                    })
                getDocs(refCollectionUsuarios)
                    .then((snapshot) => {
                        setUsuarios(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                    })
            }
            catch(error){
                console.log("Error al obtener notificaciones:", error);
            }
        }
    }, []);

    const hideModal = () => {
        setModalShow(false);
        setCartasModal([]);
        setNotificacionModal();
    }

    const formatearFecha = (fecha) => {
        return `${fecha.toDate().toLocaleDateString("en-GB")} - ${fecha.toDate().toLocaleTimeString("en-US", { hour12: false })}`;
    }

    const handleClick = (notif) => {
        if(notif.tipo === 'Selección de carta') {
            setCartasModal(notif.cartas);
            setNotificacionModal(notif);
            setModalShow(true);
        }
    }

    const mostrarNotificacion = (notif) => {
        return (
            <div className={`notificacion sin-ver`} key={notif.id}>
                {notif.usuario && usuarios.length>0 && 
                    <div className='d-flex align-items-center'>
                        <img src="/src/assets/icon-usuario.png" alt="" className='imagen-usuario-notificacion me-1'/>
                        <p style={{margin: 0}}>{usuarios.find(u => u.id === notif.usuario).usuario}</p> 
                    </div>
                }

                {notif.mensaje && notif.mensaje != "" && 
                    <p>{notif.mensaje}</p> }
                <div className='d-flex align-items-center'>
                    <img src="/src/assets/icon-calendario.png" alt="" className='imagen-calendario-notificacion me-1'/>
                    <p style={{margin: 0}}>{formatearFecha(notif.fecha)}</p>
                </div>
            </div>
        );
    }

    const mostrarSeleccionCarta = (notif) => {
        return (
            <div className={`notificacion sin-ver`} key={notif.id}>
                {notif.usuario && usuarios.length>0 && 
                    <div className='d-flex align-items-center'>
                        <img src="/src/assets/icon-usuario.png" alt="" className='imagen-usuario-notificacion me-1'/>
                        <p style={{margin: 0}}>{usuarios.find(u => u.id === notif.usuario).usuario}</p> 
                        {notif.vista ?  <img src="/src/assets/icon-visto.png" alt="" className='imagen-visto-notificacion ms-auto'/>
                                    :
                                        <img src="/src/assets/icon-no-visto.png" alt="" className='imagen-visto-notificacion ms-auto'/>
                        }
                    </div>
                }

                <p>Tienes cartas para seleccionar:</p>
                <Container className="cartas-notificacion d-flex flex-wrap align-items-center" onClick={()=>handleClick(notif)}>
                    {notif.cartas.map((carta) => {
                        return (
                                <img key={carta.id} src={`/src/assets/cartas/${carta.imagen}`} alt={carta.clase} className='carta-notificacion mx-1'/>
                            );
                    })}
                </Container>
                <div className='d-flex align-items-center'>
                    <img src="/src/assets/icon-calendario.png" alt="" className='imagen-calendario-notificacion me-1'/>
                    <p style={{margin: 0}}>{formatearFecha(notif.fecha)}</p>
                </div>
            </div>
        );
    }

    return(
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
                admin={usuario.admin}
            />
        </div>
    );
}

export default AdminNotificaciones;