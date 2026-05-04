import Container from "react-bootstrap/Container"
import { useMemo } from 'react';
import { getPasivas, createPasiva, updatePasiva, deletePasiva } from '../../services/PasivaService.js';
import TablaCRUD from '../../components/TablaCRUD.jsx';
function Pasiva() {
    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "ID", enableEditing: false, size: 40 },
            { accessorKey: "nombre", header: "Nombre" },
            { accessorKey: "descripcion", header: "Descripción" },
            { accessorKey: "imagen", header: "Imagen (URL)" },
        ],
        []
    );
    return (
        <Container className="pb-2 mt-4 mb-2">
            <h1>Pasivas</h1>
            <TablaCRUD name="Pasiva" columns={columns} get={getPasivas} create={createPasiva} update={updatePasiva} remove={deletePasiva} />
        </Container>
    );
};
export default Pasiva;