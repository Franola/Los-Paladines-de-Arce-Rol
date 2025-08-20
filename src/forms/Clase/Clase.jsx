import './Clase.css';
import  Container from "react-bootstrap/Container"
import { useMemo } from 'react';
import { getClases, getClaseById, createClase, updateClase, deleteClase } from '../../services/ClaseService.js';
import TablaCRUD from '../../components/TablaCRUD.jsx';

function Clase() {
    const columns = useMemo(
        () => [
            {
                accessorKey: "_id",
                header: "ID",
                enableEditing: false,
                size: 40,
                
            },
            {
                accessorKey: "descripcion",
                header: "Descripción",
            },
        ],
        []
    );


    return (
        <Container className="pb-2 mt-4 mb-2">
            <TablaCRUD name="Clase" columns={columns} get={getClases} create={createClase} update={updateClase} remove={deleteClase} />
        </Container>
    );
};

export default Clase