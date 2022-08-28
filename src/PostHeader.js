import './css/PostHeader.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart, AiOutlineNotification } from 'react-icons/ai';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, serverTimestamp, getDoc} from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import React, {useRef} from 'react';

function PostHeader({name, url, postid, authorId, typ}) {

    const[option, SetOption]=useState(false);
    const[reported, SetReported]=useState(false);
    const[horizontal, SetHorizontal]=useState("horizontal");
    const[vertical, SetVertical]=useState("vertical");

    
    const optionRef = useRef();
    const optionRefH = useRef();

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

      return()=>{
        document.removeEventListener("mousedown", handler)
        document.removeEventListener("mousedown", handler2)
      }

    }, [])

    function handleButtonOptiont() {
        SetOption(true);
      }


      const handleButtonNotInterested=async()=>{
        const feedRef = doc(db, `feed/${auth.currentUser.uid}/posts`, `${postid}`)
        await deleteDoc(feedRef);
        console.log("We will not show this post")
      }

      const handleButtonReport=async()=>{
        const reportRef = collection(db, `reported`)
        await addDoc(reportRef, {
          postid:postid,
          authorId:authorId,
          reportedBy:auth.currentUser.uid,
          createdAt:serverTimestamp(),
        })

        const docRef = doc(db, `users/${authorId}/posts`, `${postid}`)
        const dRef = await getDoc(docRef);

       if(dRef.exists()){
        updateDoc(docRef, {reported : dRef.data().reported + 1})
       }
       SetReported(true);
       console.log("post has been reported")
      }
    
    

  return (<div className="PostHeader">
 
    <Avatar
    alt="preview image"
    src={url}
    sx={{ width: 40, height: 40, marginTop:'2%', cursor:'pointer'}}
    />
    <h4 className='welcome'>{name}</h4>
    <BiDotsVerticalRounded className='icons'  onClick={handleButtonOptiont}/>

    {option && typ===vertical && (
    <div className="dropdown" ref={optionRef}>
      <ul>
        <button className='selection' onClick={handleButtonNotInterested}> Not Interested</button>
        {reported ? (<button className='selection'> Reported</button>):(<button className='selection'onClick={handleButtonReport}> Report</button>)}
      </ul>
    </div>
  )}

{option && typ===horizontal && (
    <div className="dropdownH" ref={optionRefH} >
      <ul>
        <button className='selection' onClick={handleButtonNotInterested}> Not Interested</button>
        {reported ? (<button className='selection'> Reported</button>):(<button className='selection'onClick={handleButtonReport}> Report</button>)}
      </ul>
    </div>
  )}

  
  </div>);
}

export default PostHeader;