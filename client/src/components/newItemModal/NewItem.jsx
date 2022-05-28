import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Input from '@components/input';
import Select from '@components/select';
import { secretDataCreateUrl, dataTypesUrl } from '@api';
import fetchWithTimeout from '@utils/fetchWithTimeout';

import classes from './styles.module.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function NewItemModal() {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const defaultType = {
    id : 0,
    fields: [''],
    name: 'Свой',
    fixed: false
  };
  const [types, setTypes] = useState([defaultType]);
  const [currentType, _setCurrentType] = useState(0);

  const [name, setName] = useState('');
  const [fields, setFields] = useState([{name: '', value: ''}]);

  const setCurrentType = (typeId) => {
    _setCurrentType(typeId);
    const type = types.find(type => type.id == typeId);
    console.log({typeId, type})
    if (type) {
      setFields(type.fields.map(field => ({name: field, value: '', fixed: type.fixed !== false})));
    }
  };

  const appendField = () => {
    setFields([...fields, {name: '', value: ''}]);
  }

  const handleChange = (targetIndex, value, type) => {
    setFields(fields.map((item, index) => {
        if (index === targetIndex) {
            return ({...item, [type]: value});
        }
        return item;
    }))
  }

  const handleClear = () => setFields([]);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/plain');
    const fetchTypes = async () => {
        fetch(dataTypesUrl, {
          headers: {
            'Content-Type': 'text/plain'
          },
          credentials: 'omit'
        })
        .then(resp => resp.json())
        .then(res => {
            const types = res.result.map(type => ({
                id: type.id,
                name: type.name,
                fields: type.typeFields.map(field => field.name),
            }));
            setTypes([defaultType, ...types]);
        });
    }

    fetchTypes();
  }, []);

  const createItem = () => {
        const fetchData = async () => {
            try {
                // setError(false);
                setLoading(true);
                const response = await fetchWithTimeout(secretDataCreateUrl, {
                    timeout: 2500,
                    method: 'POST',
                    body: JSON.stringify({
                        name,
                        fields: fields.map(({name, value}) => ({name, value})),
                        masterPassword: localStorage.getItem('masterPassword'),
                        dataTypeId: currentType,
                    }),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                });
                const json = await response.json();
            } catch (_) {
                // setError(true);
            } finally {
                setLoading(false);
                handleClear();
                handleClose();
            }
        };
        fetchData();
    }

  return (
    <div>
      <Button className={classes.button} onClick={handleOpen}>Создать</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Select {...{types, currentType, setCurrentType}} />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <Input name="Название" handleChange={setName} />
          </Typography>
          <div id="modal-modal-description" sx={{ mt: 2 }}>
          {fields.map((field, index) => {
            return (
                <div className={classes.row} key={index}>
                    <TextField
                        disabled={isLoading || field.fixed}
                        label={field.fixed && field.name || 'field'}
                        id="filled-size-small"
                        defaultValue=""
                        variant="filled"
                        size="small"
                        onChange={e => handleChange(index, e.target.value, 'name')}
                    />
                    <TextField
                        disabled={isLoading}
                        label="value"
                        id="filled-size-small"
                        defaultValue=""
                        variant="filled"
                        size="small"
                        onChange={e => handleChange(index, e.target.value, 'value')}
                    />
                </div>
            )
            })}
          </div>
            {isLoading ? <CircularProgress /> : <React.Fragment>
            <Button className={classes.button} onClick={appendField}>Добавить поле</Button>
            <Button
            onClick={createItem}
            className={classes.actionButton}
            variant="contained"
            >
                Создать
            </Button>
            <Button
            onClick={handleClear}
            className={classes.actionButton}
            variant="contained"
            color="error"
            >
                Очистить
            </Button>
            </React.Fragment>}
        </Box>
      </Modal>
    </div>
  );
}
