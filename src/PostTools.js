import './css/PostTools.css';
import {useState, useEffect } from "react";
import { AiOutlineHeart,AiFillHeart} from 'react-icons/ai';
import { FaRegComment, FaRegBookmark, FaBookmark} from 'react-icons/fa';
import { IoMdShareAlt} from 'react-icons/io';

import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, serverTimestamp} from 'firebase/firestore';


function PostTools({postid, authorId, likes}) {

const[save, setSave]=useState(false);
const[mark, setMark]=useState(false);



const addToPostLikes=async()=>{
  const userDoc = doc(db, `/users/${authorId}/posts`, {postid});
  const newFields = {likes: likes + 1};
  await updateDoc(userDoc, newFields);   
}

const addTotalPostLikes=async()=>{
    try
    {  
       const usersCollectionRef = doc(db, `/users/${authorId}/likes/${postid}/ids`, `${auth.currentUser.uid}`);
       await setDoc(usersCollectionRef,{
         timeStamp:serverTimestamp()
       });      
        console.log("Added a like!");   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Like was not registered :("); 
   }
 
}


function handleButtonSave() {
    setSave(!save);
    addTotalPostLikes();
    addToPostLikes();
  }

  function handleButtonComment() {
    setSave(!save);
    ;

  }

  function handleButtonMark() {
    setMark(!mark);
    
  }

return (<div className="PostTools">
    {save ? (<AiFillHeart className='icons' onClick={handleButtonSave}/>):(<AiOutlineHeart className='icons' onClick={handleButtonSave}/>)}
    <FaRegComment className='icons' onClick={handleButtonComment}/>
    <IoMdShareAlt className='icons'/>
    <div className='space'></div>

    {mark ? (<FaBookmark className='save' onClick={handleButtonMark}/>):( <FaRegBookmark className='save' onClick={handleButtonMark}/>)}
    
  
  </div>);
}

export default PostTools;
