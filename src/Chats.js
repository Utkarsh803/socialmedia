import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {ChatEngine} from 'react-chat-engine'
import Header from './Header.js'
import './css/Chats.css'
import { db, auth, storage } from './firebase-config.js'
import { collection, query, where, onSnapshot, getDoc, snapshotEqual,addDoc, doc , serverTimestamp, orderBy} from 'firebase/firestore'
import User from './User.js'
import Avatar from '@mui/material/Avatar';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {AiOutlineUpload} from 'react-icons/ai';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage"
import MessageForm from './MessageForm.js'
import { async } from '@firebase/util'
import Attachment from './Attachment.js'
import Message from './Message.js'

const Chats=()=>{

    const [username, SetUsername] = useState(null);
    const [users, SetUsers] = useState([]);
    const [chat, SetChat] = useState("");
    const [chatName, SetChatName] = useState("");
    const [picUrl, SetPicUrl] = useState("");
    const [text, SetText] = useState("");
    const [img, SetImg] = useState("");
    const [msgs, SetMsgs] = useState([]);



    useEffect(()=>{

        const getUsers=async()=>{
        const myRef = doc(db, "users", `${auth.currentUser.uid}`);
        const data = await getDoc(myRef);



        const userRef = collection(db, "users");
        const q = query(userRef, where('username', 'not-in', [data.data().username]));
        const unsub = onSnapshot(q, querySnapshot =>{
            let users = []
            querySnapshot.forEach(doc=>{
                users.push(doc.id)
                console.log("pushed a user", doc.id);
            })
            SetUsers(users);
        })
        return () => unsub();
        }

        getUsers();
    }, [])

    console.log(users);

    const selectUser=(user)=>{
        SetChat(user);
        fetchData(user);
        console.log(user);

        const id = auth.currentUser.uid > user ? `${auth.currentUser.uid +user}` : `${user + auth.currentUser.uid}`

        const msgsRef = collection(db, `messages/${id}/chat`)
        const q = query(msgsRef, orderBy('createdAt', 'asc'))


        onSnapshot(q, querySnapshot=>{
            let msgs= []
            querySnapshot.forEach(doc=>{
                msgs.push(doc.data())
            })
            SetMsgs(msgs);
        })

    };

    console.log(msgs);
    const handleSubmit=async()=>{
        const id = auth.currentUser.uid > chat ? `${auth.currentUser.uid + chat}` : `${chat + auth.currentUser.uid}`


        let url;

        if(img){
            const imgRef = ref(storage, `images/${new Date().getTime()}-${img.name}`);
            const snap = await uploadBytes(imgRef, img);
            const dUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
            url = dUrl;
        }
        await addDoc(collection(db, `messages/${id}/chat`),
        {
            text,
            from:auth.currentUser.uid,
            to:chat,
            createdAt: serverTimestamp(),
            media:url||" ",
        });
            console.log("Chat posted.");
            SetText("");
    }

    const fetchData=async(user)=>{
            const userRef = doc(db, "users", `${user}`)
            const data = await getDoc(userRef);
            SetChatName(data.data().username);

            getDownloadURL(ref(storage, `${user}/${data.data().profilePic}`))
            .then((url) => {
              SetPicUrl(url);
            })
            .catch((error) => {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/object-not-found':
                  console.log("File doesn't exist");
                  break;
                case 'storage/unauthorized':
                  console.log("User doesn't have permission to access the object");
                  break;
                case 'storage/canceled':
                  console.log("User canceled the upload");
                  break;
                case 'storage/unknown':
                  console.log("Unknown error occurred, inspect the server response");
                  break;
              }
            });
    }

    return (
    <div className="Chats">
    <nav>
    <div className='divider'>
    <div>
    <Header></Header>
    </div>
    <div style={{display:'flex', flexDirection:'row', width:'100%',  border:'1px solid grey'}}>
    <div style={{width:'30%', border:'1px solid grey', height:'100%', overflow:'scroll'}}>
    <div className='chatDrawer'>
        {users.map(user => <User user={user} selectUser={selectUser}/>)}
    </div>
    </div> 

{chat && (
    <div style={{minHeight:'80vh', width:'70%'}}>
    <div style={{minHeight:'70vh'}}>
    <div style={{position:'relative',  display:'flex',flexDirection:'row',height:'fit-content', width:'100%',border:'1px solid grey'}}>
    <div style={{padding:'1%'}}>
    <Avatar  src={picUrl} sx={{ width: 40, height: 40, marginTop:'2%'}}></Avatar>
    </div>
    <div style={{marginLeft:'1%',paddingTop:'1.8%',fontSize:'x-large',paddingRight:'70%'}}>{chatName}</div>
   <div style={{width:'10%'}}>
    <BiDotsVerticalRounded style={{height:'100%', width:'40%', float:'right'}}/>
    </div>
    </div>   
    <div className='messages'>
        {msgs.length ? (msgs.map((msg, i)=><Message key ={i} msg={msg}/>)):null}

    </div>
    </div>
    <div style={{position:'relative',width:'100%', height:'10%', marginTop:'1%', display:'flex',flexDirection:'row'}}>
        <div style={{width:'fit-content', padding:'1%'}}>
        <input type="file" id="file" style={{display: "none"}}
         onChange={(e) => SetImg(e.target.files[0])}/>
         <label htmlFor="file" >
         <Attachment/>
         </label>
            </div>
        <div style={{position:'relative',displey:'flex', flexDirection:'row', width:'80%'}}>
        <input placeholder="Message...." style={{position:'relative',height:'100%', width:'100%', color:'white', paddingLeft:'2%', paddingRight:'2%', fontSize:'large'}} onChange={(event)=>{SetText(event.target.value)}}></input>
        </div>
        <div style={{position:'relative',width:'10%', height:'110%',bottom:'5%'}}>
        <button style={{position:'relative',height:'100%', width:'90%', marginLeft:'10%'}} onClick={handleSubmit}>Post</button>
        </div>
    </div>
    </div>
)}

    
    </div>
    </div>
    </nav>
    </div>
    )
}

export default Chats;