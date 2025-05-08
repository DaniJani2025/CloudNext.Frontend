import React, { useState, useEffect } from 'react';
import { Box, Button, Menu, MenuItem, Avatar, ListItemIcon, Typography } from '@mui/material';
import { Home as HomeIcon, Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StorageService from '../services/StorageService';
import UserService from '../services/UserService';

const TopRightMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userDisplayName, setUserDisplayName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const displayName = StorageService.getUserDisplayName();
        setUserDisplayName(displayName || 'Guest');
    }, []);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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

    const handleProfileNavigate = () => {
        navigate('/profile');
    };

    const handleHomeNavigate = () => {
        navigate('/');
    };

    return (
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
            <Button
                onClick={handleMenuOpen}
                sx={{
                    borderRadius: '50%',
                    minWidth: 0,
                    padding: 0,
                    width: 44,
                    height: 44,
                    backgroundColor: '#1976d2',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#1565c0',
                    },
                }}
            >
                <Avatar 
                    sx={{
                    bgcolor: 'white',
                    color: '#1976d2',
                    width: 36,
                    height: 36,
                    fontSize: 24,
                    fontWeight: 400,
                }}>
                    {userDisplayName[0]?.toUpperCase() || 'U'}
                </Avatar>
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        mt: 1.5,
                        minWidth: 180,
                    },
                }}
            >
                <MenuItem onClick={() => {
                    handleProfileNavigate();
                    handleMenuClose();
                }}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Profile</Typography>
                </MenuItem>

                <MenuItem onClick={() => {
                    handleHomeNavigate();
                    handleMenuClose();
                }}>
                    <ListItemIcon>
                        <HomeIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Home</Typography>
                </MenuItem>

                <MenuItem onClick={() => {
                    handleLogout();
                    handleMenuClose();
                }}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Logout</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default TopRightMenu;
