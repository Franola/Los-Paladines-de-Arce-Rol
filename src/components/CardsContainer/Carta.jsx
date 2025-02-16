import "./styles.css";

function Carta({ item, onClick }) {
    
    return (
        <>
            <img src={`/src/assets/cartas/${item.imagen}`} alt={item.clase.descripcion} onClick={onClick}/>
        </>
    );
} 

export default Carta;