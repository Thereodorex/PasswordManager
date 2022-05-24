import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

import classes from './styles.module.css';

export default function Input({ name, handleChange, disabled, type }) {
    return (
        <div className={classes.input}>
            <TextField
                disabled={disabled}
                name={name.toLowerCase()}
                variant="standard"
                fullWidth
                id={name.toLowerCase()}
                label={name}
                onChange={e => handleChange(e.target.value)}
                // error={errors.emailfield}
                // helperText={errors.email}
                size="small"
                //autoFocus
                // required
                type={type}
            />
        </div>
    );
}