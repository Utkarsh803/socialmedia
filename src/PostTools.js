import './css/PostTools.css';
import {useState, useEffect } from "react";
import { AiOutlineHeart,AiFillHeart,AiOutlineCloseCircle} from 'react-icons/ai';
import { FaRegComment, FaRegBookmark, FaBookmark} from 'react-icons/fa';
import { IoMdShareAlt} from 'react-icons/io';
import { addNotification } from './App';

import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc,serverTimestamp, Timestamp} from 'firebase/firestore';
import { type } from '@testing-library/user-event/dist/type';
import Comment from './Comment';
import createTree from './createTree';
import Avatar from '@mui/material/Avatar';
import { width } from '@mui/system';

function PostTools({postid, authorId, likes, saves, profilePic}) {

const[like, setLike]=useState(false);
const[mark, setMark]=useState(false);
const[commentBox, setCommentBox]=useState(false);
const[comCaption, SetComCaption]=useState(false);
const[comment, SetComment]=useState(null);
const[totalComments, SetTotalComments]=useState(null);
const NotRef = collection(db, `users/${authorId}/notifications`);
const[commentTree, SetCommentTree]=useState(null);
const[saveNum, SetSaveNum]=useState(saves);



useEffect(()=>{
  const getLike = async () => {

    const docRef = doc(db, `/users/${authorId}/likes/${postid}/ids`, `${auth.currentUser.uid}`);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setLike(true);
      console.log("You have not liked this post.");
    } else {
      setLike(false);
      // doc.data() will be undefined in this case
      console.log("You have not liked this post.");
    }
};

const getSave = async () => {

  const docRef = doc(db, `/users/${auth.currentUser.uid}/savedPosts`,`${postid}`);

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    setMark(true);
    console.log("You have not liked this post.");
  } else {
    setMark(false);
    // doc.data() will be undefined in this case
    console.log("You have not liked this post.");
  }
};
getCommentNum();
getComments();
getLike();
getSave();
}, [] );

const getComments=async()=>{
  const comRef = collection(db, `users/${authorId}/comments/${postid}/ids`)
  const data = await getDocs(comRef)
  SetCommentTree(createTree(data.docs.map((doc)=>({...doc.data()}))));
  console.log("got comments");
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

const addTotalPostComments=async()=>{
  try
  {  
     incCommentNum();
     const usersCollectionRef = collection(db, `/users/${authorId}/comments/${postid}/ids`);
     await addDoc(usersCollectionRef,{
       id: totalComments+1,
       parent:null,
       comment: comCaption,
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
    const newFields = {comments: totalComments + 1};
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




const addToPostLikes=async()=>{
try{
  const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
  const newFields = {likes: likes + 1};
  await updateDoc(userDoc, newFields);   
  console.log("Author ID: "+authorId);
  console.log("Post ID: "+postid);
  console.log("updated a like on the post.");
}
catch(error){
  console.log(error);
}
}

const subToPostLikes=async()=>{
  try{
    const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
    const newFields = {likes: likes - 1};
    await updateDoc(userDoc, newFields);   
    console.log("Author ID: "+authorId);
    console.log("Post ID: "+postid);
    console.log("updated a like on the post.");
  }
  catch(error){
    console.log(error);
  }
  }

  const addToPostSaves=async()=>{
    try{
      const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
      const newFields = {saved: saveNum + 1};
      await updateDoc(userDoc, newFields);   
      console.log("Author ID: "+authorId);
      console.log("Post ID: "+postid);
      SetSaveNum(saveNum+1);
    }
    catch(error){
      console.log(error);
    }
    }
    
    const subToPostSaves=async()=>{
      try{
        const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
        const newFields = {saved: saveNum - 1};
        await updateDoc(userDoc, newFields);   
        console.log("Author ID: "+authorId);
        console.log("Post ID: "+postid);
        SetSaveNum(saveNum-1);

      }
      catch(error){
        console.log(error);
      }
      }





const addTotalPostLikes=async()=>{
    try
    {  
       const usersCollectionRef = doc(db, `/users/${authorId}/likes/${postid}/ids`, `${auth.currentUser.uid}`);
       await setDoc(usersCollectionRef,{
         timeStamp:serverTimestamp()
       });      
        console.log("Author ID: "+authorId);
        console.log("Post ID: "+postid);
        console.log("Added a like");
        if(authorId != auth.currentUser.uid){
           await addDoc(NotRef,{
            type:"like",
            content:"liked your post.",
            author:auth.currentUser.uid,
            postid:postid,
            timeStamp:Timestamp.fromDate(new Date()),
          })
          console.log("Posted a notification about a like.")
         }
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Like was not registered :("); 
   }
 
}

const addTotalPostSaves=async()=>{
  try
  {  
     const usersCollectionRef = doc(db, `/users/${auth.currentUser.uid}/savedPosts`,`${postid}`);
     await setDoc(usersCollectionRef,{
       authorID: authorId,
       timeStamp:serverTimestamp()
     });      
      console.log("Author ID: "+authorId);
      console.log("Post ID: "+postid);
      console.log("Added to your saved list.");

       } 
 catch(error)
 {
     console.log(error.message);
     console.log("Save was not registered :("); 
 }

}

const subTotalPostSaves=async()=>{
  try
  {  
     const usersCollectionRef = doc(db, `/users/${auth.currentUser.uid}/savedPosts`,`${postid}`);
      await deleteDoc(usersCollectionRef);      
      console.log("Author ID: "+authorId);
      console.log("Post ID: "+postid);
      console.log("Removed from saved list.");

       } 
 catch(error)
 {
     console.log(error.message);
     console.log("Did not remove from saved list. :("); 
 }

}

const subTotalPostLikes=async()=>{
  try
  {  
     const usersCollectionRef = doc(db, `/users/${authorId}/likes/${postid}/ids`, `${auth.currentUser.uid}`);
     await deleteDoc(usersCollectionRef);      
      console.log("Author ID: "+authorId);
      console.log("Post ID: "+postid);
      console.log("Removed your like");
       } 
 catch(error)
 {
     console.log(error.message);
     console.log("Like was not registered :("); 
 }

}

function handleButtonLike() {
    setLike(!like);
    addTotalPostLikes();
    addToPostLikes();
  }

function handleButtonUnlike() {
    setLike(!like);
    subTotalPostLikes();
    subToPostLikes();
  }
  //like->create a notification->store the like notif ref in posst
  //unlike->get post like notif ref->find notif ->delete

  function handleButtonComment() {
    setCommentBox(!commentBox);
  }

  function handleButtonMark() {
    setMark(!mark);
    addTotalPostSaves();
    addToPostSaves();
  }

  function handleButtonUnmark() {
    setMark(!mark);
    subTotalPostSaves();
    subToPostSaves();
  }


return (<div className="PostTools">
    {like ? (<AiFillHeart className='icons' style={{color:'red'}} onClick={handleButtonUnlike}/>):(<AiOutlineHeart className='icons' style={{color:'white'}} onClick={handleButtonLike}/>)}
    <FaRegComment className='icons' onClick={handleButtonComment}/>
    {commentBox && 
      (<div className='commentTray'>
        <div className='comments'>
          <div style={{height:'auto',width:'fit-content',marginLeft:'auto', marginRight:'2%'}} onClick={()=>{setCommentBox(!commentBox)}}>
        <AiOutlineCloseCircle></AiOutlineCloseCircle>
        </div>
          {commentTree && 
      (commentTree.map((comment) => 
        {
          return <Comment key={comment.id} comment={comment}></Comment>
        }
      )
    )}
        </div>
        <div style={{display:'flex', flexDirection:'row', backgroundColor:'black', height:'9vh', borderRadius:'2%'}}>
<Avatar
    alt="preview image"
    src={profilePic}
    sx={{ width: 25, height: 25, marginTop:'1%', marginLeft:'3%'}}
    />
    <input placeholder='Add a comment....' style={{backgroundColor:'black', width:'80%',borderTop:'none',borderLeft:'none',borderRight:'none', borderBottom:'1px solid white', paddingLeft:'2%', height:'6vh', color:'white',marginBottom:'0%' }} onChange={(event)=>{SetComCaption(event.target.value)}}>
    </input>
    <button style={{backgroundColor:'black', width:'15%', textAlign:'left', height:'6vh', marginTop:'0.4%',marginBottom:'0%', color:'deepskyblue',fontSize:'large'}} onClick={addComment}>Post</button>
    </div>
      </div>)
    }
    <IoMdShareAlt className='icons'/>
    <div className='space'></div>
    {mark ? (<FaBookmark className='save' onClick={handleButtonUnmark}/>):( <FaRegBookmark className='save' onClick={handleButtonMark}/>)}
  
  </div>);
}

export default PostTools;
