import { Chip } from '@nextui-org/react';
import React from 'react';

export default function StatusChip({ status }) {
    let chipColor;
    let chipText;

    switch (status) {
        case 'Active':
            chipColor = 'success';
            chipText = 'Active';
            break;
        case 'Inactive':
            chipColor = 'danger';
            chipText = 'Inactive';
            break;
        case 'Deactivated':
            chipColor = 'danger';
            chipText = 'Deactivated';
            break;
        case 'Paused':
            chipColor = 'default';
            chipText = 'Pending';
            break;
        default:
            chipColor = 'success';
            chipText = 'Active';
            break;
    }

    return <Chip size="sm" color={chipColor} variant="flat">{chipText}</Chip>;
}
