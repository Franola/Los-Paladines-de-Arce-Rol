import './Rama.css';
import  Container from "react-bootstrap/Container"
import { useMemo } from 'react';
import { getRamas, getRamaById, createRama, updateRama, deleteRama } from '../../services/RamaService.js';
import TablaCRUD from '../../components/TablaCRUD.jsx';

function Rama() {
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
            <h1>Ramas</h1>
            <TablaCRUD
                name="Rama"
                columns={columns}
                get={getRamas}
                create={createRama}
                update={updateRama}
                remove={deleteRama}
            />
        </Container>
    );
};

export default Rama