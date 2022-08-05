import './css/Settings.css';
import Header from'./Header.js';
import Post from'./Post.js';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc} from 'firebase/firestore';
import {signOut, onAuthStateChanged} from "firebase/auth";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';






function Settings() {

  const [userId, setUserId]=useState("");
    const [name, setUserName]=useState("");
    const [loaded, setLoaded]=useState(true);
    const [loggedIn, setLoggedIn]=useState(true);
    const [editProfile, SetEditProfile]=useState(true);
    const [passwordReset, SetPasswordReset]=useState(false);
    const [emailAndSms, SetEmailAndSms]=useState(false);
    const [privacy, SetPrivacy]=useState(false);
    const [security, SetSecurity]=useState(false);
    const [loginActivity, SetLoginActivity]=useState(false);
    

    const [user, setUser] = useState({});

    const [value, setValue] = React.useState('Controlled');


  const logout = async () =>
  {
          await signOut(auth);
        

  }

  const handleButtonEditProfile = () =>
  {
          SetEditProfile(true);
          SetPasswordReset(false);
          SetEmailAndSms(false);
          SetPrivacy(false);
          SetSecurity(false);
          SetLoginActivity(false);
        

  }

  const handleButtonPasswordReset = () =>
  {
    SetEditProfile(false);
          SetPasswordReset(true);
          SetEmailAndSms(false);
          SetPrivacy(false);
          SetSecurity(false);
          SetLoginActivity(false);
        

  }
  const handleButtonEmailAndSms = () =>
  {
          SetEditProfile(false);
          SetEmailAndSms(true);
          SetEmailAndSms(false);
          SetPrivacy(false);
          SetSecurity(false);
          SetLoginActivity(false);
        

  }
  const handleButtonPrivacy = () =>
  {
    SetEditProfile(false);
          SetPrivacy(true);
          SetEmailAndSms(false);
          SetPrivacy(false);
          SetSecurity(false);
          SetLoginActivity(false);
        

  }
  const handleButtonSecurity = () =>
  {
    SetEditProfile(false);
          SetSecurity(true);
          SetEmailAndSms(false);
          SetPrivacy(false);
          SetSecurity(false);
          SetLoginActivity(false);
        

  }
  const handleButtonLoginActivity = () =>
  {
    SetEditProfile(false);
          SetLoginActivity(true);
          SetEmailAndSms(false);
          SetPrivacy(false);
          SetSecurity(false);
          SetLoginActivity(false);
        

  }

  const RedditTextField = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} />
  ))(({ theme }) => ({
    '& .MuiFilledInput-root': {
      border: '1px solid #e2e2e1',
      borderColor: theme.palette.primary.main,
      overflow: 'hidden',
      borderRadius: 4,
      backgroundColor: 'white',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ])},
  }));
  
  

 
  return (<div className="Settings">
    <nav>
    <div className='divider'>
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
    </div>
    <div className='pageDivide'>
    <div className='options'>
            <button className='sideButtons'  onClick={handleButtonEditProfile}>Edit Profile</button>
            <button className='sideButtons' onClick={handleButtonPasswordReset}>Change Password</button>
            <button className='sideButtons' onClick={handleButtonEmailAndSms}>Email and SMS</button>
            <button className='sideButtons' onClick={handleButtonPrivacy}>Privacy</button>
            <button className='sideButtons' onClick={handleButtonSecurity}>Security</button>
            <button className='sideButtons' onClick={handleButtonLoginActivity}>Login Activity</button>
    </div>
    {editProfile && (
    <div className="formContainer">
        <div className='username'>{auth.currentUser.email}</div>
        <button className='changePicButton'>Change Profile Photo</button>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
         
      }}
      noValidate
      autoComplete="off"
    >
        <div className='formInputs'>

        <RedditTextField
        label="Name"
        defaultValue="Utkarsh"
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 11 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
      />

<RedditTextField
        label="Userame"
        defaultValue="Utkarsh"
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 11 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
      />
        <RedditTextField
        label="Website"
        defaultValue=""
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 11 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
      />
    <RedditTextField
        label="Bio"
        defaultValue="YOLO"
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 11 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
        multiline
        maxRows={2}
        
        
      />
                <RedditTextField
        label="Number"
        defaultValue=""
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 11 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
      />
                <RedditTextField
        label="Email"
        defaultValue=""
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 11 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
      />
                <RedditTextField
        label="Gender"
        defaultValue=""
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 11 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
      />
        <button className='submit'>Submit</button>
      </div>
    </Box>
    </div>)}
    {passwordReset && (
    <div className="formContainer">
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
         
      }}
      noValidate
      autoComplete="off"
    >
        <div className='formInputsColumn'>
    
        <RedditTextField
        label="Enter Old Password *"
        defaultValue=""
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 11 }}
        
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
      />
                <RedditTextField
                
        label="Enter New Password *"
        defaultValue=""
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 11 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
      />
                <RedditTextField
                
        label="Confirm New Password *"
        defaultValue=""
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 11 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
      />
        <button className='submit'>Submit</button>
      </div>
    </Box>
    </div>)}
    </div>
    </nav>
  </div>);
}

export default  Settings;