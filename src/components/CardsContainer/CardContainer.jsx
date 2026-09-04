import './styles.css'
import CardList from './CardList'
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from 'react-router-dom';
import { UsuarioContext } from '../context/usuarioContext';
import { PersonajeContext } from '../context/personajeContext';
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
    const { personajeActivo, inventario, loadingInventario, loadingPersonajes, setPersonajeActivo } = useContext(PersonajeContext);

    const esModoMaster = (usuario?.rol === "admin" && personajeActivo === null);

    useEffect(() => {
        if (!loadingUsuario && usuario && esModoMaster) {
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
    }, [loadingUsuario, usuario, categoriaParam, esModoMaster]);

    const obtenerItemsInventarioPorCategoria = (categoria) => {
        if (!inventario || inventario.length === 0) return [];
        switch (categoria) {
            case "Hechizo":
                return inventario.filter(i => i.hechizo).map(i => ({ ...i.hechizo, inventarioId: i.id, cantidad: i.cantidad, equipado: i.equipado }));
            case "Pasiva":
                return inventario.filter(i => i.pasiva).map(i => ({ ...i.pasiva, inventarioId: i.id, cantidad: i.cantidad, equipado: i.equipado }));
            case "Arma":
                return inventario.filter(i => i.arma).map(i => ({ ...i.arma, inventarioId: i.id, cantidad: i.cantidad, equipado: i.equipado }));
            case "Armadura":
                return inventario.filter(i => i.armadura).map(i => ({ ...i.armadura, inventarioId: i.id, cantidad: i.cantidad, equipado: i.equipado }));
            case "Comida":
                return inventario.filter(i => i.comida).map(i => ({ ...i.comida, inventarioId: i.id, cantidad: i.cantidad, equipado: i.equipado }));
            case "Objeto":
                return inventario.filter(i => i.objeto).map(i => ({ ...i.objeto, inventarioId: i.id, cantidad: i.cantidad, equipado: i.equipado }));
            default:
                return [];
        }
    };

    const obtenerItemsPorCategoria = (categoria) => {
        if (!esModoMaster) {
            return obtenerItemsInventarioPorCategoria(categoria);
        }
        switch (categoria) {
            case "Hechizo": return hechizos || [];
            case "Pasiva": return pasivas || [];
            case "Arma": return armas || [];
            case "Armadura": return armaduras || [];
            case "Comida": return comidas || [];
            case "Objeto": return objetos || [];
            default: return [];
        }
    };

    const renderBannerPersonaje = () => {
        if (personajeActivo) {
            return (
                <div className="mb-4 p-3 bg-dark rounded border border-secondary text-light d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h4 className="m-0 text-success fw-bold">
                            Inventario de {personajeActivo.nombre}
                            {personajeActivo.usuario?.usuario && (
                                <span className="text-white-50 fs-6 ms-2">(@{personajeActivo.usuario.usuario})</span>
                            )}
                        </h4>
                        <small className="">
                            Nivel {personajeActivo.nivel} • {personajeActivo.clase?.descripcion || 'Sin clase'} • PV: {personajeActivo.vidaActual}/{personajeActivo.vidaMaxima} • PM: {personajeActivo.manaActual}/{personajeActivo.manaMaxima}
                        </small>
                    </div>
                    {usuario?.rol === "admin" && (
                        <button 
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => setPersonajeActivo(null)}
                        >
                            👑 Volver a Modo Master
                        </button>
                    )}
                </div>
            );
        }

        if (esModoMaster) {
            return (
                <div className="mb-4 p-3 bg-dark rounded border border-warning text-light d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h4 className="m-0 text-warning fw-bold">👑 Modo Master</h4>
                        <small className="text-white-50">
                            Viendo todas las cartas existentes en la base de datos. Selecciona un personaje en la barra superior para ver su inventario.
                        </small>
                    </div>
                </div>
            );
        }

        return null;
    };

    const vistaSinCategoria = () => {
        return (
            <>
                {renderBannerPersonaje()}
                {!esModoMaster && !personajeActivo && !loadingPersonajes && (
                    <div className="alert alert-warning text-center my-4">
                        No tienes ningún personaje seleccionado o creado.
                    </div>
                )}
                {categorias.map((cate) => {
                    const itemsFiltrados = obtenerItemsPorCategoria(cate);
                    if (!usuario) return null;
                    return (
                        <div className='unaCategoria' key={cate}>
                            <div className="d-flex align-items-center mb-3">
                                <h1 className="mb-0">{cate}s</h1>
                                {esModoMaster && (
                                    <Link to={`/admin/${cate.toLowerCase()}s`} className="btn btn-primary ms-3">Gestionar</Link>
                                )}
                            </div>
                            <CardList items={itemsFiltrados} />
                        </div>
                    );
                })}           
            </>
        );
    };

    const vistaConCategoria = () => {
        const itemsFiltrados = obtenerItemsPorCategoria(categoriaParam);
        return (
            <div className='unaCategoria'>
                {renderBannerPersonaje()}
                <div className="d-flex align-items-center mb-3">
                    <h1 className="mb-0">{categoriaParam}s</h1>
                    {esModoMaster && (
                        <Link to={`/admin/${categoriaParam.toLowerCase()}s`} className="btn btn-primary ms-3">Gestionar</Link>
                    )}
                </div>
                <CardList items={itemsFiltrados} />
            </div>
        );
    };

    const isLoading = esModoMaster 
        ? (loadingHechizos || loadingArmas || loadingArmaduras || loadingComidas || loadingObjetos || loadingPasivas)
        : (loadingInventario || loadingPersonajes);

    return (
        <div className="itemListContainer">
            {isLoading
                ? <LoadingSpiner /> 
                : !categoriaParam ? vistaSinCategoria() : vistaConCategoria()
            }
        </div>
    );
}

export default CardContainer;