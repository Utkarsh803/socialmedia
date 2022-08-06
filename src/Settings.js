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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import {FaUserAltSlash, FaBellSlash} from 'react-icons/fa';
import {MdOutlineBlock} from 'react-icons/md';

import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { SmoothCorners } from 'react-smooth-corners'






function Settings() {

  const [userId, setUserId]=useState("");
    const [name, setName]=useState("");
    const [loaded, setLoaded]=useState(true);
    const [loggedIn, setLoggedIn]=useState(true);
    const [editProfile, SetEditProfile]=useState(true);
    const [passwordReset, SetPasswordReset]=useState(false);
    const [emailAndSms, SetEmailAndSms]=useState(false);
    const [privacy, SetPrivacy]=useState(false);
    const [security, SetSecurity]=useState(false);
    const [loginActivity, SetLoginActivity]=useState(false);
    
    const [username, SetUserName]=useState("");
    const [website, SetWebsite]=useState("");
    const [bio, SetBio]=useState("");
    const [phone, SetPhone]=useState("");
    const [email, SetEmail]=useState("");
    const [gender, SetGender]=useState("");


    

    const [user, setUser] = useState({});

    const [value, setValue] = React.useState('Controlled');


  const logout = async () =>
  {
          await signOut(auth);
        

  }

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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
          SetPasswordReset(false);
          SetEmailAndSms(true);
          SetPrivacy(false);
          SetSecurity(false);
          SetLoginActivity(false);
        

  }
  const handleButtonPrivacy = () =>
  {
    SetEditProfile(false);
          SetPrivacy(true);
          SetEmailAndSms(false);
          SetPasswordReset(false);
          SetSecurity(false);
          SetLoginActivity(false);
        

  }
  const handleButtonSecurity = () =>
  {
    SetEditProfile(false);
          SetSecurity(true);
          SetEmailAndSms(false);
          SetPrivacy(false);
          SetPasswordReset(false);
          SetLoginActivity(false);
        

  }
  const handleButtonLoginActivity = () =>
  {
    SetEditProfile(false);
          SetLoginActivity(true);
          SetEmailAndSms(false);
          SetPrivacy(false);
          SetSecurity(false);
          SetPasswordReset(false);
        

  }
  const handleInputName=(e)=>{
    setName(e);
    console.log(name);
  }

  const RedditTextField = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} />
  ))(({ theme }) => ({
    '& .MuiFilledInput-root': {
      border: '1px solid #e2e2e1',
      borderColor: theme.palette.primary.main,
      width:220,
      overflow: 'hidden',
      borderRadius: 4,
      backgroundColor: 'white',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ])}
  }));
  
  

  const buttons = [
    <Button key="one">One</Button>,
    <Button key="two">Two</Button>,
    <Button key="three">Three</Button>,
  ];

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
        label="Name *"
        defaultValue=""
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 0 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
        onChange={(event)=>handleInputName(event.target.value)}

      />

<RedditTextField
        label="Userame *"
        defaultValue="Utkarsh"
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 0 }}
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
        style={{ marginTop: 0 }}
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
        style={{ marginTop: 0 }}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
        multiline
        maxRows={2}
        
        
      />
                <RedditTextField
        label="Number *"
        defaultValue=""
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 0}}
        InputLabelProps={{
            style: { color: 'black' ,backgroundColor: 'white'},
          }}
        size="small"
      />
                <RedditTextField
        label="Email *"
        defaultValue=""
        id="reddit-input"
        variant="filled"
        style={{ marginTop: 0 }}
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
        style={{ marginTop: 0 }}
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
        <button className='submitResetPassword'>Submit</button>
      </div>
    </Box>
    </div>)}
    {emailAndSms && (
    <div className="formContainerEmailandSms">
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
         
      }}
      noValidate
      autoComplete="off"
    >
        <div className='formInputsColumnEmailAndSms'>
        <div className='row'>
        <input type='checkbox' className="shiftup"></input>
        <div className='column'>
        <div className='bgblackbig'>Email</div>
        <div className='bgblacksmall'> Receive important emails from our app</div>
        </div>
        </div>
        <div className='row'>
        <input type='checkbox' className="shiftup"></input>
        <div className='column'>
        <div className='bgblackbig'>SMS</div>
        <div className='bgblacksmall'> Receive important SMS from our app. </div>
        </div>
        </div>
      </div>
    </Box>
    </div>)}
    {privacy && (
    <div className="formContainerEmailandSms">
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
         
      }}
      noValidate
      autoComplete="off"
    >
        <div className='formInputsColumnEmailAndSms'>
        <div className='row'>
        <input type='checkbox' className="shiftup"></input>
        <div className='column'>
        <div className='bgblackbig'>Private Account</div>
        <div className='bgblacksmall'> Only share posts with people who follow you.</div>
        </div>
        </div>
        <div className='margin-top'>
        <button className='full-wide-netral' ><FaUserAltSlash className='buttonIcon'></FaUserAltSlash>Restricted Accounts</button>
        <button className='full-wide-netral'><MdOutlineBlock className='buttonIcon'></MdOutlineBlock>Blocked Accounts</button>
        <button className='full-wide-netral'>< FaBellSlash className='buttonIcon'></FaBellSlash>Muted Accounts</button>
        </div>
      </div>
    </Box>
    </div>)}
    {security && (
    <div className="formContainerEmailandSms">
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
         
      }}
      noValidate
      autoComplete="off"
    >
        <div className='formInputsColumnEmailAndSms'>
        <div className='row'>
        <input type='checkbox' className="shiftup"></input>
        <div className='column'>
        <div className='bgblackbig'>Two Factor Authentication</div>
        <div className='bgblacksmall'>Receive OTP whenever you sign in.</div>
        </div>
        </div>
      </div>
    </Box>
    </div>)}

    </div>
    </nav>
  </div>);
}

export default  Settings;