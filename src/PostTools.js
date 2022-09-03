import './css/PostTools.css';
import {useState, useEffect } from "react";
import { AiOutlineHeart,AiFillHeart,AiOutlineCloseCircle} from 'react-icons/ai';
import { FaRegComment, FaRegBookmark, FaBookmark} from 'react-icons/fa';
import { IoMdShareAlt} from 'react-icons/io';
import { addNotification } from './App';
import React, {useRef} from 'react';
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc,serverTimestamp, Timestamp} from 'firebase/firestore';
import { type } from '@testing-library/user-event/dist/type';
import Comment from './Comment';
import createTree from './createTree';
import Avatar from '@mui/material/Avatar';
import { width } from '@mui/system';
import { runTransaction } from "firebase/firestore";

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

const commentRef = useRef();

useEffect(()=>{

    let handler = (event)=>{
      if(!commentRef.current.contains(event.target)){
      setCommentBox(false);}
    }

    document.addEventListener("mousedown", handler);

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


getCommentNum();
getComments();
getLike();
getSave();

return()=>{
  document.removeEventListener("mousedown", handler)
}

}, [postid, authorId] );





const incCommentNum=async()=>{
  try{
  await runTransaction(db, async (transaction) => { 
  const comRef = doc(db, `users/${authorId}/comments`, `${postid}`)
  const newfield={totalComments:totalComments+1};
  const data = updateDoc(comRef, newfield);
  console.log("total counts updated");
    });
  }
  catch(e){
    console.log(e.message)
  }
}

const addTotalPostComments=async()=>{
  try
  {  
    await runTransaction(db, async (transaction) => {   

    
        const comRef = doc(db, `users/${authorId}/comments`, `${postid}`)
        const docRef = await transaction.get(comRef) 

        const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
        const docRef1 = await transaction.get(userDoc) 
        
        const newfield={totalComments: docRef.data().totalComments+1};
        transaction.update(comRef, newfield);
        console.log("total counts updated");

    const num=docRef.data().totalComments+1;
     const usersCollectionRef = doc(db, `/users/${authorId}/comments/${postid}/ids`, `${num}`);
     transaction.set(usersCollectionRef,{
       id: docRef.data().totalComments+1,
       parent:null,
       comment: comCaption,
       author:auth.currentUser.uid,
       postAuthor:authorId,
       likes:0,
       postid:postid,
       timeStamp:Timestamp.fromDate(new Date()),
            });      
     // SetTotalComments(totalComments+1);
      console.log("Author ID: "+authorId);
      console.log("Post ID: "+postid);
      console.log("Added a comment");

    
    const newFields1 = {comments: docRef1.data().comments + 1};
    transaction.update(userDoc, newFields1);

    console.log(authorId)
    console.log( auth.currentUser.uid)

    if(authorId != auth.currentUser.uid){
    transaction.set((doc(NotRef)),{
      type:"comment",
      content:"commented on your post.",
      author:auth.currentUser.uid,
      postid:postid,
      timeStamp:Timestamp.fromDate(new Date()),
    })}
          });
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

const handleButtonLike=async()=> {
  setLike(!like);  
    try
    {
      await runTransaction(db, async (transaction) => { 

        const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
        const docslike = await transaction.get(userDoc)

       const usersCollectionRef = doc(db, `/users/${authorId}/likes/${postid}/ids`, `${auth.currentUser.uid}`);
       transaction.set(usersCollectionRef,{
         timeStamp:serverTimestamp()
       });      
        console.log("Author ID: "+authorId);
        console.log("Post ID: "+postid);
        console.log("Added a like");
        if(authorId != auth.currentUser.uid){
           transaction.set(doc(NotRef),{
            type:"like",
            content:"liked your post.",
            author:auth.currentUser.uid,
            postid:postid,
            timeStamp:Timestamp.fromDate(new Date()),
          })
          console.log("Posted a notification about a like.")
         }

         
          const newFields = {likes: docslike.data().likes + 1};
          transaction.update(userDoc, newFields);   
          console.log("Author ID: "+authorId);
          console.log("Post ID: "+postid);
          console.log("updated a like on the post.");
        });
        setLike(true);
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Like was not registered :("); 
       setLike(!like);
   }
  }

const handleButtonUnlike=async()=> {
  setLike(!like);
    try{
      await runTransaction(db, async (transaction) => { 

      const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
      const docslike = await transaction.get(userDoc)

      const usersCollectionRef = doc(db, `/users/${authorId}/likes/${postid}/ids`, `${auth.currentUser.uid}`);
      transaction.delete(usersCollectionRef);      
       console.log("Author ID: "+authorId);
       console.log("Post ID: "+postid);
       console.log("Removed your like");

       const newFields = {likes: docslike.data().likes - 1};
       transaction.update(userDoc, newFields);   
       console.log("Author ID: "+authorId);
       console.log("Post ID: "+postid);
       console.log("updated a like on the post.");

      });
      setLike(false);
    }
    catch(error){
      console.log(error.message);
      console.log("Like was not registered :("); 
      setLike(!like);
    }
  }
  //like->create a notification->store the like notif ref in posst
  //unlike->get post like notif ref->find notif ->delete

  function handleButtonComment() {
    setCommentBox(!commentBox);
  }

  const handleButtonMark=async()=> {
    setMark(true);
    try{
    await runTransaction(db, async (transaction) => { 
    const usersCollectionRef = doc(db, `/users/${auth.currentUser.uid}/savedPosts`,`${postid}`);
    const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
    const docRef = await transaction.get(userDoc)
    transaction.set(usersCollectionRef,{
      authorID: authorId,
      timeStamp:serverTimestamp()
    });      
     console.log("Author ID: "+authorId);
     console.log("Post ID: "+postid);
     console.log("Added to your saved list.");

     transaction.set(doc(db, `users/${authorId}/saveRef/${postid}/nodes`, `${auth.currentUser.uid}`), {
      createdAt:serverTimestamp()
    })

     const newFields = {saved: docRef.data().saved + 1};
     transaction.update(userDoc, newFields);   
     console.log("Author ID: "+authorId);
     console.log("Post ID: "+postid);
     //SetSaveNum(saveNum+1);
  })

  }
  catch(e){
    console.log(e.message)
    setMark(false);
  }
}

  const handleButtonUnmark=async()=> {
    setMark(false);
    try
    {  
      await runTransaction(db, async (transaction) => { 
       const usersCollectionRef = doc(db, `/users/${auth.currentUser.uid}/savedPosts`,`${postid}`);
       const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
       const docRef = await transaction.get(userDoc) 

        transaction.delete(usersCollectionRef);      
        console.log("Author ID: "+authorId);
        console.log("Post ID: "+postid);
        console.log("Removed from saved list.");

        transaction.delete(doc(db, `users/${authorId}/SaveRef/${postid}/nodes`, `${auth.currentUser.uid}`));

        const newFields = {saved: docRef.data().saved - 1};
        transaction.update(userDoc, newFields);   
        console.log("Author ID: "+authorId);
        console.log("Post ID: "+postid);
//        SetSaveNum(saveNum-1);
      });
      setMark(false);
  
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Did not remove from saved list. :("); 
       setMark(true);
   }
  }


return (<div className="PostTools">
    {like ? (<AiFillHeart className='icons' style={{color:'red'}} onClick={handleButtonUnlike}/>):(<AiOutlineHeart className='icons' style={{color:'white'}} onClick={handleButtonLike}/>)}
    <FaRegComment className='icons' onClick={handleButtonComment}/>
    {commentBox && 
      (<div className='commentTray' ref={commentRef}>
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
    <button style={{backgroundColor:'black', width:'15%', textAlign:'left', height:'6vh', marginTop:'0.4%',marginBottom:'0%', color:'deepskyblue',fontSize:'large'}} onClick={addTotalPostComments}>Post</button>
    </div>
      </div>)
    }
    <IoMdShareAlt className='icons'/>
    <div className='space'></div>
    {mark ? (<FaBookmark className='save' onClick={handleButtonUnmark}/>):( <FaRegBookmark className='save' onClick={handleButtonMark}/>)}
  
  </div>);
}

export default PostTools;
