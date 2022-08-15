
import logo from './mslogo.jpg';
import PostHeader from './PostHeader';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';
import PostTools from './PostTools';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"

function GridImg({postid, name, authorId, captions, comments, likes, timestamp, url}) {

  const[postUrl, SetPostUrl]=useState(null);
  
  const getPostPic= async()=>{
  getDownloadURL(ref(storage, `${authorId}/${url}`))
  .then((url) => {
    SetPostUrl(url);
  })
  .catch((error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        console.log("File doesn't exist");
        break;
      case 'storage/unauthorized':
        console.log("User doesn't have permission to access the object");
        break;
      case 'storage/canceled':
        console.log("User canceled the upload");
        break;
      case 'storage/unknown':
        console.log("Unknown error occurred, inspect the server response");
        break;
    }
  });

  }

  useEffect(()=>{
    try{
      getPostPic();
    }
    catch(error){
      console.log(error);
    }
  }, [] );


  return (<div >
    <img src={postUrl} style={{width:'100%', backgroundColor:'black', marginBottom:"-1.7%"}}/>
  </div>);
}

export default GridImg;