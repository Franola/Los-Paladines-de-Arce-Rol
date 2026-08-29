import { useState } from 'react';
import { MultiSelect, Button, Flex } from '@mantine/core';

const AsignarModalContent = ({ label, placeholder, items = [], onAsignar, onCancel }) => {
    const [selected, setSelected] = useState([]);

    const data = items.map(i => ({
        value: String(i.id ?? i.value ?? i.usuario),
        label: String(i.label ?? i.usuario ?? i.id)
    }));

    const handleAsignar = () => {
        if (selected.length === 0) return;
        const numericIds = selected.map(id => isNaN(Number(id)) ? id : parseInt(id, 10));
        onAsignar(numericIds);
    };

    return (
        <>
            <MultiSelect
                data={data}
                value={selected}
                onChange={setSelected}
                searchable
                clearable
                nothingFound="No encontrado"
                label={label}
                placeholder={placeholder}
                dropdownPosition="bottom"
                withinPortal
            />

            <Flex justify="flex-end" gap="md" mt="md">
                <Button variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>   
                <Button 
                    onClick={handleAsignar}
                    disabled={selected.length === 0}
                >
                    Asignar
                </Button>
            </Flex>
        </>
    );
};

export default AsignarModalContent;