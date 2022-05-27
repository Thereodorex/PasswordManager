import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Input from '@components/input';
import { loginUrl, usersUrl } from '@api';
import fetchWithTimeout from '@utils/fetchWithTimeout';
import { responsiveFontSizes } from '@mui/material';

export default function Login({ isSuccessReg, removeSuccessRegWarning }) {
    const navigate = useNavigate();
    const [isError, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const loginAction = () => {
        removeSuccessRegWarning();
        setError(false);
        setLoading(true);
        fetchWithTimeout(loginUrl, {
            timeout: 2500,
            method: 'POST',
            body: JSON.stringify({
                login,
                password,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Response is not ok');
            }
            localStorage.setItem('masterPassword', password);
            navigate("../");
        })
        .catch(e => {
            setError(true);
            console.log(e);
        });

        setLoading(false);
    };

    return (
        <React.Fragment>
            {isSuccessReg && <Alert severity="success">Регистрация прошла успешно!</Alert>}
            <Input disabled={isLoading} name="Логин" handleChange={setLogin} />
            <Input disabled={isLoading} name="Пароль" handleChange={setPassword} type="password" />
            {isLoading
                ? <CircularProgress />
                : <Button onClick={loginAction} variant="contained">Войти</Button>
            }
            {isError && <Stack sx={{ width: '100%' }} spacing={2}><Alert severity="error">Не удалось войти</Alert></Stack>}
        </React.Fragment>
    );
}
