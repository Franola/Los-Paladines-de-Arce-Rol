import './SelectorCartas.css';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import ModalSeleccionarCarta from './ModalSeleccionarCarta';

function SelectorCartas({ cartas, cartasSeleccionadas, setCartasSeleccionadas, personajeSeleccionado }) {
    const [modalShow, setModalShow] = useState(false);

    const eliminarCarta = (cartaEliminada) => {
        const cartasFiltradas = cartasSeleccionadas.filter(
            carta => !(carta.id === cartaEliminada.id && carta.tipoCarta === cartaEliminada.tipoCarta)
        );
        setCartasSeleccionadas(cartasFiltradas);
    };

    return (
        <>
            <Container className="selectorCartas d-flex flex-wrap align-items-center p-2 rounded bg-dark border border-secondary gap-2">
                {cartasSeleccionadas.map((carta) => {
                    const imgUrl = carta.imagen?.startsWith('http') ? carta.imagen : `/src/assets/cartas/${carta.imagen}`;
                    return (
                        <div key={`${carta.tipoCarta}-${carta.id}`} className="position-relative">
                            <img 
                                src={imgUrl} 
                                alt={carta.nombre || carta.tipoCarta} 
                                className='carta-seleccionada shadow-sm'
                                onClick={() => eliminarCarta(carta)}
                                title="Haga clic para remover"
                                style={{ cursor: 'pointer', borderRadius: '6px' }}
                            />
                            <span 
                                className="badge bg-danger rounded-circle position-absolute top-0 end-0"
                                style={{ cursor: 'pointer', transform: 'translate(30%, -30%)' }}
                                onClick={() => eliminarCarta(carta)}
                            >
                                ✕
                            </span>
                        </div>
                    );
                })}
                <div 
                    className="carta-sin-seleccion d-flex flex-column justify-content-center align-items-center" 
                    onClick={() => setModalShow(true)}
                    title="Añadir cartas a la oferta"
                    style={{ cursor: 'pointer' }}
                >
                    <img src="/src/assets/icon-mas.png" alt="Agregar" className='mas mb-1'/>
                    <small className="text-white-50" style={{ fontSize: '0.7rem' }}>Agregar</small>
                </div>
            </Container>

            <ModalSeleccionarCarta
                show={modalShow}
                onHide={() => setModalShow(false)}
                cartasSeleccionadas={cartasSeleccionadas}
                setCartasSeleccionadas={setCartasSeleccionadas}
                cartas={cartas}
                personajeSeleccionado={personajeSeleccionado}
            />
        </>
    );
}

export default SelectorCartas;