import { Chip } from '@nextui-org/react';
import React from 'react';

export default function StatusChip({ status }) {
    let chipColor;
    let chipText;

    if (status === 'active' || status === 'Active') {
        chipColor = 'success';
        chipText = 'Active';
    } else if (status === 'inactive' || status === 'Inactive') {
        chipColor = 'danger';
        chipText = 'Inactive';
    } else if (status === 'deactivated' || status === 'Deactivated') {
        chipColor = 'danger';
        chipText = 'Deactivated';
    } else if (status === 'paused' || status === 'Paused') {
        chipColor = 'default';
        chipText = 'Pending';
    } else {
        chipColor = 'success'; // Default case
        chipText = 'Active';
    }

    return <Chip size="sm" color={chipColor} variant="flat">{chipText}</Chip>;
}
