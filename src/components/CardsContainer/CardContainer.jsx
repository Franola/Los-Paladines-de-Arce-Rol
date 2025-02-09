import './styles.css'
import CardList from './CardList'
import { useEffect,useState } from "react";
import { useParams } from 'react-router-dom';

function CardContainer() {
    const [items, setItems] = useState([]);
    const {categoria} = useParams();


    return (
      <div className="itemListContainer">
        <h1>{(categoria != undefined ? categoria : "")}</h1>
        <CardList items={items}/>
      </div>
    )
}

export default CardContainer