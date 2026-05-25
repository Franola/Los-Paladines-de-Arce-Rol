import './Personaje.css';
import Container from "react-bootstrap/Container"
import { useMemo } from 'react';
import { getPersonajes, createPersonaje, updatePersonaje, deletePersonaje } from '../../services/PersonajeService.js';
import { getEspecies } from '../../services/EspecieService.js';
import { getClases } from '../../services/ClaseService.js';
import { getRamas } from '../../services/RamaService.js';
import { getUsuarios } from '../../services/UsuarioService.js';
import TablaCRUD from '../../components/TablaCRUD.jsx';
import useAsync from '../../hooks/useAsync.js';

function Personaje() {
    const { data: especies } = useAsync(getEspecies);
    const { data: clases } = useAsync(getClases);
    const { data: ramas } = useAsync(getRamas);
    const { data: usuarios } = useAsync(getUsuarios);

    const especiesOptions = useMemo(
        () => especies?.map(e => ({ value: String(e.id), label: e.descripcion })) || [],
        [especies]
    );

    const clasesOptions = useMemo(
        () => clases?.map(c => ({ value: String(c.id), label: c.descripcion })) || [],
        [clases]
    );

    const ramasOptions = useMemo(
        () => ramas?.map(r => ({ value: String(r.id), label: r.descripcion })) || [],
        [ramas]
    );

    const usuariosOptions = useMemo(
        () => usuarios?.map(u => ({ value: u.usuario, label: u.usuario })) || [],
        [usuarios]
    );

    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "ID", enableEditing: false, size: 40 },
            { accessorKey: "nombre", header: "Nombre" },
            { accessorKey: "nivel", header: "Nivel", type: "number" },
            { accessorKey: "vidaActual", header: "Vida Actual", type: "number" },
            { accessorKey: "vidaMaxima", header: "Vida Máxima", type: "number" },
            { accessorKey: "manaActual", header: "Maná Actual", type: "number" },
            { accessorKey: "manaMaxima", header: "Maná Máximo", type: "number" },
            {
                accessorFn: (row) => row.especieId?.toString(),
                id: "especieId",
                header: "Especie",
                editVariant: 'select',
                mantineEditSelectProps: {
                    data: especiesOptions,
                },
                Cell: ({ cell }) => {
                    const option = especiesOptions.find(o => o.value === cell.getValue());
                    return option ? option.label : cell.getValue();
                }
            },
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
            {
                accessorFn: (row) => row.ramaId?.toString(),
                id: "ramaId",
                header: "Rama",
                editVariant: 'select',
                mantineEditSelectProps: {
                    data: ramasOptions,
                },
                Cell: ({ cell }) => {
                    const option = ramasOptions.find(o => o.value === cell.getValue());
                    return option ? option.label : cell.getValue();
                }
            },
            {
                accessorFn: (row) => row.usuario?.usuario || row.usuario || "",
                id: "usuario",
                header: "Usuario",
                editVariant: 'select',
                mantineEditSelectProps: {
                    data: usuariosOptions,
                },
                Cell: ({ cell }) => {
                    return cell.getValue();
                }
            },
            { accessorKey: "fuerza", header: "Fuerza", type: "number" },
            { accessorKey: "destreza", header: "Destreza", type: "number" },
            { accessorKey: "constitucion", header: "Constitución", type: "number" },
            { accessorKey: "inteligencia", header: "Inteligencia", type: "number" },
            { accessorKey: "carisma", header: "Carisma", type: "number" },
            { accessorKey: "velocidad", header: "Velocidad", type: "number" },
            { accessorKey: "suerte", header: "Suerte", type: "number" },
            { accessorKey: "sabiduria", header: "Sabiduría", type: "number" },
            { accessorKey: "tamanio", header: "Tamaño", type: "number" },
            { accessorKey: "imagen", header: "Imagen (URL)" },
        ],
        [especiesOptions, clasesOptions, ramasOptions, usuariosOptions]
    );

    return (
        <Container className="pb-2 mt-4 mb-2">
            <h1>Personajes</h1>
            <TablaCRUD
                name="Personaje"
                columns={columns}
                get={getPersonajes}
                create={createPersonaje}
                update={updatePersonaje}
                remove={deletePersonaje}
            />
        </Container>
    );
}

export default Personaje;
