import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarIcon from '@mui/icons-material/Star';
import { usersUrl, shareUrl } from '@api';
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

export default function ShareModal({ shareItemId, setShareItemId }) {
  const [isLoading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setShareItemId(null);

  const [users, setUsers] = useState([]);
 

  useEffect(() => {
    const fetchUsers = async () => {
        fetch(usersUrl, {
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          cookies: document.cookie,
          credentials: 'include'
        })
        .then(resp => resp.json())
        .then(res => {
            console.log(res);
            setUsers(res);
        });
    }

    fetchUsers();
  }, []);

  const shareItem = (id) => {
    const share = async () => {
      const response = await fetchWithTimeout(shareUrl, {
        timeout: 2500,
        method: 'POST',
        body: JSON.stringify({
            secretDataId: shareItemId,
            userId: id,
            masterPassword: localStorage.getItem('masterPassword'),
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      console.log(json);
    }
    share();
    handleClose();
  }

  return (
    <div>
      <Modal
        open={!!shareItemId}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            aria-label="contacts"
          >
            {users.map(({login, id}) => {
              return (
                <ListItem key={id} disablePadding>
                  <ListItemButton onClick={() => shareItem(id)}>
                    <ListItemText primary={login} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Modal>
    </div>
  );
}
