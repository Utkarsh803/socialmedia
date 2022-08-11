import './css/Post.css';
import logo from './mslogo.jpg';
import PostHeader from './PostHeader';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';
import PostTools from './PostTools';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"


function Post({postid, name, authorId, captions, comments, likes, timeStamp, url, profilePic}) {

  const[postUrl, SetPostUrl]=useState(null);

    const getPostPic= async()=>{
    getDownloadURL(ref(storage, `${auth.currentUser.uid}/${url}`))
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


  return (<div className="Post">
    <nav>
    <PostHeader name = {name} url={profilePic}></PostHeader>
    <img  style={{backgroundColor:'black', marginBottom:'-2%'}} src={postUrl} className="media" />
    <div style={{backgroundColor:'black', color:'white', paddingTop:'3%', paddingLeft:'3%', textAlign:'left', fontStyle:'normal'}}>{likes} likes</div>
    <PostTools></PostTools>
    <div className='caption'>
      <div className='nametag'>{name}{' '}{captions}</div>
    </div>
    <div style={{backgroundColor:'black', color:'grey', paddingLeft:'3%', paddingTop:'2%'}}>View {comments} comments</div>
    <div>{timeStamp}</div>
    <div className='footer'></div>
    </nav>
  </div>);
}

export default Post;
