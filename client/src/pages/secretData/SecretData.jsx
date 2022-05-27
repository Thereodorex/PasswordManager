import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import NewItemModal from '@components/newItemModal';
import ShareModal from '@components/shareModal';
import DataItem from '@components/dataItem';

import { secretDataUrl, dataTypesUrl } from '@api';
import fetchWithTimeout from '@utils/fetchWithTimeout';

import classes from './styles.module.css';

export default function SecretData() {
    const masterPassword = localStorage.getItem('masterPassword');
    const navigate = useNavigate();
    const [shareItemId, setShareItemId] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const handleChange = (panel) => (_, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        if (!masterPassword) {
            navigate("/auth");
        }
    }, [masterPassword]);


    useEffect(() => {
        if (!masterPassword) {
            navigate("/auth");
        }
        const fetchData = async () => {
            try {

                const response = await fetchWithTimeout(secretDataUrl, {
                    timeout: 2500,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'text/plain',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify(masterPassword)
                });
                if (!response.ok) {
                    throw new Error(response);
                }
                const json = await response.json();
                const data = json;
                setData(data.result);
            } catch (_) {
                // setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const logout = () => {
        localStorage.removeItem('masterPassword');
        navigate("/auth");
    }

    return (
        <div className={classes.wrapper}>
            <Button
                variant="contained"
                color="error"
                className={classes.logoutButton}
                onClick={logout}
            >
                Выйти
            </Button>
            {data.map(({id, name, fields}) => {
                return (
                    <DataItem
                        expanded={expanded}
                        key={id}
                        id={id}
                        name={name}
                        fields={Object.entries(fields).map(([name, value]) => ({name, value}))}
                        handleChange={handleChange(id)}
                        setShareItemId={setShareItemId}
                    />
                );
            })}
            <NewItemModal />
            <ShareModal shareItemId={shareItemId} setShareItemId={setShareItemId} />
        </div>
    );
}
