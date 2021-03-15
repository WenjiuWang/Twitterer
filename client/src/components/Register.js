import React, { useState } from 'react';
import { TextField } from 'mui-rff';
import { Typography, Button, Paper, Grid, makeStyles, Container} from '@material-ui/core';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import Link from '@material-ui/core/Link';
import TwitterIcon from '@material-ui/icons/Twitter';


const axios = require('axios')

const validate = values => {
    const errors = {}
    const requiredFields = [
      'name',
      'email',
      'password',
      'verify'
    ]
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = 'This field is required'
      }
    })
    if (
      values.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address'
    }
    if (values.password.length < 8) {
        errors.password = 'Password should be at least 8 characters long'
    }
    if (values.password !== values.verify) {
        errors.verify = 'Passwords do not match';
        errors.password = 'Passwords do not match';
    }
    return errors
}
  
const onSubmit = async values => {
    console.log(values);
    axios.post('/api/users/register', {
        name: values.name,
        email: values.email,
        password: values.password
      })
      .then((response) => {
        console.log(response);
      }, (error) => {
        console.log( error.response )
      });
  };

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
        textTransform: "none",
        background: '#1DA1F2', 
        color: 'white', 
        width: '100%',
        marginBottom: 30
    },

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      }
  }));
  const formFields = [
    {
      size: 12,
      field: (
        <TextField
          label="Name"
          name="name"
          required={true}
          fullWidth 
          id="outlined-name"
          variant="outlined" 
          InputLabelProps={{ shrink: true, required: false}}
        />
      ),
    },
    {
        size: 12,
        field: (
          <TextField
            label="Email"
            name="email"
            required={true}
            fullWidth 
            id="outlined-email"
            variant="outlined" 
            InputLabelProps={{ shrink: true, required: false}}
          />
        ),
      },
      {
        size: 12,
        field: (
          <TextField
            label="Password"
            name="password"
            required={true}
            fullWidth 
            id="outlined-password"
            variant="outlined" 
            InputLabelProps={{ shrink: true, required: false}}
          />
        ),
      },    
      {
        size: 12,
        field: (
          <TextField
            label="Verify password"
            name="verify"
            required={true}
            fullWidth 
            id="outlined-verify"
            variant="outlined" 
            InputLabelProps={{ shrink: true, required: false}}  className={useStyles.TextField}
          />
        ),
      },

  ];
export default function Register() {

    const classes = useStyles();

    return (
        <Container maxWidth="sm" style={{background: '#ffffff',  borderRadius: 20}}>
            <TwitterIcon style={{ fontSize: 40, color: '#1DA1F2',  paddingLeft: '50%', paddingRight: '50%', marginTop: 10}}></TwitterIcon>
            <Typography variant="h5" style={{color: 'black', fontWeight: 'bold', marginBottom: 40}}>
                Create your account
            </Typography>
            <Form
                onSubmit={onSubmit}
                validate={validate}
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <Grid container alignItems="flex-start" spacing={2}>
                        {formFields.map((item, idx) => (
                        <Grid item xs={item.size} key={idx}>
                            {item.field}
                        </Grid>
                        ))}
                        <Typography variant="caption" style={{color: 'black', marginTop: 30, marginBottom: 20}}>
                            By signing up, you agree to the <Link>Terms of Service</Link> and <Link>Privacy Policy</Link>, including Cookie Use. Others will be able to find you by email or phone number when provided·
                        </Typography>

                        <Button className={classes.button} disabled={submitting} type="submit">Sign Up</Button>
                    </Grid>
                </form>
                )}
                />
        </Container>

    );
}