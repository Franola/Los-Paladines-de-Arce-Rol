import './AdminNotificaciones.css';
import './Notificaciones.css';
import { useEffect, useState, useContext } from "react";
import { Container } from 'react-bootstrap';
import { UsuarioContext } from './context/usuarioContext';
import { getNotificaciones, updateNotificacion } from '../services/NotificacionService.js';
import LoadingSpiner from './LoadingSpiner';
import ModalSeleccionarCartaNotif from './ModalSeleccionarCartaNotif';
import ErrorPopUp from './Popups/Error.jsx';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

function AdminNotificaciones() {
    const { usuario, loading: loadingUsuario } = useContext(UsuarioContext);
    const [loading, setLoading] = useState(true);
    const [notificaciones, setNotificaciones] = useState([]);
    const [filtroUsuario, setFiltroUsuario] = useState('todos');
    const [modalShow, setModalShow] = useState(false);
    const [cartasModal, setCartasModal] = useState([]);
    const [notificacionModal, setNotificacionModal] = useState();

    const fetchNotificaciones = async () => {
        try {
            setLoading(true);
            const data = await getNotificaciones();
            setNotificaciones(data || []);
        } catch (error) {
            console.error("Error al obtener notificaciones en admin:", error);
            ErrorPopUp(error?.response?.data?.error || "Error al cargar notificaciones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loadingUsuario && usuario) {
            fetchNotificaciones();
        }
    }, [loadingUsuario, usuario]);

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
        const cartas = getCartasFromNotif(notif);
        if (cartas.length > 0) {
            setCartasModal(cartas);
            setNotificacionModal(notif);
            setModalShow(true);
        }
    };

    const handleToggleVista = async (notif) => {
        try {
            const nuevaVista = !notif.vista;
            await updateNotificacion(notif.id, { vista: nuevaVista });
            setNotificaciones((prev) =>
                prev.map((n) => (n.id === notif.id ? { ...n, vista: nuevaVista } : n))
            );
        } catch (error) {
            console.error("Error al actualizar estado de notificación:", error);
            ErrorPopUp(error?.response?.data?.error || "Error al actualizar la notificación");
        }
    };

    // Extraer lista única de usuarios con notificaciones para el selector de filtro
    const usuariosUnicos = Array.from(
        new Map(
            notificaciones
                .filter(n => n.usuario)
                .map(n => [n.usuario.id, n.usuario])
        ).values()
    );

    const notificacionesFiltradas = notificaciones.filter((notif) => {
        if (filtroUsuario === 'todos') return true;
        return notif.usuarioId === parseInt(filtroUsuario, 10);
    });

    const renderHeaderNotificacion = (notif) => {
        return (
            <div className='d-flex align-items-center justify-content-between mb-2'>
                <div className='d-flex align-items-center flex-wrap gap-2'>
                    {notif.usuario && (
                        <span className="badge bg-primary d-inline-flex align-items-center py-1 px-2">
                            <img src="/src/assets/icon-usuario.png" alt="Usuario" className='imagen-usuario-notificacion me-1'/>
                            <span>@{notif.usuario.usuario || notif.usuario.nombre}</span>
                        </span>
                    )}
                    {notif.tipo && (
                        <span className="badge bg-dark border border-secondary text-light">
                            {notif.tipo}
                        </span>
                    )}
                </div>
                <div className='d-flex align-items-center'>
                    <button
                        type="button"
                        className={`btn-toggle-vista ${notif.vista ? 'vista' : 'no-vista'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleVista(notif);
                        }}
                        title={notif.vista ? "Marcar como no vista" : "Marcar como vista"}
                        aria-label={notif.vista ? "Marcar como no vista" : "Marcar como vista"}
                    >
                        {notif.vista ? <IconEye size={22} /> : <IconEyeOff size={22} />}
                    </button>
                </div>
            </div>
        );
    };

    const renderFooterNotificacion = (notif) => {
        return (
            <div className='d-flex align-items-center mt-2'>
                <img src="/src/assets/icon-calendario.png" alt="" className='imagen-calendario-notificacion me-1'/>
                <small className="text-white-50">{formatearFecha(notif.fecha)}</small>
            </div>
        );
    };

    const mostrarNotificacion = (notif) => {
        return (
            <div className={`notificacion ${(!notif.vista ? "sin-ver" : "vista")}`} key={notif.id}>
                {renderHeaderNotificacion(notif)}
                {notif.mensaje && notif.mensaje !== "" && (
                    <p className='m-0 my-1 text-light'>{notif.mensaje}</p>
                )}
                {renderFooterNotificacion(notif)}
            </div>
        );
    };

    const mostrarNotificacionConCartas = (notif) => {
        const cartas = getCartasFromNotif(notif);
        const titulo = notif.tipo?.includes('Asignación') ? 'Carta asignada:' : 'Cartas para seleccionar:';

        return (
            <div className={`notificacion ${(!notif.vista ? "sin-ver" : "vista")}`} key={notif.id}>
                {renderHeaderNotificacion(notif)}
                <p className='m-0 mb-2 text-light fw-semibold'>{titulo}</p>
                <Container className="cartas-notificacion d-flex flex-wrap align-items-center p-0" onClick={() => handleClick(notif)}>
                    {cartas.map((carta) => {
                        const imgUrl = carta.imagen?.startsWith('http') ? carta.imagen : `/src/assets/cartas/${carta.imagen}`;
                        return (
                            <img 
                                key={carta.id} 
                                src={imgUrl} 
                                alt={carta.nombre || carta.clase || "Carta"} 
                                className='carta-notificacion mx-1 shadow-sm'
                            />
                        );
                    })}
                </Container>
                {renderFooterNotificacion(notif)}
            </div>
        );
    };

    const isLoading = loadingUsuario || loading;

    return (
        <div className="notificaciones d-flex flex-column align-items-center px-3 py-4">
            <div className="w-100 d-flex flex-column align-items-center" style={{ maxWidth: '800px' }}>
                <div className="d-flex justify-content-between align-items-center w-100 mb-3 flex-wrap gap-2">
                    <h3 className="m-0 text-light fw-bold">Gestión de Notificaciones (Admin)</h3>
                    {usuariosUnicos.length > 0 && (
                        <div className="d-flex align-items-center">
                            <label htmlFor="filtro-usuario" className="me-2 text-white-50 text-nowrap" style={{ fontSize: '0.9rem' }}>
                                Filtrar por usuario:
                            </label>
                            <select
                                id="filtro-usuario"
                                className="form-select form-select-sm bg-dark text-light border-secondary"
                                value={filtroUsuario}
                                onChange={(e) => setFiltroUsuario(e.target.value)}
                            >
                                <option value="todos">Todos los usuarios ({notificaciones.length})</option>
                                {usuariosUnicos.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        @{u.usuario || u.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {isLoading && <LoadingSpiner />}

                {!isLoading && notificacionesFiltradas.length > 0 && (
                    notificacionesFiltradas.map((notif) => {
                        const cartas = getCartasFromNotif(notif);
                        return cartas.length > 0 ? mostrarNotificacionConCartas(notif) : mostrarNotificacion(notif);
                    })
                )}

                {!isLoading && notificacionesFiltradas.length === 0 && (
                    <div className="text-center py-5">
                        <p className="text-muted fs-5">No se encontraron notificaciones.</p>
                    </div>
                )}

                {!isLoading && (
                    <ModalSeleccionarCartaNotif
                        show={modalShow}
                        onHide={hideModal}
                        cartas={cartasModal}
                        notificacion={notificacionModal}
                        admin={true}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminNotificaciones;