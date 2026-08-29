import Container from "react-bootstrap/Container";
import { useMemo } from 'react';
import { getHechizos, createHechizo, updateHechizo, deleteHechizo } from '../../services/HechizoService.js';
import { getClases } from "../../services/ClaseService.js";
import { getPersonajes } from "../../services/PersonajeService.js";
import { createNotificacion } from "../../services/NotificacionService.js";
import TablaCRUD from '../../components/TablaCRUD.jsx';
import useAsync from '../../hooks/useAsync.js';
import Swal from 'sweetalert2';

function Hechizo() {
    const { data: clasesArma } = useAsync(getClases);
    const { data: personajes } = useAsync(getPersonajes);

    const clasesOptions = useMemo(
        () => clasesArma?.map(c => ({ value: String(c.id), label: c.descripcion })) || [],
        [clasesArma]
    );

    const personajesAsignar = useMemo(
        () => personajes?.map(p => ({
            id: p.id,
            label: p.usuario?.usuario ? `${p.nombre} (${p.usuario.usuario})` : p.nombre
        })) || [],
        [personajes]
    );

    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "ID", enableEditing: false, size: 40 },
            { accessorKey: "nombre", header: "Nombre" },
            { accessorKey: "descripcion", header: "Descripción" },
            { accessorKey: "imagen", header: "Imagen (URL)" },
            { accessorKey: "mana", header: "Maná", type: "number" },
            { accessorKey: "danio", header: "Daño", type: "number" },
            { 
                accessorFn: (row) => row.claseId?.toString(),
                id: "claseId", 
                header: "Clase", 
                editVariant: 'select',
                mantineEditSelectProps: {
                    data: clasesOptions,
                },
                Cell: ({ cell }) => {
                    const option = clasesOptions.find(o => o.value === cell.getValue());
                    return option ? option.label : cell.getValue();
                }
            },
        ],
        [clasesOptions]
    );

    const asignarPersonaje = async (hechizoId, personajeIds) => {
        try {
            await createNotificacion({
                tipo: "Asignación de carta",
                personajeIds: personajeIds,
                hechizoIds: [hechizoId]
            });

            Swal.fire({
                title: '¡Hechizo asignado!',
                text: 'El hechizo se ha agregado al inventario del personaje y se ha notificado al jugador.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                background: '#1A1B1E',
                color: '#C1C2C5'
            });
        } catch (error) {
            console.error("Error al asignar hechizo:", error);
            Swal.fire({
                title: 'Error',
                text: error?.response?.data?.error || 'No se pudo asignar el hechizo.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
                background: '#1A1B1E',
                color: '#C1C2C5'
            });
        }
    };

    return (
        <Container className="pb-2 mt-4 mb-2">
            <h1>Hechizos</h1>
            <TablaCRUD 
                name="Hechizo" 
                columns={columns} 
                get={getHechizos} 
                create={createHechizo} 
                update={updateHechizo} 
                remove={deleteHechizo} 
                asignarItems={personajesAsignar}
                asignarFuncion={asignarPersonaje}
                asignarLabel="Personaje"
                asignarPlaceholder="Seleccione los personajes"
                asignarTooltip="Asignar personaje"
            />
        </Container>
    );
};

export default Hechizo;
