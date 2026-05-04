import Container from "react-bootstrap/Container"
import { useMemo } from 'react';
import { getHechizos, createHechizo, updateHechizo, deleteHechizo } from '../../services/HechizoService.js';
import { getClases } from "../../services/ClaseService.js";
import TablaCRUD from '../../components/TablaCRUD.jsx';
import useAsync from '../../hooks/useAsync.js';

function Hechizo() {
    const { data: clasesArma } = useAsync(getClases);
    
    const clasesOptions = useMemo(
        () => clasesArma?.map(c => ({ value: String(c.id), label: c.descripcion })) || [],
        [clasesArma]
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

    return (
        <Container className="pb-2 mt-4 mb-2">
            <h1>Hechizos</h1>
            <TablaCRUD name="Hechizo" columns={columns} get={getHechizos} create={createHechizo} update={updateHechizo} remove={deleteHechizo} />
        </Container>
    );
};

export default Hechizo;
