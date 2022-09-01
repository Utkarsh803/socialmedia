import './css/Header.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart,AiOutlineHome, AiFillSetting, AiOutlineVideoCameraAdd,AiOutlineCloseCircle} from 'react-icons/ai';
import {BiImageAdd, BiMessageRounded, BiHelpCircle} from 'react-icons/bi';
import {FaRegBookmark , FaUserAltSlash}from 'react-icons/fa';
import logo from'./mslogo.jpg';
import {useState, useEffect} from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, getDoc,addDoc, updateDoc, deleteDoc, doc, setDoc, serverTimestamp, Timestamp,onSnapshot} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import Settings from './Settings';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import {v4} from 'uuid'
import { query, where, orderBy, limit } from "firebase/firestore";  
import SearchResult from './SearchResult';
import NotifLike from './NotifLike';
import SearchResultHash from './SearchResHash';
import React, {useRef} from 'react';
import { runTransaction } from "firebase/firestore";
import CropEasy from './crop/CropEasy';
import { Button, DialogActions, DialogContent, Slider, Typography ,Box} from '@mui/material';
import Cropper from 'react-easy-crop';
import { MdCancel } from 'react-icons/md';
import { FaCrop } from 'react-icons/fa';
import getCroppedImg from './crop/utils/CropImage.js';



function LoginHeader({handleLogout, name}) {


  return (<div className="Header">

    <h1 style={{fontSize:'xxx-large', marginLeft:'4%', marginRight:'9%', marginTop:'1.7%'}} className='pointer' >Lyfy</h1>

  </div>);
}

export default LoginHeader;