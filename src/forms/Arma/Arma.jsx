import Container from "react-bootstrap/Container"
import { useMemo } from 'react';
import { getArmas, createArma, updateArma, deleteArma } from '../../services/ArmaService.js';
import { getCategoriasArma } from '../../services/CategoriaArmaService.js';
import { getMateriales } from '../../services/MaterialService.js';
import TablaCRUD from '../../components/TablaCRUD.jsx';
import useAsync from '../../hooks/useAsync.js';

function Arma() {
    const { data: categoriasArma } = useAsync(getCategoriasArma);
    const { data: materiales } = useAsync(getMateriales);
    
    const categoriasOptions = useMemo(
        () => categoriasArma?.map(c => ({ value: String(c.id), label: c.descripcion })) || [],
        [categoriasArma]
    );
    const materialesOptions = useMemo(
        () => materiales?.map(m => ({ value: String(m.id), label: m.descripcion })) || [],
        [materiales]
    );

    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "ID", enableEditing: false, size: 40 },
            { accessorKey: "nombre", header: "Nombre" },
            { accessorKey: "descripcion", header: "Descripción" },
            { accessorKey: "imagen", header: "Imagen (URL)" },
            { accessorKey: "danio", header: "Daño", type: "number" },
            { accessorKey: "peso", header: "Peso", type: "number" },
            { 
                accessorFn: (row) => row.categoriaArmaId?.toString(),
                id: "categoriaArmaId", 
                header: "Categoria Arma", 
                editVariant: 'select',
                mantineEditSelectProps: {
                    data: categoriasOptions,
                },
                Cell: ({ cell }) => {
                    const option = categoriasOptions.find(o => o.value === cell.getValue());
                    return option ? option.label : cell.getValue();
                }
            },
            { 
                accessorFn: (row) => row.materialId?.toString(),
                id: "materialId", 
                header: "Material", 
                editVariant: 'select',
                mantineEditSelectProps: {
                    data: materialesOptions,
                },
                Cell: ({ cell }) => {
                    const option = materialesOptions.find(o => o.value === cell.getValue());
                    return option ? option.label : cell.getValue();
                }
            },
        ],
        [categoriasOptions, materialesOptions]
    );
    return (
        <Container className="pb-2 mt-4 mb-2">
            <h1>Armas</h1>
            <TablaCRUD name="Arma" columns={columns} get={getArmas} create={createArma} update={updateArma} remove={deleteArma} />
        </Container>
    );
};
export default Arma;