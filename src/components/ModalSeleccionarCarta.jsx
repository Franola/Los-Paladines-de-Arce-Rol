import { use } from 'react';
import './ModalSeleccionarCarta.css';
import Modal from 'react-bootstrap/Modal';
import { useEffect } from 'react';
import { useState } from 'react';


function ModalSeleccionarCarta(props) {
    const [cartasFiltradas, setCartasFiltradas] = useState([]);

    const handleClick = (id) => {
        if(props.cartasSeleccionadas.includes(id)) {
            props.onHide();
            return;
        }
        props.setCartasSeleccionadas([...props.cartasSeleccionadas, id]);
        console.log(id);
        props.onHide();
    }

    useEffect(() => {
        console.log(props.usuarioSeleccionado);
        if (props.usuarioSeleccionado && props.usuarioSeleccionado.personaje) {
            
            console.log(props.usuarioSeleccionado.personaje.rama);
            console.log(props.cartas);
            setCartasFiltradas(props.cartas.filter(
                (carta) =>
                    carta.rama == props.usuarioSeleccionado.personaje.rama &&
                    carta.clase == props.usuarioSeleccionado.personaje.clase
            ));
        } else {
            console.error("El campo 'personaje' no se encuentra en 'usuarioSeleccionado'");
            setCartasFiltradas([]);
        }
    }, [props.usuarioSeleccionado]);

    useEffect(() => {

        console.log(cartasFiltradas);
    }, [cartasFiltradas]);

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className='modal-seleccionar-carta'
            dialogClassName='modal-seleccionar-carta-dialog'
            contentClassName='modal-seleccionar-carta-content'
        >
            
            {cartasFiltradas.length > 0 ? (
                cartasFiltradas.map((item) => (
                    <img className={`imagen-modal-seleccionar-carta ${(props.cartasSeleccionadas.includes(item.id) ? "seleccionada" : "")}`} src={`/src/assets/cartas/${item.imagen}`} alt={item.clase} key={item.id} onClick={()=>handleClick(item.id)}/>
                ))
            ) : 
                props.cartas ? (
                    props.cartas.map((item) => (
                        <img className={`imagen-modal-seleccionar-carta ${(props.cartasSeleccionadas.includes(item.id) ? "seleccionada" : "")}`} src={`/src/assets/cartas/${item.imagen}`} alt={item.clase} key={item.id} onClick={()=>handleClick(item.id)}/>
                    ))
                ) : 
                    <></>
            }
        </Modal>
    );
}

export default ModalSeleccionarCarta;