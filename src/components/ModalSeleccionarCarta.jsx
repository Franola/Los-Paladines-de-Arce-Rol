import './ModalSeleccionarCarta.css';
import Modal from 'react-bootstrap/Modal';
import { useState, useMemo } from 'react';

function ModalSeleccionarCarta(props) {
    const { 
        show, 
        onHide, 
        cartas = [], 
        cartasSeleccionadas = [], 
        setCartasSeleccionadas, 
        personajeSeleccionado 
    } = props;

    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroTexto, setFiltroTexto] = useState('');

    const handleClick = (carta) => {
        if (cartasSeleccionadas.some(c => c.id === carta.id && c.tipoCarta === carta.tipoCarta)) {
            // Deseleccionar si ya estaba
            setCartasSeleccionadas(cartasSeleccionadas.filter(c => !(c.id === carta.id && c.tipoCarta === carta.tipoCarta)));
        } else {
            // Agregar a la selección
            setCartasSeleccionadas([...cartasSeleccionadas, carta]);
        }
    };

    const cartasFiltradas = useMemo(() => {
        let list = cartas;

        // Si hay personaje seleccionado y tiene clase, podemos priorizar/filtrar si aplica o permitir filtrar por tipo
        if (filtroTipo !== 'todos') {
            list = list.filter(c => c.tipoCarta === filtroTipo);
        }

        if (filtroTexto.trim() !== '') {
            const query = filtroTexto.toLowerCase();
            list = list.filter(c => 
                (c.nombre && c.nombre.toLowerCase().includes(query)) ||
                (c.descripcion && c.descripcion.toLowerCase().includes(query)) ||
                (c.tipoCarta && c.tipoCarta.toLowerCase().includes(query))
            );
        }

        return list;
    }, [cartas, filtroTipo, filtroTexto]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            aria-labelledby="modal-seleccionar-cartas-admin"
            centered
            className='modal-seleccionar-carta'
            dialogClassName='modal-seleccionar-carta-dialog'
            contentClassName='modal-seleccionar-carta-content bg-dark text-light border border-secondary p-3'
        >
            <Modal.Header closeButton closeVariant="white" className="border-secondary w-100">
                <Modal.Title className="fs-5">
                    Seleccionar Cartas a Ofrecer {personajeSeleccionado?.nombre ? `para ${personajeSeleccionado.nombre}` : ''}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="w-100">
                {/* Controles de Filtros */}
                <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
                    <input
                        type="text"
                        className="form-control form-control-sm bg-secondary text-white border-0"
                        style={{ maxWidth: '250px' }}
                        placeholder="Buscar por nombre o efecto..."
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                    />
                    <select
                        className="form-select form-select-sm bg-secondary text-white border-0"
                        style={{ maxWidth: '180px' }}
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                    >
                        <option value="todos">Todos los tipos</option>
                        <option value="Hechizo">Hechizos</option>
                        <option value="Arma">Armas</option>
                        <option value="Armadura">Armaduras</option>
                        <option value="Pasiva">Pasivas</option>
                        <option value="Comida">Comidas</option>
                        <option value="Objeto">Objetos</option>
                    </select>
                    <span className="text-white-50 ms-auto fs-6">
                        {cartasSeleccionadas.length} carta(s) seleccionada(s)
                    </span>
                </div>

                {/* Galería de Cartas */}
                <div className="d-flex flex-wrap justify-content-center gap-3 py-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {cartasFiltradas.length > 0 ? (
                        cartasFiltradas.map((item) => {
                            const isSelected = cartasSeleccionadas.some(c => c.id === item.id && c.tipoCarta === item.tipoCarta);
                            const imgUrl = item.imagen?.startsWith('http') ? item.imagen : `/src/assets/cartas/${item.imagen}`;
                            return (
                                <div
                                    key={`${item.tipoCarta}-${item.id}`}
                                    className={`card-wrapper position-relative cursor-pointer ${isSelected ? 'seleccionada-wrapper' : ''}`}
                                    onClick={() => handleClick(item)}
                                    style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                                >
                                    <img 
                                        className={`imagen-modal-seleccionar-carta ${isSelected ? "seleccionada border border-3 border-success" : ""}`} 
                                        src={imgUrl} 
                                        alt={item.nombre || item.tipoCarta}
                                        style={{ width: '130px', height: '185px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                    {isSelected && (
                                        <div className="badge bg-success position-absolute top-0 end-0 m-1">
                                            ✓
                                        </div>
                                    )}
                                    <div className="text-center mt-1">
                                        <small className="d-block text-truncate" style={{ maxWidth: '130px', fontSize: '0.75rem' }}>
                                            {item.nombre}
                                        </small>
                                        <span className="badge bg-dark border border-secondary" style={{ fontSize: '0.65rem' }}>
                                            {item.tipoCarta}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-muted my-5">
                            No se encontraron cartas con los filtros seleccionados.
                        </div>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer className="border-secondary w-100 justify-content-end">
                <button className="btn btn-primary" onClick={onHide}>
                    Listo ({cartasSeleccionadas.length})
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalSeleccionarCarta;