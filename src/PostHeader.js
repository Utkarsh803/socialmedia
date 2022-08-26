import './css/PostHeader.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart, AiOutlineNotification } from 'react-icons/ai';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, serverTimestamp, getDoc} from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';

function PostHeader({name, url, postid, authorId}) {

    const[option, SetOption]=useState(false);
    const[reported, SetReported]=useState(false);
    
    function handleButtonOptiont() {
        SetOption(!option);
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
    sx={{ width: 40, height: 40, marginTop:'2%'}}
    />
    <h4 className='welcome'>{name}</h4>
    <BiDotsVerticalRounded className='icons'  onClick={handleButtonOptiont}/>
    {option && (
    <div className="dropdown">
      <ul>
        <button className='selection' onClick={handleButtonNotInterested}> Not Interested</button>
        {reported ? (<button className='selection'> Reported</button>):(<button className='selection'onClick={handleButtonReport}> Report</button>)}
      </ul>
    </div>
  )}

  
  </div>);
}

export default PostHeader;