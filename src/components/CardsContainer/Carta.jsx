import "./styles.css";

function Carta({ item, onClick }) {
    
    return (
        <>
            <img className="carta-img" src={`/src/assets/cartas/${item.imagen}`} alt={item.clase} onClick={onClick}/>
        </>
    );
} 

export default Carta;