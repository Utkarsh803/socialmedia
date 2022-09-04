import {useState, useEffect, useContext, createContext } from "react";
import {db, auth, storage} from './firebase-config';
import Login from './Login';
import Home from './Home';
import Modify from "./Modify";
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp} from 'firebase/firestore';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import {signOut, onAuthStateChanged} from "firebase/auth";
import MyProfile from "./MyProfile";
import Settings from "./Settings";
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Profile from "./Profile";
import SavedPosts from "./SavedPosts";
import Chats from "./Chats";
import HashTag from "./HashTag";
import './css/App.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'
import HelpCenter from './HelpCenter';
import HelpCenterPublic from './HelpCenterPublic';
import PasswordReset from "./PasswordReset";
import PrivateRoute from './PrivateRoute'

library.add(fab, faCheckSquare, faCoffee)

function App() {

    const [user, setUser] = useState(null);
    const [img, setImg] = useState(null);
    const [logged, SetLogged]=useState(false);

    useEffect(() => {
      onAuthStateChanged(auth, (currentUser)=>{
              if(currentUser && currentUser.emailVerified)
              {
                  setUser(currentUser);
                  
              }
              else
              {
                  setUser("");
                
              }
      });
  
    },[]);


  return (
    <div className="App">
  
    <BrowserRouter>
    <Routes>

    <Route exact path="/login" element={<Login setlogged={SetLogged}/>}> </Route>
    <Route exact path="/passwordReset" element={<PasswordReset/>}> </Route>
    <Route exact path="/policy-term-cookies" element={<HelpCenterPublic/>}> </Route>

    <Route
    path="/"
    element={
    <PrivateRoute >
    <Home />
    </PrivateRoute>}/>


    <Route
    path="/help"
    element={
    <PrivateRoute>
    <HelpCenter />
    </PrivateRoute>}/>


    <Route
    path="/myprofile"
    element={
    <PrivateRoute>
    <MyProfile />
    </PrivateRoute>}/>
              

    <Route
    path="/settings"
    element={              
    <PrivateRoute>
    <Settings />
    </PrivateRoute>}/>
     

    <Route
    path="/saved-posts"
    element={
    <PrivateRoute>
    <SavedPosts />
    </PrivateRoute>}/>


    <Route
    path="/chats"
    element={
    <PrivateRoute>
    <Chats />
    </PrivateRoute>}/>


    <Route
    path="/hashTag/:hash"
    element={
    <PrivateRoute>
    <HashTag />
    </PrivateRoute>}/>


    <Route
    path="/profile/:uid"
    element={
    <PrivateRoute>
    <Profile />
    </PrivateRoute>}/>
   
                 
    </Routes>
  </BrowserRouter>
  </div>
  );
}

export default App;

