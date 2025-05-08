import React, { useState, useEffect } from 'react';
import { Box, Menu, MenuItem, Avatar, ListItemIcon, Typography, Tooltip, IconButton } from '@mui/material';
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
            <Tooltip title="Profile & settings">
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar
                    sx={{
                        bgcolor: '#1976d2',
                        color: 'white',
                        width: 42,
                        height: 42,
                        fontSize: 20,
                        fontWeight: 500,
                    }}
                    >
                    {userDisplayName[0]?.toUpperCase() || 'U'}
                    </Avatar>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                slotProps={{
                    paper: {
                      elevation: 4,
                      sx: {
                        mt: 1.5,
                        minWidth: 180,
                      },
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
