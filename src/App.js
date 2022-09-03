import {useState, useEffect, useContext, createContext } from "react";
import {db, auth, storage} from './firebase-config';
import Login from './Login';
import Home from './Home';
import Modify from "./Modify";
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp} from 'firebase/firestore';
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import PasswordReset from "./PasswordReset";

library.add(fab, faCheckSquare, faCoffee)

function App() {

    const [user, setUser] = useState(null);
    const [img, setImg] = useState(null);


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
         //   window.location='App.js';
    });

  },[]);



  return (
    <div className="App">
    <BrowserRouter>
    <Routes>
  
    <Route path="/login" element={<Login />}> </Route>
        
       {!user ? (<Route path="/" exact element={<Login />}> </Route>):(
        <Route path="/" element={<Home />}></Route>
       )} ;


{user &&(
         <Route path="/help" element={<HelpCenter />}> </Route>)}
       
       <Route path='/modify' element={<Modify/>}></Route>

       <Route path="/passwordReset" element={<PasswordReset />}> </Route>
              
       {user &&(
        <Route path="/myprofile" element={<MyProfile />}></Route>
       )} ;
        {user &&(
        <Route path="/settings" element={<Settings />}></Route>
       )} ;
               {user &&(
        <Route path="/saved-posts" element={<SavedPosts />}></Route>
       )} ;

          {user &&(
        <Route path="/chats" element={<Chats />}></Route>
       )} ;

       
      {user &&(
       <Route path='/hashTag/:hash' element={<HashTag />}></Route>
       )} ;

{user &&(
       <Route path='/profile/:uid' element={<Profile />}></Route>
       )} ;

       

                 
    </Routes>
  </BrowserRouter>
  </div>
  );
}

export default App;

