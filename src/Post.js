import './css/Post.css';
import logo from './mslogo.jpg';
import PostHeader from './PostHeader';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';
import PostTools from './PostTools';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import moment from 'react-moment'
import {BiDotsVerticalRounded } from 'react-icons/bi';
import Avatar from '@mui/material/Avatar';









function Post({postid, name, authorId, captions, comments, likes, saves, timeStamp, url, profilePic}) {

  const[postUrl, SetPostUrl]=useState(null);;

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


  return (<div className="Post">
    <nav>
    <PostHeader name = {name} url={profilePic}></PostHeader>
    <img  style={{backgroundColor:'black', marginBottom:'-2%'}} src={postUrl} className="media" />
    <PostTools postid={postid} authorId={authorId} likes={likes} saves={saves}></PostTools>
    <div style={{backgroundColor:'black', color:'white', paddingTop:'3%', paddingLeft:'2%', textAlign:'left', fontStyle:'normal'}}>Liked by Utkarsh and others</div>
    <div className='caption'>
    <span style={{fontWeight:'bold', backgroundColor:'black', paddingBottom:'1%', marginRight:'1%'}}>{name} {'  '} </span><span style={{fontWeight:'normal', backgroundColor:'black', paddingBottom:'1%', width:'90%'}}>
{captions}
    </span>
    </div>

    {(comments > 2 && comments > 0) &&
    <div style={{backgroundColor:'black', color:'grey', paddingLeft:'3%', paddingTop:'2%', paddingBottom:'1%'}}>View {comments} comments</div>}
    
    {(comments < 2 ) && (
     <div>
     <div style={{backgroundColor:'black', color:'grey', paddingLeft:'3%', paddingTop:'2%', paddingBottom:'1%'}}>{comments} comments</div>    </div>
    )
    }

<div style={{display:'flex', flexDirection:'row', backgroundColor:'black', height:'9vh'}}>
<Avatar
    alt="preview image"
    src={profilePic}
    sx={{ width: 25, height: 25, marginTop:'1%', marginLeft:'3%'}}
    />
    <input placeholder='Add a comment....' style={{backgroundColor:'black', width:'80%',borderTop:'none',borderLeft:'none',borderRight:'none', borderBottom:'1px solid white', paddingLeft:'2%', height:'6vh', color:'white' }}>
    </input>
    <button style={{backgroundColor:'black', width:'15%', textAlign:'left', height:'6vh', marginTop:'0.4%', color:'deepskyblue',fontSize:'large'}}>Post</button>
    </div>
    <div style={{color:'grey',backgroundColor:'black',paddingLeft:'3%', fontSize:'small'}}></div>
    <div className='footer'></div>
    </nav>
  </div>);
}

export default Post;
