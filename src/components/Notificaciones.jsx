import './Notificaciones.css';
import { useState, useContext } from "react";
import { Container } from 'react-bootstrap';
import { UsuarioContext } from './context/usuarioContext';
import { NotificacionContext } from './context/notificacionContext';
import ModalSeleccionarCartaNotif from './ModalSeleccionarCartaNotif';
import LoadingSpiner from './LoadingSpiner';
import ErrorPopUp from './Popups/Error.jsx';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

function Notificaciones() {
    const { usuario, loading: loadingUsuario } = useContext(UsuarioContext);
    const { notificaciones, loading: loadingNotif, toggleVista } = useContext(NotificacionContext);
    const [modalShow, setModalShow] = useState(false);
    const [cartasModal, setCartasModal] = useState([]);
    const [notificacionModal, setNotificacionModal] = useState();

    const hideModal = () => {
        setModalShow(false);
        setCartasModal([]);
        setNotificacionModal(null);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "";
        const dateObj = typeof fecha === "string" ? new Date(fecha) : fecha.toDate ? fecha.toDate() : new Date(fecha);
        return `${dateObj.toLocaleDateString("es-ES")} - ${dateObj.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}`;
    };

    const getCartasFromNotif = (notif) => {
        if (notif.cartas && Array.isArray(notif.cartas) && notif.cartas.length > 0) {
            return notif.cartas;
        }
        const cartas = [];
        if (notif.hechizos && Array.isArray(notif.hechizos)) cartas.push(...notif.hechizos);
        if (notif.armas && Array.isArray(notif.armas)) cartas.push(...notif.armas);
        if (notif.armaduras && Array.isArray(notif.armaduras)) cartas.push(...notif.armaduras);
        if (notif.pasivas && Array.isArray(notif.pasivas)) cartas.push(...notif.pasivas);
        if (notif.comidas && Array.isArray(notif.comidas)) cartas.push(...notif.comidas);
        if (notif.objetos && Array.isArray(notif.objetos)) cartas.push(...notif.objetos);
        return cartas;
    };

    const handleClick = (notif) => {
        if (!notif.vista && !notif.tipo.includes('Asignación')) {
            const cartas = getCartasFromNotif(notif);
            if (cartas.length > 0) {
                setCartasModal(cartas);
                setNotificacionModal(notif);
                setModalShow(true);
            }
        }
    };

    const handleClickVista = async (notif) => {
        try {
            await toggleVista(notif.id, !notif.vista);
        } catch(error) {
            console.error("Error al actualizar notificación: ", error);
            ErrorPopUp(error?.response?.data?.error || "Error al actualizar notificación");
        }
    };

    const mostrarNotificacion = (notif) => {
        return (
            <div className={`notificacion ${(!notif.vista ? "sin-ver" : "vista")}`} key={notif.id}>
                <div className='d-flex align-items-center justify-content-between'>
                    {notif.mensaje && notif.mensaje !== "" && 
                        <p className='m-0'>{notif.mensaje}</p>}
                    <div className='d-flex align-items-center ms-auto'>
                        {!notif.tipo?.includes('Selección') && (
                            <button
                                type="button"
                                className={`btn-toggle-vista ${notif.vista ? 'vista' : 'no-vista'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickVista(notif);
                                }}
                                title={notif.vista ? "Marcar como no vista" : "Marcar como vista"}
                                aria-label={notif.vista ? "Marcar como no vista" : "Marcar como vista"}
                            >
                                {notif.vista ? <IconEye size={22} /> : <IconEyeOff size={22} />}
                            </button>
                        )}
                    </div>
                </div>
                    
                <div className='d-flex align-items-center mt-2'>
                    <img src="/src/assets/icon-calendario.png" alt="" className='imagen-calendario-notificacion me-1'/>
                    <p style={{margin: 0}}>{formatearFecha(notif.fecha)}</p>
                </div>
            </div>
        );
    };

    const mostrarNotificacionConCartas = (notif) => {
        const cartas = getCartasFromNotif(notif);
        const titulo = notif.tipo.includes('Asignación') ? 'Tienes una carta asignada:' : 'Tienes cartas para seleccionar:';

        return (
            <div className={`notificacion ${(!notif.vista ? "sin-ver" : "vista")}`} key={notif.id}>
                <div className='d-flex align-items-center justify-content-between'>
                    <p className='m-0'>{titulo}</p>
                    <div className='d-flex align-items-center'>
                        {!notif.tipo.includes('Selección') && (
                            <button
                                type="button"
                                className={`btn-toggle-vista ${notif.vista ? 'vista' : 'no-vista'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickVista(notif);
                                }}
                                title={notif.vista ? "Marcar como no vista" : "Marcar como vista"}
                                aria-label={notif.vista ? "Marcar como no vista" : "Marcar como vista"}
                            >
                                {notif.vista ? <IconEye size={22} /> : <IconEyeOff size={22} />}
                            </button>
                        )}
                    </div>
                </div>
                <Container className="cartas-notificacion d-flex flex-wrap align-items-center" onClick={() => handleClick(notif)}>
                    {cartas.map((carta) => {
                        const imgUrl = carta.imagen?.startsWith('http') ? carta.imagen : `/src/assets/cartas/${carta.imagen}`;
                        return (
                            <img 
                                key={carta.id} 
                                src={imgUrl} 
                                alt={carta.nombre || carta.clase || "Carta"} 
                                className='carta-notificacion mx-1'
                            />
                        );
                    })}
                </Container>
                <div className='d-flex align-items-center mt-2'>
                    <img src="/src/assets/icon-calendario.png" alt="" className='imagen-calendario-notificacion me-1'/>
                    <p style={{margin: 0}}>{formatearFecha(notif.fecha)}</p>
                </div>
            </div>
        );
    };

    const isLoading = loadingUsuario || loadingNotif;

    return (
        <div className="notificaciones d-flex flex-column align-items-center">
            {isLoading && <LoadingSpiner/>}
            {!isLoading && notificaciones && notificaciones.length > 0 && (
                notificaciones.map((notif) => {
                    const cartas = getCartasFromNotif(notif);
                    return cartas.length > 0 ? mostrarNotificacionConCartas(notif) : mostrarNotificacion(notif);
                })
            )}
            {!isLoading && notificaciones && notificaciones.length === 0 && (
                <p className="text-muted mt-4">No tienes notificaciones pendientes.</p>
            )}
            {!isLoading && (
                <ModalSeleccionarCartaNotif
                    show={modalShow}
                    onHide={hideModal}
                    cartas={cartasModal}
                    notificacion={notificacionModal}
                    admin={usuario?.rol === "admin"}
                />
            )}
        </div>
    );
}

export default Notificaciones;