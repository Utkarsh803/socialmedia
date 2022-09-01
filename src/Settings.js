import './css/Settings.css';
import Header from'./Header.js';
import Post from'./Post.js';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, serverTimestamp} from 'firebase/firestore';
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

import {v4} from 'uuid'
import * as ReactBootstrap from 'react-bootstrap'








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
    const [profilePic, SetProfilePic]=useState(null);
    const [uploadProfilePic, SetUploadProfilePic]=useState(false);
    const [profilePicFile, SetProfilePicFile]=useState(false);
    const [preview, SetPreview]=useState(false);
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




  const docRef = doc(db, "users", auth.currentUser.uid);
  let navigate = useNavigate(); 

  const getProfilePic= async()=>{

    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    
  getDownloadURL(ref(storage, `${auth.currentUser.uid}/${docSnap.data().profilePic}`))
  .then((url) => {
    SetCurrentPicUrl(url);
    console.log("Profile Pic Downloaded");
  })
  .catch((error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        console.log("File doesn't exist");
        break;
      case 'storage/unauthorized':
        console.log("User doesn't have permission to access the object");
        break;
      case 'storage/canceled':
        console.log("User canceled the upload");
        break;
      case 'storage/unknown':
        console.log("Unknown error occurred, inspect the server response");
        break;
    }
  });

  }

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
        SetCurrentPic(docSnap.data().profilePic);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
  };
 try{
  getProfilePic();
 }
 catch(error){
  console.log(error);
 }
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
    SetLoading(true);  
      try
       {  
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
              name: name,
              username:username,
              email: email,
              phone:phone,
              bio:bio,
              gender:gender,
              website:website,
              });
              SetLoading(false);
              showAlert();
              console.log("Profile updated!");
            
            } 
      catch(error)
      {
          console.log(error.message);
          SetLoading(false);
      }
  }

  

  const submitGetEmail = async () =>
  { 
    SetGetEmail(!getEmail);
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
        SetGetEmail(!getEmail);
      }
  }

  const submitGetSms = async (value) =>
  { 
    SetGetSms(!getSms);
      try
       { 
        const newFields = {getSms: value}; 
        await updateDoc(docRef, newFields);
              if(value){
                window.alert("You have successfully signed up to receive Sms");
              }
              else{
                window.alert("You have opted out of receiving Sms");
              }
            } 
      catch(error)
      {
        window.alert("We had some error");
        SetGetSms(!getSms);
      }
  }

  const submitPrivateAccount = async (value) =>
  { 
    SetPrivateAccount(!privateAccount);
      try
       {  
        const newFields = {private: value};
        await updateDoc(docRef, newFields);
            } 
      catch(error)
      {
        window.alert("We had some error");
        SetPrivateAccount(!privateAccount);

      }
  }

  const submitTwoFactor = async (value) =>
  { 
    SetTwoFactor(!twoFactor);
      try
       {  
        const newFields = {twoFactor: value};
            await updateDoc(docRef, newFields);
              if(value){
                window.alert("You have successfully signed up for two factor authentication.");
              }
              else{
                window.alert("You have opted out of two factor authentication");
              }
            } 
      catch(error)
      {
        window.alert("We had some error");
        SetTwoFactor(!twoFactor);
      }
  }

    const showAlert = () =>{
      window.alert("Profile successfully updated!")
    }





    const reAuth = async() =>{
      SetLoading(true);
      const cred = EmailAuthProvider.credential(auth.currentUser.email, credential); 
      reauthenticateWithCredential(auth.currentUser,cred).then(() => {
      if(newPass==newPassConfirm){
        updatePassword(auth.currentUser, newPassConfirm).then(() => {
          window.alert("New password set successfully.")
        }).catch((error) => {
          window.alert("Could not set password.Please try again")
          console.log(error);
        });
        SetLoading(false);
      }
      else{
        window.alert("New Passwords do not match.")
        SetLoading(false);
      }
    }).catch((error) => {
      window.alert("Password Incorrect");
      console.log(error);
      SetLoading(false);
    });
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      SetProfilePic(URL.createObjectURL(event.target.files[0]));
      SetProfilePicFile(event.target.files[0]);
    }
   }
  
   function handleButtonUploadImage() {
    SetProfilePic(null);
    SetProfilePicFile(null);
    SetUploadProfilePic(false);
    SetPreview(false);
  }

  function handleButtonPreview() {
    SetUploadProfilePic(!uploadProfilePic);
    SetPreview(!preview);
    
  }

  function handleButtonBack() {
    SetUploadProfilePic(!uploadProfilePic);
    SetPreview(!preview);
  }

  function handleButtonChangePic() {
    SetUploadProfilePic(!uploadProfilePic);
  }

  const addToStorage = async(imgName) =>{

    if (profilePicFile == null) {
        window.alert("Please choose a file first!");
        return;
    }
  
    try{
    const storageRef = ref(storage, `/${auth.currentUser.uid}/${imgName}`);
    SetUrl(imgName);
    const uploadTask = uploadBytesResumable(storageRef, profilePicFile);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
          const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
  
          // update progress
          SetPercent(percent);
      },
      (err) => console.log(err),
      () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            console.log(imgName);
          });
      }
  ); 
  console.log('image upload successful!');
  }
  
  catch(error){
    console.log(error);
  }
  }

  const  addProfilePicToAlbum = async(url) =>{
    try
    {  
       const usersCollectionRef = collection(db,  `/users/${auth.currentUser.uid}/album`);
       const addedDoc = await addDoc (usersCollectionRef, {
        url: url,
        created:serverTimestamp(),
        });      
        console.log("Image added to album with url : "+ url +"and id: "+addedDoc.id);   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Image could not be added to album. Try Again :("); 
   }
   }

  const addProfilePic = async() =>{
    try
    {  
       const imageName = profilePicFile.name + v4();
       await addToStorage(imageName);

       const userDoc = doc(db, "users", auth.currentUser.uid);
       const newFields = {profilePic: imageName};
       await updateDoc(userDoc, newFields);     
       
       addProfilePicToAlbum( imageName);
        console.log("Profile Pic uploaded ");   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("ProfilePic was not changes.Try again :("); 
   }
   }


  const handleButtonUploadProfilePic = async()=>{
      SetLoading(true);
      await addProfilePic();
      SetUploadProfilePic(false);
      SetPreview(false);
      SetProfilePic(null);
      SetProfilePicFile(null);
      SetPercent(0);
      SetUrl(null);
      SetLoading(false);
      window.location.reload();
  }



  return (<div className="Settings">
    <nav>
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
<div style={{paddingTop:'8%', backgroundColor:'black'}}>
    {uploadProfilePic && (   
 <div class="uploadtray">
  <AiOutlineCloseCircle onClick={handleButtonUploadImage} className="closeButton"></AiOutlineCloseCircle>
<div className='chooseAndDisplay'>
  <input type="file" className='chooseImage' onChange={onImageChange} ></input>
</div>
{profilePic &&(<img src={profilePic} alt="preview image" className='preview' />)}

{profilePic ?(<button className="uploadImage" onClick={handleButtonPreview}>Preview</button>):
(<button className="uploadImage" disabled={true}>Preview</button>)}

</div>)}

{preview && (   
  <div class="uploadtray">
   <AiOutlineCloseCircle onClick={handleButtonUploadImage} className="closeButton"></AiOutlineCloseCircle>
   <button className="back" onClick={handleButtonBack}>Back</button>
    
   {profilePic &&(
  <div className='profilePic'>
   <Avatar
  alt="preview image"
  src={profilePic}
  sx={{ width: 306, height: 306 }}/>
  </div>
  
  )}

{!loading ? (
   <button className="uploadImage" disabled={loading} onClick={handleButtonUploadProfilePic}>Change</button>
):(
  <button className="uploadImage">{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Changing...</button>
)}

<p>{percent}% done</p>
 </div>




  )}
    <div className='pageDivide'>
    <div className='options'>
            <button className='sideButtons'  onClick={handleButtonEditProfile}>Edit Profile</button>
            <button className='sideButtons' onClick={handleButtonPasswordReset}>Change Password</button>
            <button className='sideButtons' onClick={handleButtonEmailAndSms}>Email and SMS</button>
            <button className='sideButtons' onClick={handleButtonPrivacy}>Privacy</button>
            <button className='sideButtons' onClick={handleButtonSecurity}>Security</button>
            <button  className='sideButtons'>Login Activity {'('}Coming Soon!{')'}</button>
    </div>
    {editProfile && (
    <div className="formContainer">
        {isLoading && <Spinner/>}
        <div className='editProfileRow'>
        <Avatar
        alt="preview image"
        src={currentPicUrl}
        sx={{ width: 76, height: 76 }}/>
        <div className='editProfileColumn'>
        <div className='username'>{username}</div>

        <button className='changePicButton' onClick={handleButtonChangePic}>Change Profile Photo</button>
        
        </div>
        </div>
        <div className='formInputsColumn'>
        <div className='bgblack'>Name :<input placeholder={name} className='formInput' onChange={(event)=>{handleInputName(event.target.value)}}></input></div>
        
        <div className='bgblack'>Username :<input  placeholder={username} className='formInput' onChange={(event)=>{handleInputUsername(event.target.value)}}></input></div>
        <div className='bgblack'>Website :<input  placeholder={website} className='formInput' onChange={(event)=>{handleInputWebsite(event.target.value)}}></input></div>
        <div className='bgblack'> Bio :<input  placeholder={bio} className='formInputBio' onChange={(event)=>{handleInputBio(event.target.value)}}></input></div>
        <div className='bgblack'>Number :<input  placeholder={phone} className='formInput' onChange={(event)=>{handleInputPhone(event.target.value)}}></input></div>
        <div className='bgblack'>Email :<input  placeholder={email} className='formInput' onChange={(event)=>{handleInputEmail(event.target.value)}}></input></div>
        <div className='bgblack'>Gender :<input  placeholder={gender} className='formInput' onChange={(event)=>{handleInputGender(event.target.value)}}></input></div>
      {!loading ? (<button className='submit' onClick={addProfileInfo} disabled={loading}>Submit </button>):
      (<button className='submit'>{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Submiting.... </button>)}  
        
      
      </div>
    </div>)}
    {passwordReset && (
    <div className="formContainer">
  
        <div className='formInputsColumnPasswordReset'>
    
        <input placeholder='Enter Old Password*' className='formInput' onChange={(event=>{SetCredential(event.target.value)})}></input>
                
                
        <input placeholder='Enter New Password *'  className='formInput' onChange={(event=>{SetnewPass(event.target.value)})}></input>
        <input placeholder='Confirm New Password *' className='formInput'  onChange={(event=>{SetNewPassConfirm(event.target.value)})}></input>
      {!loading ?
       ( <button className='submitResetPassword'  disabled={loading} onClick={reAuth}>Submit</button>):
       (<button className='submitResetPassword'>{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Submiting...</button>)}
      
      </div>

    </div>)}
    {emailAndSms && (
    <div className="formContainerEmailandSms">
    
        <div className='formInputsColumnEmailAndSms'>
        <div className='row'>
        <input type='checkbox' checked={getEmail} className="shiftup" onChange={(e)=>{submitGetEmail(e.value.checked)}}></input>
        <div className='column'>
        <div className='bgblackbig' >Email</div>
        <div className='bgblacksmall'> Receive important emails from our app</div>
        </div>
        </div>
        <div className='row'>
        <input type='checkbox' checked={getSms} className="shiftup" onChange={(e)=>{submitGetSms(e.value.checked)}}></input>
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
        <input type='checkbox' checked={privateAccount} className="shiftup" onChange={(e)=>{submitPrivateAccount(e.target.checked)}}></input>
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
        <input type='checkbox' className="shiftup" checked={twoFactor} onChange={(e)=>{submitTwoFactor(e.value.checked)}}></input>
        <div className='column'>
        <div className='bgblackbig'>Two Factor Authentication</div>
        <div className='bgblacksmall'>Receive OTP whenever you sign in.</div>
        </div>
        </div>
      </div>
    
    </div>)}

    </div>
    </div>
    </nav>
  </div>);
}

export default  Settings;