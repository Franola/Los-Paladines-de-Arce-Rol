import './ModalSeleccionarCartaNotif.css';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateNotificacion } from '../services/NotificacionService.js';
import { createInventario } from '../services/InventarioService.js';
import { getPersonajes } from '../services/PersonajeService.js';
import { UsuarioContext } from './context/usuarioContext';
import Swal from 'sweetalert2';

function ModalSeleccionarCartaNotif(props) {
    const navigate = useNavigate();
    const { usuario } = useContext(UsuarioContext);
    const [cartaSeleccionada, setCartaSeleccionada] = useState();

    useEffect(() => {
        if (props.cartas && props.cartas.length === 1) {
            setCartaSeleccionada(props.cartas[0]);
        } else {
            setCartaSeleccionada(null);
        }
    }, [props.cartas, props.show]);

    const handleClick = (carta) => {
        if (!props.admin) {
            setCartaSeleccionada(carta);
        }
    };

    const handleCancelar = () => {
        props.onHide();
        setCartaSeleccionada(null);
    };

    const determinarCamposInventario = (carta, notif) => {
        const id = carta.id;

        if (notif?.armas?.length > 0) {
            return { armaId: id };
        }
        if (notif?.armaduras?.length > 0) {
            return { armaduraId: id };
        }
        if (notif?.hechizos?.length > 0) {
            return { hechizoId: id };
        }
        if (notif?.pasivas?.length > 0) {
            return { pasivaId: id };
        }
        if (notif?.comidas?.length > 0) {
            return { comidaId: id };
        }
        if (notif?.objetos?.length > 0) {
            return { objetoId: id };
        }

        return null;
    };

    const handleAceptar = async () => {
        if (!cartaSeleccionada) {
            Swal.fire({
                title: 'Seleccione una carta antes de aceptar',
                icon: 'warning',
                confirmButtonText: 'Ok',
                background: '#1A1B1E',
                color: '#C1C2C5'
            });
            return;
        }

        try {
            // 1. Obtener el personaje asignado
            let personajeId = props.notificacion?.personajeId || props.notificacion?.personaje?.id;

            if (!personajeId && usuario) {
                if (usuario.personajes && usuario.personajes.length > 0) {
                    personajeId = usuario.personajes[0].id;
                } else {
                    const personajes = await getPersonajes();
                    const miPersonaje = personajes?.find(
                        p => p.usuario?.id === usuario.id
                    );
                    if (miPersonaje) {
                        personajeId = miPersonaje.id;
                    }
                }
            }

            if (!personajeId) {
                throw new Error("No se pudo identificar el personaje para registrar la carta en el inventario");
            }

            // 2. Determinar tipo de carta y campos de Inventario
            const camposCarta = determinarCamposInventario(cartaSeleccionada, props.notificacion);

            if (!camposCarta) {
                throw new Error("No se pudo determinar el tipo de carta para registrarla en el inventario");
            }

            const inventarioData = {
                personajeId: personajeId,
                cantidad: 1,
                equipado: false,
                ...camposCarta
            };

            // 3. Crear registro en Inventario
            await createInventario(inventarioData);

            // 4. Actualizar la notificación como vista
            if (props.notificacion?.id) {
                await updateNotificacion(props.notificacion.id, {
                    vista: true
                });
            }

            Swal.fire({
                title: '¡Carta recibida!',
                text: 'Has aceptado la notificación e incorporado la carta a tu inventario correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                background: '#1A1B1E',
                color: '#C1C2C5'
            }).then(() => {
                props.onHide();
                setCartaSeleccionada(null);
                navigate(0);
            });
        } catch (error) {
            console.error('Error al procesar la notificación e inventario', error);
            Swal.fire({
                title: 'Error',
                text: error?.response?.data?.error || error.message || 'Error al procesar la notificación',
                icon: 'error',
                confirmButtonText: 'Ok',
                background: '#1A1B1E',
                color: '#C1C2C5'
            });
        }
    };

    const title = props.cartas?.length === 1 ? 'Carta asignada' : 'Seleccione una carta';

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
            <h2 className='mx-auto'>{title}</h2>
            <div className='cartas-seleccionables d-flex flex-wrap justify-content-center my-3'>
                {props.cartas?.map((item) => {
                    const imgUrl = item.imagen?.startsWith('http') ? item.imagen : `/src/assets/cartas/${item.imagen}`;
                    return (
                        <img 
                            className={`imagen-modal-seleccionar-carta ${(cartaSeleccionada && item.id === cartaSeleccionada.id ? "seleccionada" : "")}`} 
                            src={imgUrl} 
                            alt={item.nombre || item.clase || "Carta"} 
                            key={item.id} 
                            onClick={() => handleClick(item)}
                        />
                    );
                })}
            </div>

            <div className='mx-auto d-flex justify-content-center'>
                {!props.admin ? (
                    <>
                        <button className='btn btn-danger mx-2' onClick={handleCancelar}>Cancelar</button>
                        <button className='btn btn-success mx-2' onClick={handleAceptar}>Aceptar</button>
                    </>
                ) : (
                    <>
                        <button className='btn btn-danger mx-2' onClick={handleCancelar}>Cerrar</button>
                    </>
                )}
            </div>
        </Modal>
    );
}

export default ModalSeleccionarCartaNotif;