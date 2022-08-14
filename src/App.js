import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import Login from './Login';
import Home from './Home';
import Modify from "./Modify";
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import {signOut, onAuthStateChanged} from "firebase/auth";
import MyProfile from "./MyProfile";
import Settings from "./Settings";
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Profile from "./Profile";

function App() {

    const [user, setUser] = useState(null);
    const [img, setImg] = useState(null);

   


    useEffect(() => {
    onAuthStateChanged(auth, (currentUser)=>{
            if(currentUser)
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
       
       <Route path='/modify' element={<Modify/>}></Route>
              
       {user &&(
        <Route path="/myprofile" element={<MyProfile />}></Route>
       )} ;
        {user &&(
        <Route path="/settings" element={<Settings />}></Route>
       )} ;

       <Route path='/:uid' element={<Profile />}>
       </Route>

           
    </Routes>
  </BrowserRouter>
  </div>
  );
}

export default App;
