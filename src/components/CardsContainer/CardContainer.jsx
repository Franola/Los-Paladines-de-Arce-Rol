import './styles.css'
import CardList from './CardList'
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from 'react-router-dom';
import { UsuarioContext } from '../context/usuarioContext';
import LoadingSpiner from '../LoadingSpiner';
import { TIPOS_CARTAS } from '../../utils/constants.js';
import { getHechizos } from '../../services/HechizoService.js';
import { getArmas } from '../../services/ArmaService.js';
import { getArmaduras } from '../../services/ArmaduraService.js';
import { getComidas } from '../../services/ComidaService.js';
import { getObjetos } from '../../services/ObjetoService.js';
import { getPasivas } from '../../services/PasivaService.js';
import useAsync from '../../hooks/useAsync.js';

function CardContainer() {
    const { data: hechizos, loading: loadingHechizos, fetchData: fetchHechizos } = useAsync(getHechizos);
    const { data: armas, loading: loadingArmas, fetchData: fetchArmas } = useAsync(getArmas);
    const { data: armaduras, loading: loadingArmaduras, fetchData: fetchArmaduras } = useAsync(getArmaduras);
    const { data: comidas, loading: loadingComidas, fetchData: fetchComidas } = useAsync(getComidas);
    const { data: objetos, loading: loadingObjetos, fetchData: fetchObjetos } = useAsync(getObjetos);
    const { data: pasivas, loading: loadingPasivas, fetchData: fetchPasivas } = useAsync(getPasivas);

    const [categorias] = useState(TIPOS_CARTAS);
    const { categoriaParam } = useParams();
    const { usuario, loading: loadingUsuario } = useContext(UsuarioContext);

    useEffect(() => {
        if (!loadingUsuario && usuario) {
            if (!categoriaParam) {
                fetchHechizos();
                fetchArmas();
                fetchArmaduras();
                fetchComidas();
                fetchObjetos();
                fetchPasivas();
            } else {
                switch (categoriaParam) {
                    case "Hechizo": fetchHechizos(); break;
                    case "Pasiva": fetchPasivas(); break;
                    case "Arma": fetchArmas(); break;
                    case "Armadura": fetchArmaduras(); break;
                    case "Comida": fetchComidas(); break;
                    case "Objeto": fetchObjetos(); break;
                    default: break;
                }
            }
        }
    }, [loadingUsuario, usuario, categoriaParam]);

    const obtenerItemsPorCategoria = (categoria) => {
        switch (categoria) {
            case "Hechizo": return hechizos || [];
            case "Pasiva": return pasivas || [];
            case "Arma": return armas || [];
            case "Armadura": return armaduras || [];
            case "Comida": return comidas || [];
            case "Objeto": return objetos || [];
            default: return [];
        }
    }

    const vistaSinCategoria = () => {
        return (
            <>
                {categorias.map((cate) => {
                    const itemsFiltrados = obtenerItemsPorCategoria(cate);
                    if (itemsFiltrados.length === 0 && (!usuario || usuario.rol !== "admin")) return null;
                    return (
                        <div className='unaCategoria' key={cate}>
                            <div className="d-flex align-items-center mb-3">
                                <h1 className="mb-0">{cate}s</h1>
                                {usuario && usuario.rol === "admin" && (
                                    <Link to={`/admin/${cate.toLowerCase()}s`} className="btn btn-primary ms-3">Gestionar</Link>
                                )}
                            </div>
                            <CardList items={itemsFiltrados} />
                        </div>
                    );
                })}           
            </>
        );
    }

    const vistaConCategoria = () => {
        const itemsFiltrados = obtenerItemsPorCategoria(categoriaParam);
        return (
            <div className='unaCategoria'>
                <div className="d-flex align-items-center mb-3">
                    <h1 className="mb-0">{categoriaParam}s</h1>
                    {usuario && usuario.rol === "admin" && (
                        <Link to={`/admin/${categoriaParam.toLowerCase()}s`} className="btn btn-primary ms-3">Gestionar</Link>
                    )}
                </div>
                <CardList items={itemsFiltrados} />
            </div>
        );
    }

    return (
        <div className="itemListContainer">
            {loadingHechizos || loadingArmas || loadingArmaduras || loadingComidas || loadingObjetos || loadingPasivas
                ? <LoadingSpiner /> 
                : !categoriaParam ? vistaSinCategoria() : vistaConCategoria()
            }
        </div>
    )
}

export default CardContainer