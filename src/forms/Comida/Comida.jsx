import Container from "react-bootstrap/Container"
import { useMemo } from 'react';
import { getComidas, createComida, updateComida, deleteComida } from '../../services/ComidaService.js';
import TablaCRUD from '../../components/TablaCRUD.jsx';
function Comida() {
    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "ID", enableEditing: false, size: 40 },
            { accessorKey: "nombre", header: "Nombre"},
            { accessorKey: "descripcion", header: "Descripción" },
            { accessorKey: "imagen", header: "Imagen (URL)" },
            { accessorKey: "peso", header: "Peso", type: "number" },
        ],
        []
    );
    return (
        <Container className="pb-2 mt-4 mb-2">
            <h1>Comidas</h1>
            <TablaCRUD name="Comida" columns={columns} get={getComidas} create={createComida} update={updateComida} remove={deleteComida} />
        </Container>
    );
};
export default Comida;