import './css/PostHeader.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart, AiOutlineNotification,AiOutlineCloseCircle } from 'react-icons/ai';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, serverTimestamp, getDoc} from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import React, {useRef} from 'react';
import { runTransaction } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function PostHeader({name, url, postid, authorId, typ, tags}) {

    const[option, SetOption]=useState(false);
    const[reported, SetReported]=useState(false);
    const[horizontal, SetHorizontal]=useState("horizontal");
    const[vertical, SetVertical]=useState("vertical");
    const[edit, SetEdit]=useState(false);
    const[caption, SetCaption]=useState(null);
    const[commentStatus, SetCommentStatus]=useState(false);

    
    const optionRef = useRef();
    const optionRefH = useRef();
    let navigate = useNavigate(); 

    useEffect(()=>{
      let handler = (event)=>{
        if(!optionRef.current.contains(event.target)){
        SetOption(false);}
      }

      let handler2 = (event)=>{
        if(!optionRefH.current.contains(event.target)){
        SetOption(false);}
      }
  
      document.addEventListener("mousedown", handler);
      document.addEventListener("mousedown", handler2);

      const getCommentsStatus=async()=>{
        const docRef = doc(db, `users/${authorId}/posts/`, `${postid}`);
        const docSnap = await getDoc(docRef);
        SetCommentStatus(docSnap.data().allowComments);  
      }

      const getReported=async()=>{
        const feedRef = doc(db, `feed/${auth.currentUser.uid}/posts`, `${postid}`)
        const docRef = await getDoc(feedRef);
        SetReported(docRef.data().reported ? (docRef.data().reported):(false));
      }
      
      getCommentsStatus();
      getReported();
      return()=>{
        document.removeEventListener("mousedown", handler)
        document.removeEventListener("mousedown", handler2)
      }
    }, [])

    function handleButtonOptiont() {
        SetOption(true);
      }


      const handleButtonNotInterested=async()=>{
        try{
          await runTransaction(db, async (transaction) => { 
        const feedRef = doc(db, `feed/${auth.currentUser.uid}/posts`, `${postid}`)
        transaction.delete(feedRef);
        
          });}
          catch(e){
            console.log(e.message);
          }
      }

      const goToProfile=()=>{
        navigate(`/profile/${authorId}`);
      }
    

      const handleButtonReport=async()=>{
        try{
        await runTransaction(db, async (transaction) => { 
        const reportRef = collection(db, `reported`)
        const docRef = doc(db, `users/${authorId}/posts`, `${postid}`)
        const dRef = await transaction.get(docRef);

        const feedRef = doc(db, `feed/${auth.currentUser.uid}/posts`, `${postid}`)

        transaction.update(feedRef, {reported:true});

        transaction.set(doc(reportRef), {
          postid:postid,
          authorId:authorId,
          reportedBy:auth.currentUser.uid,
          createdAt:serverTimestamp(),
        })



       if(dRef.exists()){
        transaction.update(docRef, {reported : dRef.data().reported + 1})
       }
       
      })
      SetReported(true);
    }
      catch(e){
        console.log(e.message);
      }
      }

const handleButtonNext=async()=>{
  try{
    await runTransaction(db, async (transaction) => {
    const docRef = doc(db, `users/${authorId}/posts/`, `${postid}`)
    transaction.update(docRef, {caption:caption});
  
    const oldHashtagArray = tags;
    var hashtagArray = caption.match(/#[\p{L}]+/ugi);
   


    const added =  hashtagArray.filter(x => !oldHashtagArray.includes(x))
    const subbed =  oldHashtagArray.filter(x => !hashtagArray.includes(x))



      
  });
 
  SetEdit(false);
  SetCaption(null);
  }  
  catch(e){
    console.log(e.message);
  }
} 

const handleButtonClose=async()=>{
  SetCaption(null);
  SetEdit(!edit);
} 
    
const editPost=()=>{
  SetEdit(!edit);
}

  const turnOffComments=async()=>{
  try{
    await runTransaction(db, async (transaction) => {
    const docRef = doc(db, `users/${authorId}/posts/`, `${postid}`)
    transaction.update(docRef, {allowComments:false});
  });
  
  SetOption(false);
  SetCommentStatus(false);
  }  
  catch(e){
    console.log(e.message);
  }
} 


const turnOnComments=async()=>{
  try{
    await runTransaction(db, async (transaction) => {
    const docRef = doc(db, `users/${authorId}/posts/`, `${postid}`)
    transaction.update(docRef, {allowComments:true});
  });

  SetOption(false);
  SetCommentStatus(true);
  }  
  catch(e){
    console.log(e.message);
  }
} 


const deletePost=async()=>{
  SetOption(false);
  try{
    await runTransaction(db, async (transaction) => {
    const docRef = doc(db, `users/${authorId}/posts/`, `${postid}`)
    const saveDocGet = await transaction.get(docRef);
    const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
    const docSnap= await transaction.get(followingdocRef);
    const postsNum= docSnap.data().posts;
    const hashtagArray = saveDocGet.data().tags;



    const feedRef = collection(db, `users/${authorId}/feedRef/${postid}/nodes`);
    const feedSnap = await getDocs(feedRef);
    const saveRef = collection(db, `users/${authorId}/saveRef/${postid}/nodes`);
    const saveSnap = await getDocs(saveRef);

    var arr=[];

    if(hashtagArray!==0){
    for(const hash of hashtagArray){
      const hashRef= doc(db, "hashtags", `${hash}`);
      const hashVal = await transaction.get(hashRef);
      arr.push({hashVal:hashVal, hashRef:hashRef, hash:hash});
    }}

  

      const pid = authorId + postid;

      var a = 0;
      if(hashtagArray!==0){
      for(const hashVal of arr ){
      transaction.update(arr[a].hashRef, {val:(arr[a].hashVal).data().val-1});
      transaction.delete(doc(db, `hashtags/${arr[a].hash}/posts`, `${pid}`))
     
      a=a+1;
    }}

  
   
    transaction.update(docRef, {deleted:true});
    const newfield1 = {posts: postsNum - 1};
    transaction.update(followingdocRef,newfield1);
     
  feedSnap.forEach((docc)=>{
  transaction.delete(doc(db, `feed/${docc.id}/posts`, `${postid}`));
  });
 

  transaction.delete(doc(db, `users/${authorId}/feedRef`, `${postid}`));

  var b = 0;
  saveSnap.forEach((docc)=>{
    transaction.delete(doc(db, `users/${docc.id}/savedPosts`, `${postid}`));
    b = b+1;
    });


  transaction.delete(doc(db, `users/${authorId}/saveRef`, `${postid}`));

  transaction.update(docRef, {saved:saveDocGet.data().saved-b});
 
  });
 
  SetOption(false);
  }  
  catch(e){
    console.log(e.message);
  }
} 

const archivePost=async()=>{
  try{
    await runTransaction(db, async (transaction) => {
    const docRef = doc(db, `users/${authorId}/posts/`, `${postid}`)
    transaction.update(docRef, {archived:true});
  });
 
  SetOption(false);
  }  
  catch(e){
    console.log(e.message);
  }
} 
    

  return (<div className="PostHeader">

{edit&& (   
 <div class="uploadtrayP">
  <AiOutlineCloseCircle onClick={handleButtonClose} style={{marginLeft:'auto',marginRight:'5%', height:'50px'}} className="closeButton"></AiOutlineCloseCircle>  
<div className='flex-column'>
<textarea placeholder='Type yor caption...' className='captionInput' onChange={(event)=>{SetCaption(event.target.value)}}>
</textarea>
  </div>
  <button className="uploadImage" style={{width:'90%', marginLeft:'5%'}} onClick={handleButtonNext}>Post</button>
</div>
  )}
 
    <Avatar
    alt="preview image"
    src={url}
    sx={{ width: 40, height: 40, marginTop:'2%', cursor:'pointer'}}
    onClick={goToProfile}
    />
    <h4 className='welcome' onClick={goToProfile}>{name}</h4>
    <BiDotsVerticalRounded className='icons'  onClick={handleButtonOptiont}/>

    {option && typ===vertical && auth.currentUser.uid!=authorId &&(
    <div className="dropdown" ref={optionRef}>
      <ul className="ulV">
        <button className='selection' onClick={handleButtonNotInterested}> Not Interested</button>
        {reported ? (<button className='selection'> Reported</button>):(<button className='selection'onClick={handleButtonReport}> Report</button>)}
      </ul>
    </div>
  )}


{option && typ===horizontal && auth.currentUser.uid!=authorId &&(
    <div className="dropdownH" ref={optionRefH} >
      <ul className="ulH" >
        <button className='selection' onClick={handleButtonNotInterested}> Not Interested</button>
        {reported ? (<button className='selection'> Reported</button>):(<button className='selection'onClick={handleButtonReport}> Report</button>)}
      </ul>
    </div>
  )}

{option && typ===horizontal && auth.currentUser.uid==authorId &&(
    <div className="dropdownH" ref={optionRefH} >
      <ul className="ulH">
      {commentStatus ?
        (<button className='selection'  onClick={turnOffComments}>Turn off Comments</button>):
        (<button className='selection'  onClick={turnOnComments}>Turn on Comments</button>)}
        <button className='selection' onClick={deletePost}>delete</button>
      </ul>
    </div>
  )}

  
  </div>);
}

export default PostHeader;