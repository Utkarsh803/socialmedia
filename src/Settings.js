import './css/Settings.css';
import Header from'./Header.js';
import Post from'./Post.js';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore';
import {signOut, onAuthStateChanged, reauthenticateWithCredential,updatePassword, EmailAuthCredential , AuthCredential, EmailAuthProvider} from "firebase/auth";
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
import { useNavigate } from "react-router-dom";

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

  const[twoFactor, SetTwoFactor]= useState(false);
  const[privateAccount, SetPrivateAccount]= useState(false);
  const[getEmail, SetGetEmail]= useState(false);
  const[getSms, SetGetSms]= useState(false);

  const [credential, SetCredential]=useState("");
  const [newPass, SetnewPass]=useState("");
  const [newPassConfirm, SetNewPassConfirm]=useState("");


  const docRef = doc(db, "users", auth.currentUser.uid);
  let navigate = useNavigate(); 

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
        SetGetEmail(docSnap.data().getEmail);
        SetGetSms(docSnap.data().getSms);
        SetPrivateAccount(docSnap.data().private);
        SetTwoFactor(docSnap.data().twoFactor);
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
          navigate("/");
        

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
              getEmail:getEmail,
              getSms:getSms,
              private: privateAccount,
              twoFactor: twoFactor,
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

  const handleInputGetEmail= async()=>{
    SetGetEmail(!getEmail);
  }
  const handleInputTwoFactor= async()=>{
    SetTwoFactor(!twoFactor);
  }
  const handleInputPrivate= async()=>{
    SetPrivateAccount(!privateAccount);
  }
  const handleInputGetSms= async()=>{
    SetGetSms(!getSms);
  }
  

  const submitGetEmail = async () =>
  { 
    handleInputGetEmail();
    console.log("Email is " + getEmail);
      try
       {  
        const newFields = {getEmail: getEmail};
        await updateDoc(docRef, newFields);
              if(getEmail===true){
                window.alert("You have successfully signed up to receive emails");
              }
              else{
                window.alert("You have opted out of receiving emails");
              }
            } 
      catch(error)
      {
        window.alert("We had some error");
      }
  }

  const submitGetSms = async () =>
  { 
    handleInputGetSms();
      try
       { 
        const newFields = {getSms: getSms}; 
        await updateDoc(docRef, newFields);
              if(getSms){
                window.alert("You have successfully signed up to receive Sms");
              }
              else{
                window.alert("You have opted out of receiving Sms");
              }
            } 
      catch(error)
      {
        window.alert("We had some error");
      }
  }

  const submitPrivateAccount = async () =>
  { 
    handleInputPrivate();
      try
       {  
        const newFields = {private: privateAccount};
        await updateDoc(docRef, newFields);
              if(privateAccount){
                window.alert("You have set account to private.");
              }
              else{
                window.alert("You have set account to public.");
              }
            } 
      catch(error)
      {
        window.alert("We had some error");
      }
  }

  const submitTwoFactor = async () =>
  { 
    handleInputTwoFactor();
      try
       {  
        const newFields = {twoFactor: twoFactor};
            await updateDoc(docRef, newFields);
              if(twoFactor){
                window.alert("You have successfully signed up for two factor authentication.");
              }
              else{
                window.alert("You have opted out of two factor authentication");
              }
            } 
      catch(error)
      {
        window.alert("We had some error");
      }
  }

    const showAlert = () =>{
      window.alert("Profile successfully updated!")
    }





    const reAuth = async() =>{
      const cred = EmailAuthProvider.credential(auth.currentUser.email, credential); 
      reauthenticateWithCredential(auth.currentUser,cred).then(() => {
      if(newPass==newPassConfirm){
        updatePassword(auth.currentUser, newPassConfirm).then(() => {
          window.alert("New password set successfully.")
        }).catch((error) => {
          window.alert("Could not set password.Please try again")
          console.log(error);
        });
      }
      else{
        window.alert("New Passwords do not match.")
      }
    }).catch((error) => {
      window.alert("Password Incorrect");
      console.log(error);
    });
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
            <button disabled className='sideButtons' onClick={handleButtonLoginActivity}>Login Activity {'('}Coming Soon!{')'}</button>
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
    
        <input placeholder='Enter Old Password*' className='formInput' onChange={(event=>{SetCredential(event.target.value)})}></input>
                
                
        <input placeholder='Enter New Password *'  className='formInput' onChange={(event=>{SetnewPass(event.target.value)})}></input>
        <input placeholder='Confirm New Password *' className='formInput'  onChange={(event=>{SetNewPassConfirm(event.target.value)})}></input>
        <button className='submitResetPassword'   onClick={reAuth}>Submit</button>
      </div>

    </div>)}
    {emailAndSms && (
    <div className="formContainerEmailandSms">
    
        <div className='formInputsColumnEmailAndSms'>
        <div className='row'>
        <input type='checkbox' checked={getEmail} className="shiftup" onChange={submitGetEmail}></input>
        <div className='column'>
        <div className='bgblackbig' >Email</div>
        <div className='bgblacksmall'> Receive important emails from our app</div>
        </div>
        </div>
        <div className='row'>
        <input type='checkbox' checked={getSms} className="shiftup" onChange={submitGetSms}></input>
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
        <input type='checkbox' checked={privateAccount} className="shiftup" onChange={submitPrivateAccount}></input>
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
        <input type='checkbox' className="shiftup" checked={twoFactor} onChange={submitTwoFactor}></input>
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