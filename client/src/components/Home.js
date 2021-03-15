import React from 'react';

import homeImg from '../assets/img/home.png'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {FullsizePicture} from 'react-responsive-picture';
import TwitterIcon from '@material-ui/icons/Twitter';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import Register from './Register'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles((theme) => ({
    text: {
        fontWeight:'bold',
        color: '#ffffff',
        marginBottom: '10px'
    },

    button: {
        fontSize: 15,
        fontWeight:'bold',
        height: 50,
        width: 400,
        borderRadius: 40,
        textTransform: "none"
    },

    TextField: {
        marginRight: 10
    },

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      }
  }));


  export default function Home() {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    var openCount = 0;

    const handleClose = () => {
        openCount += 1;
        if (openCount === 2) {
            setOpen(false);
            openCount = 0;
        }
    };
    const handleToggle = () => {
        openCount = 0;
        setOpen(true);
    };
    

    return (
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <Grid container alignItems='center' spacing={4}>
            
            <Grid item xs={7}>
                <div style={{display: 'flex', height:'100vh', justifyContent:'center',alignItems:'center'}}>
                    <FullsizePicture src={homeImg}></FullsizePicture>
                    <TwitterIcon style={{ fontSize: '20vw', color: '#ffffff', position:"absolute" }}></TwitterIcon>
                </div>
                
            </Grid>

            <Grid item xs={5} >

                <Grid container justify="flex-start" >
                    <Grid item xs={12} style={{position: 'absolute', top: 20}}>
                        <TextField required id="outlined-email" label="Email" variant="outlined" InputLabelProps={{ shrink: true, required: false}} className={classes.TextField} />
                        <TextField required id="outlined-password-input" label="Password" type="password" autoComplete="current-password" variant="outlined" InputLabelProps={{ shrink: true, required: false  }} className={classes.TextField} />
                        <Button variant="outlined" style={{textTransform: "none",  borderRadius: 40, height: 50, width: 100}}>Login</Button>
                    </Grid>

                    <Grid item xs={12} >
                        <TwitterIcon style={{ fontSize: 50, color: '#1DA1F2', paddingBottom: '40px'}}></TwitterIcon>
                    </Grid>
                    <Grid item xs={12} >
                        <Typography variant="h2" style={{fontWeight: 'bold'}}>
                            Happening now
                        </Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <Typography variant="h4" style={{fontWeight: 'bold', marginTop: '30px', marginBottom: '20px'}}>
                            Join Twitterer today.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <Button className={classes.button} onClick={handleToggle} style={{background: '#1DA1F2', color: 'white', marginBottom: '20px'}}>Sign Up</Button>
                    </Grid>

                    <Grid item xs={12} >
                        <Button variant="outlined" className={classes.button}  style={{outlinedPrimary: '#1DA1F2'}}>Login</Button>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>

        <Backdrop className={classes.backdrop} open={open}>
            <ClickAwayListener onClickAway={handleClose}>
            <div >
                <Register ></Register>
            </div>
            </ClickAwayListener>
        </Backdrop>

        </div>

    );
  }