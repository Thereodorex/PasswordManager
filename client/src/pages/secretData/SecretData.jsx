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

    const handleChange = (panel) => (event, isExpanded) => {
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
                // setError(false);
                // setLoading(true);
                const response = await fetchWithTimeout(secretDataUrl, {
                    timeout: 2500,
                });
                const json = await response.json();
                // localStorage.setItem('masterPassword', password);
                const data = json;
                setData(data);
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
            {data.map(({_id, name, fields}) => {
                return (
                    <DataItem
                        expanded={expanded}
                        key={_id}
                        id={_id}
                        name={name}
                        fields={fields}
                        handleChange={handleChange(_id)}
                        setShareItemId={setShareItemId}
                    />
                );
            })}
            <NewItemModal />
            <ShareModal shareItemId={shareItemId} setShareItemId={setShareItemId} />
        </div>
    );
}
