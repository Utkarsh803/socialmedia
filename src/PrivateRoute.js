import {useState, useEffect, useContext, createContext } from "react";
import {db, auth, storage} from './firebase-config';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {signOut, onAuthStateChanged} from "firebase/auth";
import * as ReactBootstrap from 'react-bootstrap'

const PrivateRoute = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, SetLoading] = useState(true);

    useEffect(() => {
        
        onAuthStateChanged(auth, (currentUser)=>{
                if(currentUser && currentUser.emailVerified)
                {
                   
                    setUser(currentUser);
                    SetLoading(false);
                }
                else
                {
                    setUser(null);
                    SetLoading(false);
                }
        });
    
      },[]);

    if(loading) return <div style={{fontSize:'xxx-large', paddingTop:'20%',color:'white',height:'100vh', width:'100%',textAlign:'center', backgroundColor:'black'}}>
        {<ReactBootstrap.Spinner animation="border"/>}{' '}Loading...
        </div>; 
    return user ? children : <Navigate to="/login" />;
    
}

export default PrivateRoute;