import Container from "react-bootstrap/Container"
import { useMemo } from 'react';
import { getArmaduras, createArmadura, updateArmadura, deleteArmadura } from '../../services/ArmaduraService.js';
import { getCategoriasArmadura } from '../../services/CategoriaArmaduraService.js';
import { getTiposArmadura } from '../../services/TipoArmaduraService.js';
import { getMateriales } from '../../services/MaterialService.js';
import TablaCRUD from '../../components/TablaCRUD.jsx';
import useAsync from '../../hooks/useAsync.js';

function Armadura() {
    const { data: categoriasArmadura } = useAsync(getCategoriasArmadura);
    const { data: tiposArmadura } = useAsync(getTiposArmadura);
    const { data: materiales } = useAsync(getMateriales);

    const categoriasOptions = useMemo(
        () => categoriasArmadura?.map(c => ({ value: String(c.id), label: c.descripcion })) || [],
        [categoriasArmadura]
    );
    const tiposOptions = useMemo(
        () => tiposArmadura?.map(c => ({ value: String(c.id), label: c.descripcion })) || [],
        [tiposArmadura]
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
            { accessorKey: "peso", header: "Peso", type: "number" },
            { 
                accessorFn: (row) => row.categoriaArmaduraId?.toString(),
                id: "categoriaArmaduraId", 
                header: "Categoria Armadura", 
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
                accessorFn: (row) => row.tipoArmaduraId?.toString(),
                id: "tipoArmaduraId", 
                header: "Tipo Armadura", 
                editVariant: 'select',
                mantineEditSelectProps: {
                    data: tiposOptions,
                },
                Cell: ({ cell }) => {
                    const option = tiposOptions.find(o => o.value === cell.getValue());
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
        [categoriasOptions, tiposOptions, materialesOptions]
    );
    return (
        <Container className="pb-2 mt-4 mb-2">
            <h1>Armaduras</h1>
            <TablaCRUD name="Armadura" columns={columns} get={getArmaduras} create={createArmadura} update={updateArmadura} remove={deleteArmadura} />
        </Container>
    );
};
export default Armadura;