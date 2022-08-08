import './css/Settings.css';
import Header from'./Header.js';
import Post from'./Post.js';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore';
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
import Spinner from './Spinner';

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
    const [user, setUser] = useState('');
  const [value, setValue] = React.useState('Controlled');

  const [isLoading, setIsLoading] = useState(false);

  const docRef = doc(db, "users", auth.currentUser.uid);


  useEffect(()=>{
    const getUsersData = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setName(docSnap.data().name);
        SetUserName(docSnap.data().username);
        SetBio(docSnap.data().bio);
        SetPhone(docSnap.data().phone);
        SetEmail(docSnap.data().email);
        SetGender(docSnap.data().gender);
        SetWebsite(docSnap.data().website);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
  };

  getUsersData();
  }, [] );



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
  
  const handleInputUsername=(e)=>{
    SetUserName(e);
    console.log(username);
  }
  const handleInputBio=(e)=>{
    SetBio(e);
    console.log(bio);
  }
  const handleInputPhone=(e)=>{
    SetPhone(e);
    console.log(phone);
  }
  const handleInputEmail=(e)=>{
    SetEmail(e);
    console.log(email);
  }
  const handleInputGender=(e)=>{
    SetGender(e);
    console.log(gender);
  }
  const handleInputWebsite=(e)=>{
    SetWebsite(e);
    console.log(gender);
  }
  

  const buttons = [
    <Button key="one">One</Button>,
    <Button key="two">Two</Button>,
    <Button key="three">Three</Button>,
  ];



  const addProfileInfo = async () =>
  {
    setIsLoading(true);  
      try
       {  
          await setDoc(doc(db, "users", auth.currentUser.uid), {
              name: name,
              username:username,
              email: email,
              phone:phone,
              bio:bio,
              gender:gender,
              website:website,
              });
              setIsLoading(false);
              showAlert();
            } 
      catch(error)
      {
          console.log(error.message);
          setIsLoading(false);
      }
  }

    const showAlert = () =>{
      window.alert("Profile successfully updated!")
    }



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
        {isLoading && <Spinner/>}
        <div className='username'>{auth.currentUser.email}</div>
        <button className='changePicButton'>Change Profile Photo</button>
        
        <div className='formInputsColumn'>
        <div className='bgblack'>Name :<input placeholder={name} className='formInput'></input></div>
        
        <div className='bgblack'>Username :<input placeholder={username} className='formInput' onChange={(event)=>{handleInputName(event.target.value)}}></input></div>
        <div className='bgblack'>Website :<input placeholder={website} className='formInput' onChange={(event)=>{handleInputWebsite(event.target.value)}}></input></div>
        <div className='bgblack'> Bio :<input placeholder={bio} className='formInputBio' onChange={(event)=>{handleInputBio(event.target.value)}}></input></div>
        <div className='bgblack'>Number :<input placeholder={phone} className='formInput' onChange={(event)=>{handleInputPhone(event.target.value)}}></input></div>
        <div className='bgblack'>Email :<input placeholder={email} className='formInput' onChange={(event)=>{handleInputEmail(event.target.value)}}></input></div>
        <div className='bgblack'>Gender :<input placeholder={gender} className='formInput' onChange={(event)=>{handleInputGender(event.target.value)}}></input></div>
        <button className='submit' onClick={addProfileInfo} disabled={isLoading}>Submit </button>
      </div>
    </div>)}
    {passwordReset && (
    <div className="formContainer">
  
        <div className='formInputsColumnPasswordReset'>
    
        <input placeholder='Enter Old Password*' className='formInput'></input>
                
                
        <input placeholder='Enter New Password *'  className='formInput'></input>
        <input placeholder='Confirm New Password *' className='formInput'></input>
        <button className='submitResetPassword' disabled={isLoading}>Submit</button>
      </div>

    </div>)}
    {emailAndSms && (
    <div className="formContainerEmailandSms">
    
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

    </div>)}
    {privacy && (
    <div className="formContainerEmailandSms">

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
    
    </div>)}
    {security && (
    <div className="formContainerEmailandSms">

        <div className='formInputsColumnEmailAndSms'>
        <div className='row'>
        <input type='checkbox' className="shiftup"></input>
        <div className='column'>
        <div className='bgblackbig'>Two Factor Authentication</div>
        <div className='bgblacksmall'>Receive OTP whenever you sign in.</div>
        </div>
        </div>
      </div>
    
    </div>)}

    </div>
    </nav>
  </div>);
}

export default  Settings;