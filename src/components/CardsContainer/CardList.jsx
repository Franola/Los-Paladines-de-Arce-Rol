import "./styles.css";
import Carta_bs from "./Carta_bs";
import Carta from "./Carta";
import { useParams } from 'react-router-dom';

function CardList({ items }) {
    console.log(items)
    
    return (
        <div className="itemList">
            {items.map((item) => (
                <Carta item={item} key={item.id}/>
            ))}
        </div>
    );
}

export default CardList;
