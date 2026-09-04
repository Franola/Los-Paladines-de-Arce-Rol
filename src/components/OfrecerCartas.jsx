import './OfrecerCartas.css';
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import SelectorCartas from './SelectorCartas';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPersonajes } from '../services/PersonajeService.js';
import { getHechizos } from '../services/HechizoService.js';
import { getArmas } from '../services/ArmaService.js';
import { getArmaduras } from '../services/ArmaduraService.js';
import { getPasivas } from '../services/PasivaService.js';
import { getComidas } from '../services/ComidaService.js';
import { getObjetos } from '../services/ObjetoService.js';
import { createNotificacion } from '../services/NotificacionService.js';
import LoadingSpiner from './LoadingSpiner';
import Swal from 'sweetalert2';

function OfrecerCartas() {
    const [loading, setLoading] = useState(true);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const [personajes, setPersonajes] = useState([]);
    const [todasLasCartas, setTodasLasCartas] = useState([]);
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
    const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const [
                    personajesData,
                    hechizosData,
                    armasData,
                    armadurasData,
                    pasivasData,
                    comidasData,
                    objetosData
                ] = await Promise.all([
                    getPersonajes(),
                    getHechizos(),
                    getArmas(),
                    getArmaduras(),
                    getPasivas(),
                    getComidas(),
                    getObjetos()
                ]);

                setPersonajes(personajesData || []);

                const catalogo = [
                    ...(hechizosData || []).map(c => ({ ...c, tipoCarta: 'Hechizo' })),
                    ...(armasData || []).map(c => ({ ...c, tipoCarta: 'Arma' })),
                    ...(armadurasData || []).map(c => ({ ...c, tipoCarta: 'Armadura' })),
                    ...(pasivasData || []).map(c => ({ ...c, tipoCarta: 'Pasiva' })),
                    ...(comidasData || []).map(c => ({ ...c, tipoCarta: 'Comida' })),
                    ...(objetosData || []).map(c => ({ ...c, tipoCarta: 'Objeto' }))
                ];

                setTodasLasCartas(catalogo);
            } catch (error) {
                console.error("Error al cargar datos para ofrecer cartas:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los personajes o cartas del sistema.',
                    icon: 'error',
                    background: '#1A1B1E',
                    color: '#C1C2C5'
                });
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    const handlePersonajeChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setPersonajeSeleccionado(null);
            return;
        }
        const personajeId = parseInt(value, 10);
        const p = personajes.find(item => item.id === personajeId);
        setPersonajeSeleccionado(p || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!personajeSeleccionado) {
            Swal.fire({
                title: 'Seleccione un personaje',
                text: 'Debe seleccionar el personaje destinatario de la oferta.',
                icon: 'warning',
                background: '#1A1B1E',
                color: '#C1C2C5'
            });
            return;
        }

        if (cartasSeleccionadas.length === 0) {
            Swal.fire({
                title: 'Seleccione al menos una carta',
                text: 'Debe agregar una o más cartas para ofrecer al jugador.',
                icon: 'warning',
                background: '#1A1B1E',
                color: '#C1C2C5'
            });
            return;
        }

        try {
            setSent(true);

            // Agrupar IDs por tipo de carta
            const hechizoIds = cartasSeleccionadas.filter(c => c.tipoCarta === 'Hechizo').map(c => c.id);
            const armaIds = cartasSeleccionadas.filter(c => c.tipoCarta === 'Arma').map(c => c.id);
            const armaduraIds = cartasSeleccionadas.filter(c => c.tipoCarta === 'Armadura').map(c => c.id);
            const pasivaIds = cartasSeleccionadas.filter(c => c.tipoCarta === 'Pasiva').map(c => c.id);
            const comidaIds = cartasSeleccionadas.filter(c => c.tipoCarta === 'Comida').map(c => c.id);
            const objetoIds = cartasSeleccionadas.filter(c => c.tipoCarta === 'Objeto').map(c => c.id);

            const payload = {
                tipo: 'Selección de carta',
                personajeIds: [personajeSeleccionado.id],
                ...(hechizoIds.length > 0 && { hechizoIds }),
                ...(armaIds.length > 0 && { armaIds }),
                ...(armaduraIds.length > 0 && { armaduraIds }),
                ...(pasivaIds.length > 0 && { pasivaIds }),
                ...(comidaIds.length > 0 && { comidaIds }),
                ...(objetoIds.length > 0 && { objetoIds })
            };

            await createNotificacion(payload);

            Swal.fire({
                title: '¡Oferta de cartas enviada!',
                text: `Se notificó a @${personajeSeleccionado.usuario?.usuario || 'jugador'} para su personaje ${personajeSeleccionado.nombre}.`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                background: '#1A1B1E',
                color: '#C1C2C5'
            }).then(() => {
                navigate('/');
            });
        } catch (err) {
            console.error('Error al registrar la oferta de cartas:', err);
            Swal.fire({
                title: 'Error',
                text: err?.response?.data?.error || 'Error al enviar la oferta de cartas.',
                icon: 'error',
                background: '#1A1B1E',
                color: '#C1C2C5'
            });
        } finally {
            setSent(false);
        }
    };

    if (loading) {
        return <LoadingSpiner />;
    }

    return (
        <Container className="pb-4 mt-4 mb-2">
            <div className="w-75 m-auto bg-dark p-4 rounded border border-secondary text-light">
                <h2 className="mb-4 text-center fw-bold">Ofrecer Cartas a un Personaje</h2>

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formPersonaje" className="mb-4">
                        <Form.Label className="fw-semibold">Personaje Destinatario</Form.Label>
                        <Form.Select 
                            aria-label="Seleccione el personaje" 
                            required 
                            onChange={handlePersonajeChange}
                            defaultValue=""
                            className="bg-secondary text-light border-0 py-2"
                        >
                            <option value="" disabled>-- Seleccione el personaje --</option>
                            {personajes.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} (Nvl {p.nivel} - {p.clase?.descripcion || 'Sin clase'}) • Usuario: @{p.usuario?.usuario || 'Sin usuario'}
                                </option>
                            ))}
                        </Form.Select>
                        {personajeSeleccionado && (
                            <Form.Text className="text-success mt-1 d-block">
                                ✓ Usuario asociado: <strong>@{personajeSeleccionado.usuario?.usuario || 'Desconocido'}</strong>
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formCartas" className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="m-0 fw-semibold">Cartas a Ofrecer</Form.Label>
                            <small className="text-white-50">
                                {cartasSeleccionadas.length} seleccionada(s)
                            </small>
                        </div>
                        <SelectorCartas 
                            cartas={todasLasCartas} 
                            cartasSeleccionadas={cartasSeleccionadas} 
                            setCartasSeleccionadas={setCartasSeleccionadas} 
                            personajeSeleccionado={personajeSeleccionado}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="outline-light" onClick={() => navigate('/')}>
                            Cancelar
                        </Button>
                        <Button 
                            variant="success" 
                            type="submit" 
                            disabled={sent || !personajeSeleccionado || cartasSeleccionadas.length === 0}
                        >
                            {sent ? 'Enviando...' : 'Enviar Notificación de Oferta'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
}

export default OfrecerCartas;