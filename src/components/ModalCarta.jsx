import './ModalCarta.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function ModalCarta(props) {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            {props.item ? (
                <img className='imagen-modal' src={`/src/assets/cartas/${props.item.imagen}`} alt={props.item.clase.descripcion} />
            ) : 
                <></>
            }
        </Modal>
    );
}

export default ModalCarta;