
import logo from './mslogo.jpg';
import PostHeader from './PostHeader';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';
import PostTools from './PostTools';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import * as ReactBootstrap from 'react-bootstrap'

function GridImg({postid, name, authorId, captions, comments, likes, timestamp, url}) {

  const[postUrl, SetPostUrl]=useState(null);
  const[loading, SetLoading]= useState(true);
  
  const getPostPic= async()=>{
  getDownloadURL(ref(storage, `${authorId}/${url}`))
  .then((url) => {
    SetPostUrl(url);
    SetLoading(false);
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
    SetLoading(false);
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


  return (<div style={{width:'100%', height:'100%'}} >
      {!loading ?
  (<img src={postUrl} style={{width:'100%', height:'100%', backgroundColor:'#666', marginBottom:"-1.7%"}}/>):
  (<ReactBootstrap.Spinner animation="border" style={{marginTop:'45%', marginLeft:'48%'}}/>)}
  </div>);
}

export default GridImg;