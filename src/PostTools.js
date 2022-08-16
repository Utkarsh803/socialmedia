import './css/PostTools.css';
import {useState, useEffect } from "react";
import { AiOutlineHeart,AiFillHeart} from 'react-icons/ai';
import { FaRegComment, FaRegBookmark, FaBookmark} from 'react-icons/fa';
import { IoMdShareAlt} from 'react-icons/io';
import { addNotification } from './App';

import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc,serverTimestamp} from 'firebase/firestore';
import { type } from '@testing-library/user-event/dist/type';


function PostTools({postid, authorId, likes, saves}) {

const[like, setLike]=useState(false);
const[mark, setMark]=useState(false);

const NotRef = collection(db, `users/${authorId}/notifications`);





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
getLike();
getSave();
}, [] );


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
      const newFields = {saved: saves + 1};
      await updateDoc(userDoc, newFields);   
      console.log("Author ID: "+authorId);
      console.log("Post ID: "+postid);
    }
    catch(error){
      console.log(error);
    }
    }
    
    const subToPostSaves=async()=>{
      try{
        const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
        const newFields = {saved: saves - 1};
        await updateDoc(userDoc, newFields);   
        console.log("Author ID: "+authorId);
        console.log("Post ID: "+postid);

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
            timeStamp:serverTimestamp(),
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
    //show comments
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
    {like ? (<AiFillHeart className='icons' onClick={handleButtonUnlike}/>):(<AiOutlineHeart className='icons' onClick={handleButtonLike}/>)}
    <FaRegComment className='icons' onClick={handleButtonComment}/>
    <IoMdShareAlt className='icons'/>
    <div className='space'></div>

    {mark ? (<FaBookmark className='save' onClick={handleButtonUnmark}/>):( <FaRegBookmark className='save' onClick={handleButtonMark}/>)}
    
  
  </div>);
}

export default PostTools;
