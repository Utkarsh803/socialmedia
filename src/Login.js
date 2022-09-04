import './css/Login.css';
import Home from './Home.js';
import {useState, useEffect} from 'react';
import writeUserData from './writeUserData';
import {createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import {auth} from './firebase-config';
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, where, serverTimestamp, query, getDoc} from 'firebase/firestore';
import { BrowserRouter as Router, Switch, 
    Route,Outlet, Link ,Redirect, useNavigate, Navigate} from "react-router-dom";
import LoginHeader from './LoginHeader';
import  Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';
import * as ReactBootstrap from 'react-bootstrap'




function Login(setlogged) {

    const [registerEmail, setRegisterEmail]=useState("");
    const [registerPassword, setRegisterPassword]=useState("");
    const [loginEmail, setLoginEmail]=useState("");
    const [loginPassword, setLoginPassword]=useState("");
    const [userId, setUserId]=useState("");
    const [name, setUserName]=useState("");
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingR, setLoadingR] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [errorMsgName, setErrorMsgName] = useState("");
    const [errorMsgLogin, setErrorMsgLogin] = useState("");
    const [showMobileWarning, setShowMobileWarning] = useState(false);


useEffect(()=>{
    if(window.innerWidth <= 800){
        setShowMobileWarning(true);
    }
}, [])

const navigate = useNavigate();
    const register = async () =>
    {
        setLoadingR(true);
        setLinkSent(false);
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if(!format.test(name) && !hasWhiteSpace(name)){
            const nameRef = collection(db, "users");
            const q = query(nameRef, where("name", "==", `${name}`), )
            const querySnapshot = await getDocs(q);
            if(querySnapshot.size !== 0){
            setErrorMsgName("Username is not available.")
            return ;
            }
            else{
                setUserName(name);
                setErrorMsgName(null)
            }
        }
        else{
            setErrorMsgName("Special characters and spaces are not allowed")
            return ;
        }
        

        const duplicate = await duplicateEmail(registerEmail);

        if(duplicate){
            return;
        }
            await createUserWithEmailAndPassword(auth, registerEmail, registerPassword ).then((result)=>{

            }).catch((error)=>{
                setErrorMsg(error.message)
                setLoadingR(false);
                return;
            });

            await addToDatabase();
            console.log("Added to database");
            try{
            sendEmailVerification(auth.currentUser);
            }catch(e){
            console.log(e);
            }
            await signOut(auth);
            setErrorMsg(null);
            setLinkSent(true);
            setLoadingR(false);  

    }

    const addToDatabase = async () =>
    {
        try
        {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                bio:"",
                created:serverTimestamp(),
                followers:0,
                following:0,
                gender:"",
                getEmail:true,
                getSms:true,
                name: name,
                phone:"",
                posts:0,
                private:false,
                twoFactor:false,
                username:name,
                website:"",
                email: registerEmail,
                profilePic:"",
                lastLogin:serverTimestamp(),
                notificationStamp:serverTimestamp(),
                banned:false,
                hold:false,
                verified:false,
                });

        } 
        catch(error)
        {
            console.log(error.message);
        }
    }

    
    const addToFollowerList = async(uid) =>{
    try
    {  
      await setDoc(doc(db,  `/users/${auth.currentUser.uid}/followers`, `${uid}`), {
        totalFollowers:0,
       });         
        console.log("A Follower list was created for the post: ");   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Follower list could not be created. Try Again :("); 
   }
   }


   const addToFollowingList = async(uid) =>{
    try
    {  
        await setDoc(doc(db,  `/users/${auth.currentUser.uid}/following`, `${uid}`), {
            totalFollowing:0,
           });        
 
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Following list could not be created. Try Again :("); 
   }
   }

   
   const addToSavedList = async(uid) =>{
    try
    {  
        await setDoc(doc(db,  `/users/${auth.currentUser.uid}/saved`, `${uid}`), {
            totalSaves:0,
           });        
          
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Saved list could not be created. Try Again :("); 
   }
   }
   const addToBlockedList = async(uid) =>{
    try
    {  
      await setDoc(doc(db,  `/users/${auth.currentUser.uid}/blocked`, `${uid}`), {
        totalBlocked:0,
       });         
          
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Blocked list could not be created. Try Again :("); 
   }
   }

   const addToRestricetedList = async(uid) =>{
    try
    {  
      await setDoc(doc(db,  `/users/${auth.currentUser.uid}/restricted`, `${uid}`), {
        totalRestricted:0,
       });         
       
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Restricted list could not be created. Try Again :("); 
   }
   }

   
   const addToMutedList = async(uid) =>{
    try
    {  
      await setDoc(doc(db,  `/users/${auth.currentUser.uid}/muted`, `${uid}`), {
        totalMuted:0,
       });         
           
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Muted list could not be created. Try Again :("); 
   }
   }

    const login = async () =>
    {
        setLoading(true);
        setErrorMsgLogin(null);
        try
        {
            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword );
            setUserId(auth.currentUser.uid);
          
            if(!auth.currentUser.emailVerified){
                setErrorMsgLogin("Please verify your email.")
            }else{
            updateDoc(doc(db, `users`, `${auth.currentUser.uid}`), {
                lastLogin:serverTimestamp(),
            })
            navigate('/');
           }
        } 
        catch(error)
        {
            console.log(error.message);
            setErrorMsgLogin(error.message);
        }
        setLoading(false);
    }

    const logout = async () =>
    {
            await signOut(auth);

    }

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
      }

    const handleSetUsername=async(value)=>{

        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(!format.test(value) && !hasWhiteSpace(value)){
        const nameRef = collection(db, "users");
        const q = query(nameRef, where("username", "==", `${value}`))
        const querySnapshot = await getDocs(q);

        if(querySnapshot.size !== 0){
        setErrorMsgName("Username is not available.")
        }
        else{
            setUserName(value);
            setErrorMsgName(null)
        
        }
    }
    else{
        setErrorMsgName("Special characters and spaces are not allowed")
    }
    }



    const handleSetEmail=async(value)=>{
        setLinkSent(null)
        const nameRef = collection(db, "users");
        const q = query(nameRef, where("email", "==", `${value}`))
        const querySnapshot = await getDocs(q);
        
        if(querySnapshot.size !== 0){
        setErrorMsgName("Email already in use.")
        }
        else{
            setRegisterEmail(value);
            setErrorMsgName(null)
            
        }
    }
    

    const duplicateEmail=async(value)=>{
        setLinkSent(null)
        const nameRef = collection(db, "users");
        const q = query(nameRef, where("email", "==", `${value}`))
        const querySnapshot = await getDocs(q);
   
        if(querySnapshot.size !== 0){
        setErrorMsgName("Email already in use.")
        return true;
        }
        else{
            setErrorMsgName(null)
            return false;
        }
    }



    const goToPasswordReset=()=>{
        navigate('/passwordReset');
    }


    return (<div className="Login"> 
    <LoginHeader></LoginHeader>
    {!showMobileWarning ?

    (<div style={{backgroundColor:'black', height:'100%'}}>   
    <div className='divider'>
    <div className="half">
    <div className='heading'>Register</div>
    {linkSent &&
    (<small style={{color:'green', textAlign:'center'}}>Email Verification Link Sent!!</small>)}
    {errorMsg && errorMsgName &&(
        <small style={{color:'red', textAlign:'center'}}>{errorMsgName}</small>
    )}

    {errorMsg && !errorMsgName &&(
        <small style={{color:'red', textAlign:'center'}}>{errorMsg}</small>
    )}

{!errorMsg && errorMsgName &&(
        <small style={{color:'red', textAlign:'center'}}>{errorMsgName}</small>
    )}

    <input placeholder='Name...' className='input' required={true}  onChange={(event)=>{handleSetUsername(event.target.value);}}></input>
    <input placeholder='Email...' className='input'  required={true}  onChange={(event)=>{handleSetEmail(event.target.value);}}></input>
    <input placeholder='Password...' type="password"  required={true}  className='input'  onChange={(event)=>{setRegisterPassword(event.target.value);}}></input>
    {!loadingR ?(
    <button style={{width:'100%'}} disabled={errorMsgName} onClick={register}>Sign Up</button>):(
    <button style={{ width:'100%'}} >{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Registering ....</button>)}
    
    </div>

    <div className="half" >
    <div className='heading'>Login</div>
    {errorMsgLogin && (
        <small style={{color:'red', textAlign:'center'}}>{errorMsgLogin}</small>
    )}
    <input placeholder='Email...' className='input' onChange={(event)=>{setLoginEmail(event.target.value);}}></input>
    <input placeholder='Password...' type="password" className='input' onChange={(event)=>{setLoginPassword(event.target.value);}}></input>
  {!loading ?(
    <button style={{width:'100%'}} disabled={loading} onClick={login}>Sign In</button>):(
    <button style={{ width:'100%'}} >{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Signing In ....</button>)}

    <div className="forgotPass">
     Forgot password?{' '}
  <small style={{color:'lightblue', cursor:'pointer'}} onClick={goToPasswordReset}>Click here.</small> 
    </div>
    </div>
    </div>
    </div>):(
        <div style={{backgroundColor:'black', height:'100vh', width:'100%', paddingTop:'200px',color:'white', textAlign:'center'}}>
        <h1>Made for Desktop</h1>
        <h5>This website was made for desktop view. Switch to a desktop to sign up or sign in.</h5>
        </div>
    )}
    </div>);
}

export default Login;
