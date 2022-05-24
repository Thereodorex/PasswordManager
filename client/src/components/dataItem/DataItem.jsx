import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

import classes from './styles.module.css';

export default function DataItem({ id, name, fields, expanded, handleChange, setShareItemId }) {
    const shareClick = (event) => {
        event.stopPropagation();
        setShareItemId(id);
        console.log('click');
    }
    return (
        <Accordion expanded={expanded === id} onChange={handleChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${id}-content`}
                id={`${id}-header`}
            >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                {name}
            </Typography>
            <Button onClick={shareClick}>
                Поделиться
            </Button>
            </AccordionSummary>

            <AccordionDetails>
                {fields.map(({name, value}) => {
                    return <div key={name}>{name}: {value}</div>
                })}
            </AccordionDetails>
        </Accordion>
    );
}
