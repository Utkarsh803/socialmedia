import './css/PostTools.css';
import {useState, useEffect } from "react";
import { AiOutlineHeart,AiFillHeart} from 'react-icons/ai';
import { FaRegComment, FaRegBookmark, FaBookmark} from 'react-icons/fa';
import { IoMdShareAlt} from 'react-icons/io';

import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';


function PostTools({handleLogout, name}) {

const[save, setSave]=useState(false);
const[mark, setMark]=useState(false);



function handleButtonSave() {
    setSave(!save);
  }

  function handleButtonMark() {
    setMark(!mark);
  }

return (<div className="PostTools">
    
    {save ? (<AiFillHeart className='icons' onClick={handleButtonSave}/>):(<AiOutlineHeart className='icons' onClick={handleButtonSave}/>)}

    <FaRegComment className='icons'/>
    <IoMdShareAlt className='icons'/>
    <div className='space'></div>

    {mark ? (<FaBookmark className='save' onClick={handleButtonMark}/>):( <FaRegBookmark className='save' onClick={handleButtonMark}/>)}
    
  
  </div>);
}

export default PostTools;
