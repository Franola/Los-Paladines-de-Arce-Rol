import "./styles.css";

function Carta({ item }) {

    return (
        <img src={`/src/assets/cartas/${item.imagen}`} alt={item.clase.descripcion}/>
    );
} 

export default Carta;