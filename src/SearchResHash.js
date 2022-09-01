import './css/SearchResult.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart, AiOutlineNotification } from 'react-icons/ai';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, getDoc, deleteDoc, doc, setDoc, serverTimestamp,query, where, Timestamp} from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { Link, useNavigate } from 'react-router-dom';

function SearchResultHash({hash,SetSearchResHash}) {
    
    const navigate = useNavigate();

    const goToHash=(hash)=>{
    const tag = hash.substring(1,hash.length);
    navigate(`/hashTag/${tag}`);
    SetSearchResHash(false);
    }
    

  return (<div className="SearchResult" style={{cursor:'pointer'}} onClick={()=>{goToHash(hash)}}>
    <h4 className='welcome'>{hash}</h4>  
    </div>)

}

export default SearchResultHash;