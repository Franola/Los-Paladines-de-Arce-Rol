import './styles.css'
import CardList from './CardList'
import { useEffect,useState } from "react";
import { useParams } from 'react-router-dom';
import {
    getFirestore,
    getDocs,
    collection,
    where,
    query,
  } from "firebase/firestore";

function CardContainer() {
    const [items, setItems] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const {categoriaParam} = useParams();
    console.log(categoriaParam)

    useEffect(() => {
        const db = getFirestore();

        let refCollection = collection(db, "Cartas");
        getDocs(refCollection)
            .then((snapshot) => {
                setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            })
            .finally(() => console.log(items));

        let refCollectionCategorias = collection(db, "Categoria");
        getDocs(refCollectionCategorias)
            .then((snapshot) => {
                setCategorias(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            })
            .finally(() => console.log(categorias));
    },[]);



    const vistaSinCategoria = () => {
        console.log("sin categoria")
        return (
            <>
                {console.log(categorias)}
                {categorias.map((cate) => {
                    const itemsFiltrados = items.filter(item => item.categoria.descripcion == cate.descripcion);
                    if(itemsFiltrados.length == 0) return null;
                    return (
                        <div className='unaCategoria' key={cate.id}>
                            {console.log(cate)}

                            <h1>{cate.descripcion}s</h1>

                            <CardList items={itemsFiltrados}/>
                        </div>
                    );
                })}           
            </>
        );
    }

    const vistaConCategoria = () => {
        const itemsFiltrados = items.filter(item => item.categoria.descripcion == categoriaParam);
        
        return (
            <>
                <h1>{categoriaParam}</h1>
                <CardList items={itemsFiltrados}/>
            </>
        );
    }

    return (
        <div className="itemListContainer">
            {categoriaParam == undefined ? vistaSinCategoria() : vistaConCategoria()}
        </div>
    )
}

export default CardContainer