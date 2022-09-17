import './css/Post.css';

import createTree from './createTree';
import { useNavigate } from "react-router-dom";
import PostHeader from './PostHeader';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, setDoc, serverTimestamp, updateDoc, deleteDoc, doc, getDoc, Timestamp, orderBy, query, onSnapshot} from 'firebase/firestore';
import PostTools from './PostTools';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import {moment} from 'moment'
import {BiDotsVerticalRounded } from 'react-icons/bi';
import Avatar from '@mui/material/Avatar';
import Comment from './Comment';
import Moment from 'react-moment';
import { runTransaction } from "firebase/firestore";
import * as ReactBootstrap from 'react-bootstrap'
import ReactPlayer from "react-player";

//    <div style={{backgroundColor:'black', color:'white', paddingTop:'3%', paddingLeft:'2%', textAlign:'left', fontStyle:'normal'}}>Liked by Utkarsh and others</div>
function Post({postid, name, authorId, captions, comments, likes, saves, timeStamp, url, profilePic, allowComments}) {
  const NotRef = collection(db, `users/${authorId}/notifications`);
  const[commentTree, SetCommentTree]=useState(null);
  const[postUrl, SetPostUrl]=useState(null);
  const[profilePicUrl, SetProfilePicUrl]=useState(null);
  const[comment, SetComment]=useState(null);
  const[commentss, SetComments]=useState(null);
  const[totalComments, SetTotalComments]=useState(null);
  const[loading, SetLoading]= useState(true);
  const[commentLoading, SetCommentLoading]= useState(false);
  const cap = {name}+" "+{captions}

let navigate = useNavigate();
  

  const incCommentNum=async()=>{
    const comRef = doc(db, `users/${authorId}/comments`, `${postid}`)
    const newfield={totalComments:totalComments+1};
    const data = await updateDoc(comRef, newfield);

  
  }


  useEffect(()=>{


      const getCommentNum=async()=>{
        const comRef = doc(db, `users/${authorId}/comments/`, `${postid}`)
        const data = await getDoc(comRef);
    
        if(data.exists()){
          SetTotalComments(data.data().validComments);
        
        }
        else{
          SetTotalComments(null);
      }
      }

      const getComments=async()=>{
        const comRef = collection(db, `users/${authorId}/comments/${postid}/ids`)
        const q = query(comRef,orderBy('timeStamp', 'desc'))
        onSnapshot(q, querySnapshot=>{
          SetCommentTree(createTree(querySnapshot.docs.map((doc)=>({...doc.data()}))));
        })
      }
    
      
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

      
    const getMyPic= async()=>{
      const docRef = doc(db, "users", `${auth.currentUser.uid}`);
      const docSnap = await getDoc(docRef);

      getDownloadURL(ref(storage, `${auth.currentUser.uid}/${docSnap.data().profilePic}`))
      .then((url) => {
        SetProfilePicUrl(url);
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

        SetPostUrl(null)
        getComments();
        getPostPic();
        getCommentNum();
        getMyPic();
  }, [url] );

  const min = 1;
  const max = 100;

  
const addTotalPostComments=async()=>{
  try
  {  
     incCommentNum();
     const usersCollectionRef = collection(db, `/users/${authorId}/comments/${postid}/ids`);
     await addDoc(usersCollectionRef,{
       id: totalComments+1,
       parent:null,
       comment: comment,
       author:auth.currentUser.uid,
       postAuthor:authorId,
       likes:0,
       postid:postid,
       timeStamp:Timestamp.fromDate(new Date()),
     });      
      SetTotalComments(totalComments+1);
 
       } 
 catch(error)
 {
     console.log(error.message);
     console.log("Comment was not registered :("); 
 }
}


function goToProfile(hash) {
  const tag = hash.substring(1, hash.length); 
  navigate(`/profile/${tag}`);
}


const CustomText = (props) => {
  const text = props.text.split(/(\s+)/);
  return <span >{text.map(text => {
    if (text.startsWith('#')) {
      return <span style={{ color: 'lightblue',cursor:'pointer'}} onClick={()=>{goToHash(text)}}>{text} </span>;
    }
    else if(text.startsWith('@')){
      return <span style={{ color: 'lightblue',cursor:'pointer'}} onClick={()=>{goToProfile(text)}}>{text} </span>;
    }
    return `${text} `;
  })}</span>;
}


const addToPostComments=async()=>{
  try{
    const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
    const newFields = {comments: comments + 1};
    await updateDoc(userDoc, newFields);
  }
  catch(error){
    console.log(error);
  }
  }

  const addComment=async()=>{ 
    SetCommentLoading(true);
    document.getElementById('commentInput').value = '';
    try{
      await runTransaction(db, async (transaction) => {   
    
    
      
    const NotRef = collection(db, `users/${authorId}/notifications`);   
   
  
    const comRef = doc(db, `users/${authorId}/comments`, `${postid}`)

    const docRef = await transaction.get(comRef) 

  
    const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);

    const docRef1 = await transaction.get(userDoc) 

   
    const num = docRef.data().totalComments+1;

    const newfield={totalComments:num, validComments:docRef.data().validComments+1};
    transaction.update(comRef, newfield);
  
    const usersCollectionRef = doc(db, `/users/${authorId}/comments/${postid}/ids`, `${num}`);
    transaction.set(usersCollectionRef,{
      id: num,
      parent:null,
      comment: comment,
      author:auth.currentUser.uid,
      postAuthor:authorId,
      likes:0,
      child:0,
      postid:postid,
      timeStamp:Timestamp.fromDate(new Date()),
    });      
    
     
     
    const newFields1 = {comments: docRef1.data().comments + 1};
    transaction.update(userDoc, newFields1);
    
    
    if(authorId != auth.currentUser.uid){
      transaction.set((doc(NotRef)),{
        type:"comment",
        content:"commented on your post.",
        author:auth.currentUser.uid,
        postid:postid,
        timeStamp:Timestamp.fromDate(new Date()),
      })}
      })
      SetTotalComments(totalComments+1);
      SetCommentLoading(false);
  }
  catch(e)
  {
    console.log(e.message)
    SetCommentLoading(false);
  }
  }

  function goToHash(hash) {
    const tag = hash.substring(1, hash.length); 
    
    navigate(`/hashTag/${tag}`);
  }

  return (<div className="Post">
    <nav>
    <div style={{display:'flex', flexDirection:'row', height:'78vh', maxWidth:'100%'}}>
    <div style={{width:'50%', height:'90%'}}>
    <PostHeader name = {name} url={profilePic} postid={postid} authorId={authorId} typ="horizontal"></PostHeader>

    {!loading && !(url.split(".").pop()).startsWith("mp4") && <img  style={{backgroundColor:'black', marginBottom:'-2%'}} src={postUrl} className="media" />}

    {!loading && (url.split(".").pop()).startsWith("mp4") && 
    <ReactPlayer url={postUrl} config={{ file: { 
      attributes: {
        controlsList: 'nodownload'
      }
    }}} width="100%" height="100%" controls={true} autoPlay={true}/>
    }

    {loading && <ReactBootstrap.Spinner animation="border" style={{marginTop:'30%', marginLeft:'48%', marginBottom:'30%'}}/>}
    </div>
    
    
    <div style={{width:'50%', paddingLeft:'2%', height:'auto', maxWidth:'40%', overflow:'scroll'}}>
    <PostTools postid={postid} authorId={authorId} likes={likes} saves={saves} profilePic={profilePic}></PostTools>

    <div className='caption'>
   <p  style={{height:'auto', width:'100%',flex:'1',wordBreak:'break-word'}}>
   <span style={{fontWeight:'bold'}}> {name}</span>{' '}<span><CustomText text={captions}></CustomText></span>
   </p>
  </div>

    <div style={{color:'#888',backgroundColor:'black',paddingLeft:'3%', fontSize:'small'}}><Moment fromNow style={{backgroundColor:'transparent'}}>{ timeStamp ? (timeStamp.toDate()):null}</Moment></div>

    {(totalComments >= 2 && allowComments ) &&
    <div style={{backgroundColor:'black', color:'grey', paddingLeft:'3%', paddingTop:'2%', paddingBottom:'1%'}}>{totalComments} comments</div>}
    
    {(totalComments < 2 ) && allowComments &&(
     <div>
     <div style={{backgroundColor:'black', color:'grey', paddingLeft:'3%', paddingTop:'2%', paddingBottom:'1%'}}>{totalComments} comments</div>    </div>
    )
    }

{allowComments && (
<div style={{color:'white',backgroundColor:'black',paddingLeft:'3%',overflow:'scroll', fontSize:'small', maxHeight:'45vh', marginTop:'0'}}>
    {commentTree && 
    (commentTree.map((comment) => 
      {
        return <Comment key={comment.id} comment={comment}></Comment>
      }
    )
    )}
  </div>)}

  {!allowComments&&(
    <div style={{backgroundColor:'black', color:'#666', paddingTop:'20%', textAlign:'center'}}>Comments are turned off.</div>
  )}

  {allowComments && (
<div style={{position:'absolute',display:'flex', flexDirection:'row', backgroundColor:'black', height:'fit-content', bottom:'8px', width:'40%'}}>
<Avatar
    alt="preview image"
    src={profilePicUrl}
    sx={{ width: 25, height: 25, marginLeft:'3%'}}
    />
    <input id="commentInput" placeholder='Add a comment....' style={{backgroundColor:'black', width:'60%',borderTop:'none',borderLeft:'none',borderRight:'none', borderBottom:'1px solid white', paddingLeft:'2%', height:'6vh', color:'white',marginBottom:'0%' }} onChange={(event)=>{SetComment(event.target.value)}}>
    </input>
    {!commentLoading ?
    (<button disable={commentLoading} style={{backgroundColor:'black', width:'fit-content', textAlign:'left', height:'6vh', color:'deepskyblue',fontSize:'large'}} onClick={addComment}>Post</button>):
    (<button style={{backgroundColor:'black', width:'fit-content', textAlign:'left', height:'6vh', color:'deepskyblue',fontSize:'large'}}><ReactBootstrap.Spinner animation="border" size="sm" style={{color:'#666', alignContent:'center'}}/></button>)}
    </div>)}
  
   
    </div>
    </div>
    </nav>
  </div>);
}

export default Post;
