import YouTube from 'react-youtube';
import moment from 'moment';
import React from 'react';

// Material UI
import CircularProgress from '@mui/material/CircularProgress';
import { ExpandMore, NewspaperOutlined } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { keyframes } from '@mui/system';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Components
import RegisterFormRow from 'src/components/organisms/RegisterFormRow';
import CheckoutButton from 'src/components/molecules/CheckoutButton';
import PricingTable from 'src/components/organisms/PricingTable';
import Header from 'src/components/organisms/Header';
import Footer from 'src/components/organisms/Footer';

// API 
import { getNumberOfArticlesSortedForDate } from 'src/api/stats';
import { Accordion, AccordionDetails, AccordionSummary, Divider } from '@mui/material';

interface HomeLandingPageProps { }

const wiggleAnimation = keyframes`
    0% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-5px);
    }
    50% {
        transform: translateX(0);
    }
    75% {
        transform: translateX(5px);
    }
    100% {
        transform: translateX(0);
    }
`;

const sxStyles = {
    heroContainer: {
        height: '80vh',
        '@media (max-width: 600px)': {
            height: '80vh'
        },
    },
    heroTextContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        width: '80vw',
        '@media (max-width: 600px)': {
            width: '90vw'
        }
    },
    heroTitle: {
        color: 'white',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        fontSize: '4rem',
        marginBottom: '1rem',
        '@media (max-width: 600px)': {
            fontSize: '2.5rem'
        },
        '@media (min-width: 600px) and (max-width: 1024px)': {
            fontSize: '3rem',
            marginBottom: '0rem'
        }
    },
    heroSubtitle: {
        color: 'white',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        fontSize: '1.5rem',
        marginTop: '2rem',
        '@media (max-width: 600px)': {
            fontSize: '1rem'
        },
        '@media (min-width: 600px) and (max-width: 1024px)': {
            fontSize: '1.25rem',
            marginTop: '1rem'
        }
    },
    heroButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2rem'
    },
    attentionGrabberContainer: {
        padding: '0rem 5rem',
        '@media (max-width: 600px)': {
            padding: '0rem 2rem'
        }
    },
    attentionGrabberCard: {
        backgroundColor: '#f5f5f5',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        top: '-4rem',
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        '@media (max-width: 600px)': {
            top: '-2rem'
        },
        '@media (min-width: 600px) and (max-width: 1024px)': {
            top: '-1.5rem'
        }
    },
    attentionGrabberTitle: {
        fontSize: '3rem',
        marginBottom: '2rem',
        borderRadius: '50px',
        padding: '0.75rem 3rem',
        display: 'block',
        width: 'fit-content',
        margin: 'auto',
        // Border stroke
        border: 0,
        color: '#2a2a2a',

        '@media (max-width: 600px)': {
            fontSize: '1.75rem',
            padding: '0.75rem 1.5rem',
            lineHeight: '1.65rem'
        }
    },
    attentionGrabberSubtitle: {
        fontSize: '1.5rem',
        marginBottom: '1rem',
        '@media (max-width: 600px)': {
            fontSize: '1rem'
        },
        '@media (min-width: 600px) and (max-width: 1024px)': {
            fontSize: '1.25rem',
            marginBottom: '0.25rem'
        }
    },
    attentionGrabberDescription: {
        fontSize: '1.2rem',
        marginBottom: '1.5rem',
        marginTop: '1rem',
        '@media (max-width: 600px)': {
            fontSize: '1rem'
        }
    },
    attentionGrabberButton: {
        marginTop: '0rem',
        animation: `${wiggleAnimation} 2s ease-in-out infinite`,
        fontSize: '1.2rem',
        fontWeight: 'bold',
        padding: '1rem 2rem',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        '&:hover': {
            animation: 'none',
        },
        '@media (max-width: 600px)': {
            fontSize: '1rem',
            padding: '0.5rem 1rem',
        },
        '@media (min-width: 600px) and (max-width: 1024px)': {
            fontSize: '1rem',
            padding: '0.5rem 1rem',
        }
    },
    badge: {
        backgroundColor: '#FE6B8B',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem',
        borderRadius: '10px',
        padding: '0.75rem',
        width: 'fit-content',
    },
    badgeIcon: {
        marginRight: '0.5rem',
        color: 'white',
    },
    badgeText: {
        fontWeight: 'bold',
        fontSize: '1.2rem',
        color: 'white',
        wordBreak: 'break-word',
    },
}

const CustomButton = styled(Button)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    '&:hover': {
        animation: 'wiggle 1s ease-in-out infinite',
    },
    '@keyframes wiggle': {
        '0%': {
        transform: 'translateX(0)',
        },
        '25%': {
        transform: 'translateX(-5px)',
        },
        '50%': {
        transform: 'translateX(0)',
        },
        '75%': {
        transform: 'translateX(5px)',
        },
        '100%': {
        transform: 'translateX(0)',
        },
    },
    '@media (max-width: 600px)': {
        marginTop: '1rem',
        fontSize: '1rem',
        padding: '0.5rem 1rem',
    },
    '@media (min-width: 600px) and (max-width: 1024px)': {
        marginTop: '0rem',
        fontSize: '1rem',
        padding: '0.5rem 1rem',
    }
});

const HomeLandingPage: React.FC<HomeLandingPageProps> = () => {
    const [isVideoPlaying, setIsVideoPlaying] = React.useState<boolean>(false);
    const [numberOfArticlesSortedForDate, setNumberOfArticlesSortedForDate] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchNumberOfArticlesSortedForDate = async () => {
            setIsLoading(true);
            const today = moment().format('YYYY-MM-DD');
            const numberOfArticlesSortedForDate = await getNumberOfArticlesSortedForDate(today);
            setNumberOfArticlesSortedForDate(numberOfArticlesSortedForDate === 0 ? 17 : numberOfArticlesSortedForDate);
            setIsLoading(false);
        };
        fetchNumberOfArticlesSortedForDate();
    }, []);

    const toggleVideoPlaying = () => {
        setIsVideoPlaying(!isVideoPlaying);
    }

    return (
        <>
            <Header />
            <Box position="relative" sx={sxStyles.heroContainer}>
                <img src="/hero-background.png" alt="" style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }} />
                <div style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(20, 20, 20, 0.65)'
                }} />
                <Grid container justifyContent="center" alignItems="center" sx={sxStyles.heroTextContainer}>
                    <Grid item xs={12} md={9}>
                        <Typography variant="h1" sx={sxStyles.heroTitle}>Learn Something New Every Day with Articles Sorted for Your Success</Typography>
                        {/* <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <YouTube videoId="9y927xiDtJo" opts={{ width: '100%', height: '350px', playerVars: { autoplay: 0 } }} onPlay={toggleVideoPlaying} onPause={toggleVideoPlaying} />
                        </Box> */}
                        <Typography variant="body1" sx={sxStyles.heroSubtitle}>Navigate the vast ocean of information effortlessly, focusing only on content that aligns with your unique goals.</Typography>
                        <Box sx={sxStyles.heroButtonsContainer}>
                            <CustomButton variant="contained" color="primary" sx={{ marginRight: '1rem' }}>Unlock Tailored Reads</CustomButton>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '2rem' }}>
                            <Badge sx={sxStyles.badge}>
                                <NewspaperOutlined sx={sxStyles.badgeIcon} />
                                <Typography variant="body1" sx={sxStyles.badgeText}>
                                    Over {isLoading ? <CircularProgress size={16} /> : numberOfArticlesSortedForDate} articles sorted today by learners like you!
                                </Typography>
                            </Badge>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={12} maxWidth="sm" sx={sxStyles.attentionGrabberContainer}>
                    <Box sx={sxStyles.attentionGrabberCard}>
                        <Typography variant="h3" sx={sxStyles.attentionGrabberTitle}>You're Early to the Beta!</Typography>
                        <Typography variant="h5" sx={sxStyles.attentionGrabberSubtitle}>Register for a Free Account</Typography>
                        <Typography variant="body1" sx={sxStyles.attentionGrabberDescription}>Sign up for a free account get started on unlocking personalized article recommendations, save articles for later, and track your progress. The first 25 users to sign up will receive a free 1-year subscription to the max-tier plan for free! Do not miss out on this opportunity!</Typography>
                        <Button variant="contained" color="primary" sx={sxStyles.attentionGrabberButton}>Sign Up Now</Button>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ padding: '1rem' }}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h3" textAlign="center">Frequently Asked Questions (FAQ)</Typography>
                    <Divider sx={{ marginTop: '1.25rem', marginBottom: '1.5rem' }} />
                    <Typography variant="body1" textAlign="center">You might have some questions about how this works. Here are some frequently asked questions.</Typography>
                </Grid>

                {/* Accordion FAQ */}
                <Grid item xs={12} md={8} sx={{ marginTop: '2rem', marginBottom: '3rem' }}>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-1a-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">What is Turbo Learn AI?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-1a-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">Turbo Learn AI is a personalized content curation tool that turns your collection of Medium articles into a smart, focused reading list, tailored to your learning goals.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-1b-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">How does Turbo Learn AI stand out from other learning platforms?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-1b-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">Unlike other platforms, Turbo Learn AI offers personalized content curation, AI-powered relevance focused solely on Medium’s high-quality articles, time-efficient learning, and direct integration with your career goals.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-1c-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">How do I get started with Turbo Learn AI?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-1c-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">Simply sign up for a membership, add the URLs of Medium articles you want to read, and let Turbo Learn AI organize and prioritize the content according to your personalized career goals and learning paths. The free membership allows you to add up to five articles per learning session.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-1d-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">How does Turbo Learn AI organize my reading list?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-1d-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">Turbo Learn AI utilizes the GPT and Medium API to retrieve and analyze the content of the articles you submit and organizes them in a way that aligns with your specific career goals.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-1d-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">Can I use Turbo Learn AI to save articles for later?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-1d-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">Yes, you can save articles for later reading, and Turbo Learn AI will also help in organizing them according to their relevance to your career goals.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-2a-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">How much does a Turbo Learn AI membership cost?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-2a-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">Please scroll down to the "Pricing" section on the page for detailed information on our membership plans and the features included in each plan.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-2a-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">What do I get with a Turbo Learn AI membership?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-2a-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">A Turbo Learn AI membership provides you with access to our advanced AI-powered content curation tools, personalized learning paths, and a streamlined way to align your reading with your career aspirations</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-2b-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">Is there a free trial available?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-2b-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">Yes, we offer a free trial so that you can experience the benefits of Turbo Learn AI before committing to a membership. Details are in the "Pricing" section on the page.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-3a-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">What kind of support does Turbo Learn AI offer?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-3a-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">We offer customer support via email, and our website also has a comprehensive Help Center with guides and tutorials to help you make the most of Turbo Learn AI. (Coming soon)</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-3b-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">Where can I find tutorials or guides on how to use Turbo Learn AI?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-3b-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">Please visit our Help Center for tutorials, guides, and tips on how to maximize your Turbo Learn AI experience. (Coming soon)</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            aria-controls="question-4a-content"
                            expandIcon={<ExpandMore sx={{ transform: 'rotate(0deg)', color: 'white' }} />}
                            sx={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white'}}
                        >
                            <Typography variant="h5">Is my data safe with Turbo Learn AI?</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            id="question-4a-content"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="body1">Yes, we take data security very seriously and employ industry-standard practices to ensure your data is secure and confidential. All that is stored are the articles that you read and your user profile needed to authenticate you.</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>

            <PricingTable />

            <RegisterFormRow
                onAlreadyLoggedIn={() => { }}
                onRegisterSuccess={() => { }}
            />

            <Footer />
        </>
    )
}

export default HomeLandingPage;