import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Input from '@components/input';
import { loginUrl, usersUrl } from '@api';
import fetchWithTimeout from '@utils/fetchWithTimeout';

export default function App() {
    const navigate = useNavigate();
    const [isError, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    useEffect(async () => {
        const resp = await fetch(usersUrl);
        const json = await resp.json();
    }, [])

    const loginAction = async () => {
        try {
            setError(false);
            setLoading(true);
            const response = await fetchWithTimeout(loginUrl, {
                timeout: 2500,
                method: 'POST',
                body: JSON.stringify({
                    login,
                    password,
                }),
                headers: {
                'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
            localStorage.setItem('masterPassword', password);
            navigate("../");
        } catch (_) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <React.Fragment>
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
