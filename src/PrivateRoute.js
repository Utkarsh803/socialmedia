import {useState, useEffect, useContext, createContext } from "react";
import {db, auth, storage} from './firebase-config';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {signOut, onAuthStateChanged} from "firebase/auth";

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
                    setUser("");
                    SetLoading(false);
                }
        });
    
      },[]);

    return auth.currentUser && auth.currentUser.emailVerified ? children : <Navigate to="/login" />;
    
}

export default PrivateRoute;