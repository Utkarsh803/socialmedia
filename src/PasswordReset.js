import './css/Login.css';
import Home from './Home.js';
import {useState, useEffect} from 'react';
import writeUserData from './writeUserData';
import {createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail,signInWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import {auth} from './firebase-config';
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, where, serverTimestamp, query, getDoc} from 'firebase/firestore';
import { BrowserRouter as Router, Switch, 
    Route,Outlet, Link ,Redirect, useNavigate} from "react-router-dom";
import LoginHeader from './LoginHeader';
import  Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';
import * as ReactBootstrap from 'react-bootstrap'




function PasswordReset() {

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


    const handleButtonSendEmailLink=async()=>{
        setLoading(true);
        try{
            setLinkSent(null)
            setErrorMsgName(null);
            const nameRef = collection(db, "users");
            const q = query(nameRef, where("email", "==", `${registerEmail}`))
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot.size);
            if(querySnapshot.size === 0){
            setErrorMsgName("No account for this email.")
            setLoading(false);
            return;
            }
            else{
                await sendPasswordResetEmail(auth, registerEmail).then((result)=>{
                    setErrorMsgName(null)
                    setLinkSent(true);
                    setLoading(false);
                }).catch((error)=>{
                    console.log(error.message)
                    setLoading(false);
                })
            }}
            catch(e){
                console.log(e.message)
                setLoading(false);
            }
    }

    return (<div className="Login"> 
    <LoginHeader></LoginHeader>
    <div className='divider'>
    <div style={{width:'100%', paddingTop:'10%'}}>
    <div style={{textAlign:'center', color:'white', fontSize:'x-large', marginBottom:'5%'}}>Reset Password</div>
    {errorMsgName && (
        <div style={{textAlign:'center', color:'white', fontSize:'small'}}>
        <small style={{color:'red', textAlign:'center'}}>{errorMsgName}</small>
    </div>
    )}
        {linkSent && !errorMsgName && (
        <div style={{textAlign:'center', color:'white', fontSize:'small'}}>
        <small style={{color:'green', textAlign:'center'}}>Password reset link has been sent to your email.</small>
    </div>
    )}
    <input placeholder='Email...' style={{textAlign:'center', color:'white',fontSize:'large', width:'30%', marginLeft:'35%',color:'black', borderRadius:'5px'}} onChange={(event)=>{ setRegisterEmail(event.target.value)}}></input>
  {!loading ?(
    <button  style={{textAlign:'center',width:'30%', marginLeft:'35%'}} disabled={loading} onClick={handleButtonSendEmailLink}>Send Password Reset Link</button>):(
    <button style={{textAlign:'center',width:'30%', marginLeft:'35%'}} >{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Signing In ....</button>)}
    </div>
    </div>
    </div>);
}

export default PasswordReset;
