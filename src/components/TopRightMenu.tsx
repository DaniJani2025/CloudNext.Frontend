import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StorageService from '../services/StorageService';
import UserService from '../services/UserService';

const TopRightMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userDisplayName, setUserDisplayName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const displayName = StorageService.getUserDisplayName();
        setUserDisplayName(displayName || 'Guest');
    }, []);

    const handleMenuOpen = (event: { currentTarget: React.SetStateAction<null>; }) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await UserService.logout();
        } catch (err) {
            console.error('Error during logout API call', err);
        }
        StorageService.removeUserDetails();
        navigate('/login');
    };

    return (
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
            <Button
                onClick={handleMenuOpen}
                variant="contained"
                color="primary"
                sx={{
                    borderRadius: '50%',
                    padding: '8px 16px',
                    minWidth: '40px',
                    height: '40px',
                }}
            >
                {userDisplayName}
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
};

export default TopRightMenu;
