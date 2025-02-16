import "./styles.css";
import Carta_bs from "./Carta_bs";
import Carta from "./Carta";
import { useParams } from 'react-router-dom';
import { useEffect,useState } from "react";
import ModalCarta from "../ModalCarta";
import React from 'react';

function CardList({ items }) {
    const [mostrarItem, setMostrarItem] = useState();
    const [modalShow, setModalShow] = React.useState(false);
    console.log(items)

    const click = (item) => {
        setMostrarItem(item);
        setModalShow(true);
        console.log(item)
    }
    
    return (
        <div className="itemList">
            {items.map((item) => (
                <Carta item={item} key={item.id} onClick={() => click(item)}/>
            ))}

            <ModalCarta
                show={modalShow}
                onHide={() => setModalShow(false)}
                onSubmit={() => setModalShow(false)}
                item={mostrarItem}
            />
        </div>
    );
}

export default CardList;
