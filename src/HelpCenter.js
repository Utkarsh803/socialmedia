import './css/HelpCenter.css';
import Header from'./Header.js';
import Post from'./Post.js';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc,query,where, updateDoc, deleteDoc, doc, getDoc, setDoc, serverTimestamp} from 'firebase/firestore';
import {signOut, onAuthStateChanged, reauthenticateWithCredential,updatePassword, EmailAuthCredential , AuthCredential, EmailAuthProvider} from "firebase/auth";
import * as React from 'react';
import Button from '@mui/material/Button';
import {FaUserAltSlash, FaBellSlash} from 'react-icons/fa';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import {MdOutlineBlock} from 'react-icons/md';
import Spinner from './Spinner';
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Dropdown from'./Dropdown.js';
import {v4} from 'uuid'
import * as ReactBootstrap from 'react-bootstrap'
import featuresJson from './features.json';
import manageAccountJson from './manageAccount.json';
import stayingSafeJson from './stayingSafe.json';
import privacyJson from './privacy.json';
import policyJson from './policy.json';


import List from './List'


function HelpCenter() {

  const [userId, setUserId]=useState("");
    const [name, setName]=useState("");
    
    const [loggedIn, setLoggedIn]=useState(true);
    const [features, SetFeatures]=useState(true);
    const [manageAccount, SetManageAccount]=useState(false);
    const [stayingSafe, SetStayingSafe]=useState(false);
    const [privacy, SetPrivacy]=useState(false);
    const [policy, SetPolicy]=useState(false);
    const [report, SetReport]=useState(false);
    
    const [username, SetUserName]=useState("");
    const [userMessage, SetUserMessage]=useState("");
    const [website, SetWebsite]=useState("");
    const [bio, SetBio]=useState("");
    const [phone, SetPhone]=useState("");
    const [email, SetEmail]=useState("");
    const [gender, SetGender]=useState("");
    const [user, setUser] = useState('');
    const [profilePic, SetProfilePic]=useState(null);
    const [uploadProfilePic, SetUploadProfilePic]=useState(false);
    const [profilePicFile, SetProfilePicFile]=useState(false);
    const [preview, SetPreview]=useState(false);
    const [sent, SetSent]=useState(false);
    const [loading, SetLoading]=useState(false);
    const [enteredText, setEnteredText] = useState('')

  const [val, setVal] = React.useState();

  const [isLoading, setIsLoading] = useState(false);

  const[twoFactor, SetTwoFactor]= useState(false);
  const[privateAccount, SetPrivateAccount]= useState(false);
  const[getEmail, SetGetEmail]= useState(false);
  const[getSms, SetGetSms]= useState(false);

  const [credential, SetCredential]=useState("");
  const [newPass, SetnewPass]=useState("");
  const [newPassConfirm, SetNewPassConfirm]=useState("");
  const [percent, SetPercent]=useState(0);
  const [url, SetUrl]=useState(null);
  const [currentPic, SetCurrentPic]=useState(null);
  const [currentPicUrl, SetCurrentPicUrl]=useState(null);
  const[showBlocked, SetShowBlocked]= useState(false);
  const[showMuted, SetShowMuted]= useState(false)
  const[showRestricted, SetShowRestricted]= useState(false);

  const [blockedUsers, SetBlockedUsers]=useState(null);
  const [mutedUsers, SetMutedUsers]=useState(null);
  const [restrictedUsers, SetRestrictedUsers]=useState(null);
  
  const blockString ="block"
  const restrictString ="restrict"
  const muteString ="mute"

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const handleButtonEditProfile = () =>
  {
          SetFeatures(true);
          SetManageAccount(false);
          SetSent(false);
          SetStayingSafe(false);
          SetPrivacy(false);
          SetPolicy(false);
          SetReport(false);
         
        

  }

  const handleButtonPasswordReset = () =>
  {
    SetFeatures(false);
          SetManageAccount(true);
          SetStayingSafe(false);
          SetPrivacy(false);
          SetPolicy(false);
          SetSent(false);
          SetReport(false);
        

  }
  const handleButtonEmailAndSms = () =>
  {
          SetFeatures(false);
          SetManageAccount(false);
          SetStayingSafe(true);
          SetSent(false);
          SetPrivacy(false);
          SetPolicy(false);
          SetReport(false);
        

  }
  const handleButtonPrivacy = () =>
  {
    SetFeatures(false);
          SetPrivacy(true);
          SetStayingSafe(false);
          SetManageAccount(false);
          SetPolicy(false);
          SetSent(false);
          SetReport(false);
        

  }

  const handleButtonSecurity = () =>
  {
    SetFeatures(false);
          SetPolicy(true);
          SetStayingSafe(false);
          SetPrivacy(false);
          SetManageAccount(false);
          SetReport(false);
          SetSent(false);
  }
  const handleButtonLoginActivity = () =>
  {
    SetFeatures(false);
          SetReport(true);
          SetStayingSafe(false);
          SetPrivacy(false);
          SetPolicy(false);
          SetManageAccount(false);
          SetSent(false);
        

  }

  const handleInputName=(e)=>{

    setName(e);
   
  }
  
  const handleInputUsername=(e)=>{

    SetUserName(e);
   
  }
  const handleInputBio=(e)=>{
  
    SetBio(e);
  
  }
  const handleInputPhone=(e)=>{
    
    SetPhone(e);
    
  }
  const handleInputEmail=(e)=>{
    
    SetEmail(e);
    
  }
  const handleInputGender=(e)=>{
   
    SetGender(e);

  }
  const handleInputWebsite=(e)=>{

    SetWebsite(e);
  
  }


  const sendMessage=async(e)=>{
    e.preventDefault();
if(userMessage.length>1 && userMessage!==null && userMessage!=""){
    SetLoading(true);
    const docRef = collection(db, "AdminMessages");
    await setDoc(doc(docRef), {
      message:userMessage,
      uid:auth.currentUser.uid,
      createdAt:serverTimestamp(),
    })
    SetSent(true);
    SetLoading(false);
  }else{
    window.alert("Please type in a message. ")
  }
   
  }



  return (<div className="HelpCenter">
    <nav>
    <Header></Header>
    <div style={{paddingTop:'100px', backgroundColor:'black'}}>
    <div className='pageDivide'>
    <div className='options'>
            <button className='sideButtons'  onClick={handleButtonEditProfile}>Features</button>
            <button className='sideButtons' onClick={handleButtonPasswordReset}>Manage Account</button>
            <button className='sideButtons' onClick={handleButtonEmailAndSms}>Staying Safe</button>
            <button className='sideButtons' onClick={handleButtonPrivacy}>Privact and Security</button>
            <button className='sideButtons' onClick={handleButtonSecurity}>Terms and Conditions</button>
            <button className='sideButtons' onClick={handleButtonLoginActivity}>Message and Requests</button>
    </div>
    {features && (
    <div className="formContainer" style={{paddinLeft:'0%', marginLeft:'0%'}}>
        <div style={{width:'98%', backgroundColor:'transparent', color:'white'}}>
        {featuresJson.map((feature)=>
            <Dropdown name={feature.name} text={feature.text}></Dropdown>
        )
        }
        </div>

    </div>)}
    {manageAccount && (
    <div className="formContainer" style={{paddinLeft:'0%', marginLeft:'0%'}}>
    <div style={{width:'98%', backgroundColor:'transparent', color:'white'}}>
    {manageAccountJson.map((feature)=>
        <Dropdown name={feature.name} text={feature.text}></Dropdown>)}
    </div>

</div>
)}
    {stayingSafe && (
      <div className="formContainer" style={{paddinLeft:'0%', marginLeft:'0%'}}>
      <div style={{width:'98%', backgroundColor:'transparent', color:'white'}}>
      {stayingSafeJson.map((feature)=>
          <Dropdown name={feature.name} text={feature.text}></Dropdown>)}
      </div>

  </div>)}
    {privacy && (
       <div className="formContainer" style={{paddinLeft:'0%', marginLeft:'0%'}}>
       <div style={{width:'98%', backgroundColor:'transparent', color:'white'}}>
       {privacyJson.map((feature)=>
           <Dropdown name={feature.name} text={feature.text}></Dropdown>)}
       </div>

   </div>)}

    {policy && (
       <div className="formContainer" style={{paddinLeft:'0%', marginLeft:'0%'}}>
       <div style={{width:'98%', backgroundColor:'transparent', color:'white'}}>
       {policyJson.map((feature)=>
           <Dropdown name={feature.name} text={feature.text}></Dropdown>)}

       </div>

   </div>)}

   {report && (
       <div className="formContainer" style={{paddingLeft:'10%'}}>
        <form>
        <textArea placeholder="your message" style={{width:'90%', height:'40vh'}} onChange={(e)=>{
          SetUserMessage(e.target.value)
        }}></textArea>
        <div style={{width:'90%', height:'40vh'}}>
        {!loading && ! sent &&(
        <button style={{marginLeft:'40%', width:'fit-content'}} onClick={(e)=>{sendMessage(e)}}>Submit</button>)}
        
        {!loading && sent &&(
        <button disabled={true} style={{marginLeft:'40%', width:'fit-content'}}>Submited</button>)}

{loading && (
        <button style={{marginLeft:'40%', width:'fit-content'}}>{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Submiting...</button>)}
        </div>
        </form>

   </div>)}

    </div>
    </div>
    </nav>
  </div>);
}

export default HelpCenter;