// System
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Material UI
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    EmojiObjects as EmojiObjectsIcon,
    ExitToApp as ExitToAppIcon,
    MenuBook as MenuBookIcon,
    School as SchoolIcon,
    Menu as MenuIcon,
    Home as HomeIcon,
    Info as InfoIcon,
    Note as NoteIcon,
} from '@mui/icons-material';

// Styles
import { headerStyles } from 'src/styles/organisms';

// Utils
import { logout } from 'src/utils/auth';

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    const handleMenuItemClick = () => {
        setIsDrawerOpen(false);
    };

    return (
        <>
            <AppBar position="static" style={{ backgroundColor: '#303030' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component={RouterLink} to="/" style={{ color: 'white', textDecoration: 'none', flexGrow: 1, marginLeft: '16px' }}>
                        LearnFlow Pro
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
                <List>
                    <ListItem component={RouterLink} to="/" onClick={handleMenuItemClick} style={headerStyles.linkItem}>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText><Typography variant="body1">Dashboard</Typography></ListItemText>
                    </ListItem>
                    <ListItem component={RouterLink} to="/goals" onClick={handleMenuItemClick} style={headerStyles.linkItem}>
                        <ListItemIcon><EmojiObjectsIcon /></ListItemIcon>
                        <ListItemText><Typography variant="body1">Learning Goals</Typography></ListItemText>
                    </ListItem>
                    <ListItem component={RouterLink} to="/sessions" onClick={handleMenuItemClick} style={headerStyles.linkItem}>
                        <ListItemIcon><SchoolIcon /></ListItemIcon>
                        <ListItemText><Typography variant="body1">Learning Sessions</Typography></ListItemText>
                    </ListItem>
                    <ListItem component={RouterLink} to="/knowledge-bases" onClick={handleMenuItemClick} style={headerStyles.linkItem}>
                        <ListItemIcon><MenuBookIcon /></ListItemIcon>
                        <ListItemText><Typography variant="body1">Knowledge Bases</Typography></ListItemText>
                    </ListItem>
                    <ListItem onClick={handleLogout} style={headerStyles.logoutMenuItem}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Header;