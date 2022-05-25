import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Input from '@components/input';
import { registerUrl } from '@api';
import fetchWithTimeout from '@utils/fetchWithTimeout';

export default function Register({ setSuccessReg }) {
    const [isError, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const loginAction = async () => {
        try {
            setError(false);
            setLoading(true);
            const response = await fetchWithTimeout(registerUrl, {
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
            await response.json();
            setSuccessReg();
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
                : <Button onClick={loginAction} variant="contained">Зарегистрироваться</Button>
            }
            {isError && <Stack sx={{ width: '100%' }} spacing={2}><Alert severity="error">Не удалось зарегистрироваться</Alert></Stack>}
        </React.Fragment>
    );
}
