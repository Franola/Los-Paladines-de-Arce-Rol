import Container from "react-bootstrap/Container"
import { useMemo } from 'react';
import { getObjetos, createObjeto, updateObjeto, deleteObjeto } from '../../services/ObjetoService.js';
import TablaCRUD from '../../components/TablaCRUD.jsx';
function Objeto() {
    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "ID", enableEditing: false, size: 40 },
            { accessorKey: "nombre", header: "Nombre" },
            { accessorKey: "descripcion", header: "Descripción" },
            { accessorKey: "imagen", header: "Imagen (URL)" },
            { accessorKey: "peso", header: "Peso", type: "number" },
        ],
        []
    );
    return (
        <Container className="pb-2 mt-4 mb-2">
            <h1>Objetos</h1>
            <TablaCRUD name="Objeto" columns={columns} get={getObjetos} create={createObjeto} update={updateObjeto} remove={deleteObjeto} />
        </Container>
    );
};
export default Objeto;
