// System
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import { Grid, Typography, Button, Divider, Chip, CircularProgress } from '@mui/material';

// Components
import CheckoutButton from 'src/components/molecules/CheckoutButton';
import Header from 'src/components/organisms/Header';

// Entity
import { Membership } from 'src/entity/Membership';

// API
import { getCurrentUserMembership, createFreeMembership } from 'src/api/auth';

const styles = {
    container: {
        marginTop: '64px',
        marginBottom: '24px',
        backgroundColor: '#e4e4e4',
        borderRadius: '8px',
        boxShadow: '0px 2px 8px -2px rgba(0,0,0,0.3)',
        mx: 'auto'
    }
}

const SettingsPage = () => {
    const [userMembership, setUserMembership] = useState<Membership | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        const getOrCreateFreeMembership = async () => {
            setIsLoading(true);
            const membership = await getCurrentUserMembership();
            if (membership) {
                setUserMembership(membership);
            } else {
                const newMembership = await createFreeMembership();
                setUserMembership(newMembership);
            }
            setIsLoading(false);
        }

        getOrCreateFreeMembership();
    }, []);

    return (
        <>
            <Header />
            <Grid container spacing={0} sx={styles.container} maxWidth="lg">
                {isLoading && (
                    <Grid item xs={12} sx={{ padding: '1.25rem' }}>
                        <CircularProgress />
                    </Grid>
                )}
                    
                {!isLoading && (
                    <>
                        <Grid item xs={12} sx={{ padding: '1.25rem' }}>
                            <Typography variant="h5" gutterBottom>Membership</Typography>
                            <Typography variant="body1">Current Plan: {userMembership?.membershipLevel}</Typography>
                            {userMembership?.membershipLevel === 'Free' && (
                                <>
                                    <Typography variant="body1">Click below to upgrade your membership.</Typography>
                                    <CheckoutButton />
                                </>
                            )}
                        </Grid>
                    </>
                )}
            </Grid>
        </>
    );
};

export default SettingsPage;