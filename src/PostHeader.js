import './css/PostHeader.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart, AiOutlineNotification } from 'react-icons/ai';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';

function PostHeader({name, url}) {

    const[option, SetOption]=useState(false);
    
    function handleButtonOptiont() {
        SetOption(!option);
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
    <div class="dropdown">
      <ul>
        <button className='selection'> Not Interested</button>
        <button className='selection'> Report</button>
      </ul>
    </div>
  )}

  
  </div>);
}

export default PostHeader;