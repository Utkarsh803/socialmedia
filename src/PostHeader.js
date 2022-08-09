import './css/PostHeader.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart, AiOutlineNotification } from 'react-icons/ai';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import logo from'./mslogo.jpg';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';

function PostHeader({name}) {

    const[option, SetOption]=useState(false);

    function handleButtonOptiont() {
        SetOption(!option);
      }
    

  return (<div className="PostHeader">

    <img src={logo} className="logo" />
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