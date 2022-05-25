import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Login from './Login';
import Register from './Register'

import classes from './styles.module.css';

export default function Auth() {
    const [isSuccessReg, _setSuccessReg] = useState(false);
    const navigate = useNavigate();
    const masterPassword = localStorage.getItem('masterPassword');
    const [alignment, setAlignment] = React.useState('login');

    const setSuccessReg = () => {
        setAlignment('login');
        _setSuccessReg(true);
    };

    const removeSuccessRegWarning = () => _setSuccessReg(false);

    const handleChange = (_, newAlignment) => {
        if (newAlignment && newAlignment !== alignment)
            setAlignment(newAlignment);
    };

    useEffect(() => {
        if (masterPassword) {
            navigate("../");
        }
    }, [masterPassword]);

    return (
        <div className={classes.wrapper}>
            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
            >
                <ToggleButton
                    className={classes.toggleButton} value="login">Вход</ToggleButton>
                <ToggleButton className={classes.toggleButton} value="register">Регистрация</ToggleButton>
            </ToggleButtonGroup>
            <div className={classes.form}>{
                alignment === 'login'
                ? <Login isSuccessReg={isSuccessReg} removeSuccessRegWarning={removeSuccessRegWarning} />
                : <Register setSuccessReg={setSuccessReg} />
            }</div>
        </div>
    );
}
