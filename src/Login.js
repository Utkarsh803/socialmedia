import './css/Login.css';
import Home from './Home.js';
import {useState, useEffect} from 'react';
import writeUserData from './writeUserData';
import {createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from './firebase-config';
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc} from 'firebase/firestore';
import { BrowserRouter as Router, Switch, 
    Route,Outlet, Link ,Redirect,} from "react-router-dom";

function Login() {

    const [registerEmail, setRegisterEmail]=useState("");
    const [registerPassword, setRegisterPassword]=useState("");
    const [loginEmail, setLoginEmail]=useState("");
    const [loginPassword, setLoginPassword]=useState("");
    const [userId, setUserId]=useState("");
    const [name, setUserName]=useState("");
    const [loaded, setLoaded]=useState(true);
    const [loggedIn, setLoggedIn]=useState(true);
    

    const [user, setUser] = useState({});

    useEffect(() => {
    onAuthStateChanged(auth, (currentUser)=>{
            if(currentUser)
            {
                setUser(currentUser);
                setLoaded(true);
                setLoggedIn(true);
            }
            else
            {
                setUser("");
                setLoggedIn(false);
                setLoaded(true);
            }
         //   window.location='App.js';
    });},[]);

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
                name: name,
                email: registerEmail,
                });
        } 
        catch(error)
        {
            console.log(error.message);
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
    if(!loaded){
        return(
            <div >
                <h1>Loading</h1>
            </div>
        )
    }

    return (<div className="Login">
    {user ? (<Home></Home>):
    ( 
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
    )}

    </div>);
}

export default Login;
