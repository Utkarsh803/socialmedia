import './css/Login.css';
import Home from './Home.js';
import {useState, useEffect} from 'react';
import writeUserData from './writeUserData';
import {createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from './firebase-config';
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc} from 'firebase/firestore';
import { BrowserRouter as Router, Switch, 
    Route,Outlet, Link ,Redirect, useNavigate} from "react-router-dom";

function Login() {

    const [registerEmail, setRegisterEmail]=useState("");
    const [registerPassword, setRegisterPassword]=useState("");
    const [loginEmail, setLoginEmail]=useState("");
    const [loginPassword, setLoginPassword]=useState("");
    const [userId, setUserId]=useState("");
    const [name, setUserName]=useState("");
    const [user, setUser] = useState({});



    const register = async () =>
    {
        try
        {
            await createUserWithEmailAndPassword(auth, registerEmail, registerPassword ).then((result)=>{

            addToDatabase();
            }).catch((error)=>{
                console.log(error)});
            
            
        } 
        catch(error)
        {
            console.log(error.message);
        }
    }

    const addToDatabase = async () =>
    {
        try
        {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                bio:"",
                created:0,
                followers:0,
                following:0,
                gender:"",
                getEmail:true,
                getSms:true,
                name: name,
                phone:0,
                posts:0,
                private:false,
                twoFactor:false,
                username:name,
                website:"",
                email: registerEmail,
                profilePic:"",
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
        console.log("A Following list was created for the post: ");   
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
        console.log("A Savedlist was created for the post: ");   
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
        console.log("A Blocked list was created for the post: ");   
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
        console.log("A Restricted list was created for the post: ");   
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
        console.log("A Muted list was created for the post: ");   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Muted list could not be created. Try Again :("); 
   }
   }

    const login = async () =>
    {
        try
        {
            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword );
            setUserId(auth.currentUser.uid);
        
            console.log(user);
        } 
        catch(error)
        {
            console.log(error.message);
        }
    }

    const logout = async () =>
    {
            await signOut(auth);

    }


    return (<div className="Login">
    
    <div>    
    <div className='divider'>
    <div className="half">
    <div className='heading'>Register User</div>
    <input placeholder='Name...' className='input' onChange={(event)=>{setUserName(event.target.value);}}></input>
    <input placeholder='Email...' className='input' onChange={(event)=>{setRegisterEmail(event.target.value);}}></input>
    <input placeholder='Password...' type="password" className='input'  onChange={(event)=>{setRegisterPassword(event.target.value);}}></input>
    <button className="buttons" onClick={register}>Create User</button>
    </div>

    <div className="half" >
    <div className='heading'>Login</div>
    <input placeholder='Email...' className='input' onChange={(event)=>{setLoginEmail(event.target.value);}}></input>
    <input placeholder='Password...' type="password" className='input' onChange={(event)=>{setLoginPassword(event.target.value);}}></input>
    <button className="buttons" onClick={login}>Login</button>
    <div className="forgotPass">
     Forgot password?{' '}
    Click here.
    </div>
    </div>
    </div>
    </div>
    

    </div>);
}

export default Login;
