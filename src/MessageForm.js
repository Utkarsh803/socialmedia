import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {ChatEngine} from 'react-chat-engine'
import Header from './Header.js'
import './css/Chats.css'
import { db, auth, storage } from './firebase-config.js'
import { collection, query, where, onSnapshot, getDoc, snapshotEqual, doc } from 'firebase/firestore'
import User from './User.js'
import Avatar from '@mui/material/Avatar';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"

const MessageForm=(handleSubmit, text, setText)=>{
return(
    <form className='message_form'>

    </form>
)
}

export default MessageForm;