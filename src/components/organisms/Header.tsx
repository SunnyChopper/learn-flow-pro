// System
import React, { useState } from 'react';
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
    useScrollTrigger,
    Slide
} from '@mui/material';
import {
    AppRegistration as AppRegistrationIcon,
    EmojiObjects as EmojiObjectsIcon,
    ExitToApp as ExitToAppIcon,
    Settings as SettingsIcon,
    School as SchoolIcon,
    Menu as MenuIcon,
    Home as HomeIcon,
    Login as LoginIcon,
} from '@mui/icons-material';

// Styles
import { headerStyles } from 'src/styles/organisms';

// Utils
import { isLoggedIn } from 'src/utils/auth';
import { logout } from 'src/utils/auth';

interface Props {
    children: React.ReactElement;
}

const HideOnScroll = (props: Props) => {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const styles = {
    menuList: {
        padding: '0.5rem',
        width: 'fit-content',
    }
}

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    React.useEffect(() => {
        const checkLoggedIn = async () => {
            const loggedIn = await isLoggedIn();
            setLoggedIn(loggedIn);
        };

        checkLoggedIn();
    }, []);

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
            <HideOnScroll>
                <AppBar position="sticky" style={{ backgroundColor: '#2a2a2a' }}>
                    <Toolbar sx={{
                        padding: '0.75rem',
                        '@media (max-width: 960px)': { padding: '0.5rem 2rem' },
                        '@media (min-width: 960px) and (max-width: 1280px)': { padding: '0.15rem 2rem' },
                    }}>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component={RouterLink} to="/" sx={{ color: 'white', textDecoration: 'none', flexGrow: 1, marginLeft: '16px', fontSize: '1.5rem', '@media (max-width: 960px)': { fontSize: '1.5rem' } }}>
                            TurboLearn AI
                        </Typography>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
                {loggedIn ? (
                    <List sx={styles.menuList}>
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
                        {/* <ListItem component={RouterLink} to="/knowledge-bases" onClick={handleMenuItemClick} style={headerStyles.linkItem}>
                            <ListItemIcon><MenuBookIcon /></ListItemIcon>
                            <ListItemText><Typography variant="body1">Knowledge Bases</Typography></ListItemText>
                        </ListItem> */}
                        <ListItem component={RouterLink} to="/settings" onClick={handleMenuItemClick} style={headerStyles.linkItem}>
                            <ListItemIcon><SettingsIcon /></ListItemIcon>
                            <ListItemText><Typography variant="body1">Settings</Typography></ListItemText>
                        </ListItem>
                        <ListItem onClick={handleLogout} style={headerStyles.logoutMenuItem}>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                ) : (
                    <List sx={styles.menuList}>
                        <ListItem component={RouterLink} to="/" onClick={handleMenuItemClick} style={headerStyles.linkItem}>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText><Typography variant="body1">Homepage</Typography></ListItemText>
                        </ListItem>
                        <ListItem component={RouterLink} to="/login" onClick={handleMenuItemClick} style={headerStyles.linkItem}>
                            <ListItemIcon><LoginIcon /></ListItemIcon>
                            <ListItemText><Typography variant="body1">Login to Account</Typography></ListItemText>
                        </ListItem>
                        <ListItem component={RouterLink} to="/sessions" onClick={handleMenuItemClick} style={headerStyles.linkItem}>
                            <ListItemIcon><AppRegistrationIcon /></ListItemIcon>
                            <ListItemText><Typography variant="body1">Register for Free</Typography></ListItemText>
                        </ListItem>
                    </List>
                )}
            </Drawer>
        </>
    );
};

export default Header;