import { useState } from 'react';
import {
    MRT_EditActionButtons,
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';
import useAsync from '../hooks/useAsync.js';
import { MantineProvider, Button, Stack, Title, Flex, Tooltip, ActionIcon, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ModalsProvider, modals } from '@mantine/modals';
import ErrorPopUp from './Popups/Error.jsx';

function TablaCRUD({ name, columns, get, create, update, remove }) {
    const { data, loading, fetchData, error } = useAsync(get);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveRow = async ({ table, row, values }) => {
        try{
            setIsSaving(true);
            await update(values._id, values);
            table.setEditingRow(null);
        }catch (error) {
            ErrorPopUp(error.response.data.error || "Error al actualizar");
            console.error("Error updating:", error);
        }
        finally{
            setIsSaving(false);
        }
    };

    const handleCreateRow = async ({ values, exitCreatingMode }) => {
        try {
            setIsSaving(true);
            await create(values);
            exitCreatingMode();
            await fetchData();
        } catch (error) {
            ErrorPopUp(error.response.data.error || "Error al crear");
            console.error("Error creating:", error);
        }
        finally{
            setIsSaving(false);
        }
    };

    const openDeleteConfirmModal = (row) => {
        modals.openConfirmModal({
            title: `Eliminar ${name}`,
            children: (
                <Text>
                    ¿Estas seguro de querer eliminar?
                </Text>
            ),
            labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                try{
                    setIsSaving(true);
                    await remove(row.original._id);
                    await fetchData();
                }
                catch (error) {
                    console.error("Error deleting:", error);
                    ErrorPopUp(error.response.data.error || "Error al eliminar");
                }
                finally{
                    setIsSaving(false);
                }
            },
        });
    }

    const table = useMantineReactTable({
        columns,
        data: data ?? [],
        
        initialState: {
            columnVisibility: {
                _id: false, //hide id column by default
                'mrt-row-expand': false, //hide row expand column by default
            },
        },
        paginationDisplayMode: 'pages',
        createDisplayMode: 'modal',
        onCreatingRowSave: handleCreateRow,
        enableEditing: true,
        editDisplayMode: "modal",
        onEditingRowSave: handleSaveRow,
        mantineTableHeadCellProps: {
            sx: {
                '& .mantine-TableHeadCell-Content': {
                    justifyContent: 'space-between',
                },
            },
        },
        renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
            <Stack>
                <Title order={3}>Agregar {name}</Title>
                {internalEditComponents}
                <Flex justify="flex-end" mt="xl">
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </Flex>
            </Stack>
        ),
        renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
            <Stack>
                <Title order={3}>Editar {name}</Title>
                {internalEditComponents}
                <Flex justify="flex-end" mt="xl">
                <MRT_EditActionButtons variant="text" table={table} row={row} />
                </Flex>
            </Stack>
        ),
        renderRowActions: ({ row, table }) => (
            <Flex gap="md">
                <Tooltip label="Edit">
                    <ActionIcon onClick={() => table.setEditingRow(row)}>
                        <IconEdit />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
                        <IconTrash />
                    </ActionIcon>
                </Tooltip>
            </Flex>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button
                onClick={() => {
                    table.setCreatingRow(true);
                }}
            >
                Nuevo
            </Button>
            <Button
                variant="outline"
                onClick={async () => {
                    await fetchData();
                }}
            >
                Actualizar
            </Button>
        </div>
        ),
        state: { 
            isLoading: loading,
            isSaving: isSaving,
        },
    });

    

    return (
        <MantineProvider
            theme={{ primaryColor: 'green', primaryShade: 8, colorScheme: 'dark' }}
        >
            <ModalsProvider>
                <MantineReactTable table={table} />
            </ModalsProvider>
        </MantineProvider>
    );
}

export default TablaCRUD;