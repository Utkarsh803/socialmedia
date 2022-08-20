import {useState, useEffect } from "react";
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

export const addNotification=async(type,content,postid, authorid)=>{
  const NotRef = collection(db, `users/${authorid}/notifications`);

  if(type === "like"){
  await addDoc(NotRef,{
    type:"like",
    content:content,
    author:authorid,
    timeStamp:serverTimestamp(),
  })
  console.log("Posted a notification about a like.")
  }

  else if(type === "comment"){
    await addDoc(NotRef,{
      type:"comment",
      content:content,
      author:authorid,
      postid:postid,
      timeStamp:serverTimestamp(),
    })
    console.log("Posted a notification about a comment.")
    }

    else if(type === "request"){
      await addDoc(NotRef,{
        type:"request",
        content:content,
        author:authorid,
        timeStamp:serverTimestamp(),
      })
      console.log("Posted a notification about a request.")
      }

      else if(type === "follow"){
        await addDoc(NotRef,{
          type:"follow",
          content:content,
          author:authorid,
          timeStamp:serverTimestamp(),
        })
        console.log("Posted a notification about a follow.")
        }

        else if(type === "mention"){
          await addDoc(NotRef,{
            type:"comment",
            content:content,
            author:authorid,
            postid:postid,
            timeStamp:serverTimestamp(),
          })
          console.log("Posted a notification about a mention.")
          }
//to do mention
}

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
               {user &&(
        <Route path="/saved-posts" element={<SavedPosts />}></Route>
       )} ;

       <Route path='/:uid' element={<Profile />}>
       </Route>

           
    </Routes>
  </BrowserRouter>
  </div>
  );
}

export default App;

