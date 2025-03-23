import './SelectorCartas.css';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import ModalSeleccionarCarta from './ModalSeleccionarCarta';

function SelectorCartas({cartas, setCartas, cartasSeleccionadas, setCartasSeleccionadas, usuarioSeleccionado}) {
    const [modalShow, setModalShow] = useState(false);

    const eliminarCarta = (cartaEliminada) => {
        const cartasFiltradas = cartasSeleccionadas.filter(carta => carta.id !== cartaEliminada.id);
        setCartasSeleccionadas(cartasFiltradas);
    }

    return (
        <>
            <Container className="selectorCartas d-flex flex-wrap align-items-center">
                {cartasSeleccionadas.map((carta) => {
                    return (
                            <img key={carta.id} src={`/src/assets/cartas/${carta.imagen}`} alt={carta.clase} className='carta-seleccionada mx-1' onClick={()=>eliminarCarta(carta)}/>
                        );
                })}
                <div className="carta-sin-seleccion d-flex justify-content-center align-items-center mx-1" onClick={()=>setModalShow(true)}>
                    <img src="/src/assets/icon-mas.png" alt="" className='mas'/>
                </div>
            </Container>

            <ModalSeleccionarCarta
                show={modalShow}
                onHide={() => setModalShow(false)}
                cartasSeleccionadas={cartasSeleccionadas}
                setCartasSeleccionadas={setCartasSeleccionadas}
                cartas={cartas}
                setCartas={setCartas}
                usuarioSeleccionado={usuarioSeleccionado}
            />
        </>
    )
}

export default SelectorCartas