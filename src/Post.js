import './css/Post.css';
import logo from './mslogo.jpg';
import createTree from './createTree';
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



function Post({postid, name, authorId, captions, comments, likes, saves, timeStamp, url, profilePic}) {
  const NotRef = collection(db, `users/${authorId}/notifications`);
  const[commentTree, SetCommentTree]=useState(null);
  const[postUrl, SetPostUrl]=useState(null);
  const[profilePicUrl, SetProfilePicUrl]=useState(null);
  const[comment, SetComment]=useState(null);
  const[commentss, SetComments]=useState(null);
  const[totalComments, SetTotalComments]=useState(null);


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

  const getComments=async()=>{
    const comRef = collection(db, `users/${authorId}/comments/${postid}/ids`)
    const q = query(comRef,orderBy('timeStamp', 'desc'))
    onSnapshot(q, querySnapshot=>{
      SetCommentTree(createTree(querySnapshot.docs.map((doc)=>({...doc.data()}))));
    })
  }

  const getCommentNum=async()=>{
    const comRef = doc(db, `users/${authorId}/comments/`, `${postid}`)
    const data = await getDoc(comRef);

    if(data.exists()){
      SetTotalComments(data.data().totalComments);
      console.log("There are"+data.data().totalComments+"comments on this post");
    }
    else{
      SetTotalComments(null);
  }
  }

  const incCommentNum=async()=>{
    const comRef = doc(db, `users/${authorId}/comments`, `${postid}`)
    const newfield={totalComments:totalComments+1};
    const data = updateDoc(comRef, newfield);

    console.log("total counts updated");
  }

  useEffect(()=>{
    try{
        getComments();
        getPostPic();
        getCommentNum();
        getMyPic();
      }
    catch(error){
      console.log(error);
    }
  }, [] );

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
       postid:postid,
       timeStamp:Timestamp.fromDate(new Date()),
     });      
      SetTotalComments(totalComments+1);
      console.log("Author ID: "+authorId);
      console.log("Post ID: "+postid);
      console.log("Added a comment");
       } 
 catch(error)
 {
     console.log(error.message);
     console.log("Comment was not registered :("); 
 }
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
      addTotalPostComments();
      addToPostComments();
      console.log(authorId)
      console.log( auth.currentUser.uid)
      if(authorId != auth.currentUser.uid){
    await addDoc(NotRef,{
      type:"comment",
      content:"commented on your post.",
      author:auth.currentUser.uid,
      postid:postid,
      timeStamp:Timestamp.fromDate(new Date()),
    })
    console.log("Posted a notification about a comment.")
  }
}

  return (<div className="Post">
    <nav>
    <PostHeader name = {name} url={profilePic}></PostHeader>
    <img  style={{backgroundColor:'black', marginBottom:'-2%'}} src={postUrl} className="media" />
    <PostTools postid={postid} authorId={authorId} likes={likes} saves={saves} profilePic={profilePic}></PostTools>
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
    src={profilePicUrl}
    sx={{ width: 25, height: 25, marginTop:'1%', marginLeft:'3%'}}
    />
    <input placeholder='Add a comment....' style={{backgroundColor:'black', width:'80%',borderTop:'none',borderLeft:'none',borderRight:'none', borderBottom:'1px solid white', paddingLeft:'2%', height:'6vh', color:'white',marginBottom:'0%' }} onChange={(event)=>{SetComment(event.target.value)}}>
    </input>
    <button style={{backgroundColor:'black', width:'15%', textAlign:'left', height:'6vh', marginTop:'0.4%',marginBottom:'0%', color:'deepskyblue',fontSize:'large'}} onClick={addComment}>Post</button>
    </div>


    <div style={{color:'white',backgroundColor:'black',paddingLeft:'3%', fontSize:'small'}}>
    {commentTree && 
    (commentTree.map((comment) => 
      {
        return <Comment key={comment.id} comment={comment}></Comment>
      }
    )
    )}
  </div>
  <div style={{color:'grey',backgroundColor:'black',paddingLeft:'3%', fontSize:'small'}}><Moment fromNow style={{backgroundColor:'transparent'}}>{ timeStamp ? (timeStamp.toDate()):null}</Moment></div>
    <div className='footer'></div>
    </nav>
  </div>);
}

export default Post;
