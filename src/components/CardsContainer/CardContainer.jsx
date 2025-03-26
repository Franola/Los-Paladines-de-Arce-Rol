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
import { useContext } from "react";
import { UsuarioContext } from '../context/usuarioContext';
import { use } from 'react';
import LoadingSpiner from '../LoadingSpiner';

function CardContainer() {
    const [items, setItems] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const {categoriaParam} = useParams();
    const { usuario } = useContext(UsuarioContext);
    const [itemsUsuario, setItemsUsuario] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true);
        const db = getFirestore();

        let refCollection = collection(db, "Cartas");
        getDocs(refCollection)
            .then((snapshot) => {
                setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            })

        let refCollectionCategorias = collection(db, "Categoria");
        getDocs(refCollectionCategorias)
            .then((snapshot) => {
                setCategorias(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            })
            .finally(() => {
                setLoading(false);
            })
            
    },[]);

    useEffect(() => {
        if(items.length > 0) {
            if(!usuario.admin){
                setItemsUsuario(items.filter(item => item.usuarios.includes(usuario.id)));
            } else {
                setItemsUsuario(items);
            }
        }
    },[items, usuario]);



    const vistaSinCategoria = () => {
        return (
            <>
                {categorias.map((cate) => {
                    const itemsFiltrados = itemsUsuario.filter(item => item.categoria == cate.descripcion);
                    if(itemsFiltrados.length == 0) return null;
                    return (
                        <div className='unaCategoria' key={cate.id}>
                            <h1>{cate.descripcion}s</h1>

                            <CardList items={itemsFiltrados}/>
                        </div>
                    );
                })}           
            </>
        );
    }

    const vistaConCategoria = () => {
        const itemsFiltrados = itemsUsuario.filter(item => item.categoria == categoriaParam);
        
        return (
            <>
                <h1>{categoriaParam}</h1>
                <CardList items={itemsFiltrados}/>
            </>
        );
    }

    return (
        <div className="itemListContainer">
            {loading ? <LoadingSpiner /> :
                categoriaParam == undefined ? vistaSinCategoria() : vistaConCategoria()
            }
        </div>
    )
}

export default CardContainer