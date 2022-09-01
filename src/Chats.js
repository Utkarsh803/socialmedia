import React, {useEffect, useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {ChatEngine} from 'react-chat-engine'
import Header from './Header.js'
import './css/Chats.css'
import { db, auth, storage } from './firebase-config.js'
import { collection, query, where, onSnapshot, getDoc, snapshotEqual,addDoc,updateDoc, doc , serverTimestamp, Timestamp, orderBy, setDoc} from 'firebase/firestore'
import User from './User.js'
import Avatar from '@mui/material/Avatar';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {AiOutlineUpload} from 'react-icons/ai';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage"
import MessageForm from './MessageForm.js'
import { async } from '@firebase/util'
import Attachment from './Attachment.js'
import Message from './Message.js'
import { update } from 'firebase/database'

const Chats=()=>{


    const [username, SetUsername] = useState(null);
    const [users, SetUsers] = useState([]);
    const [chat, SetChat] = useState("");
    const [chatName, SetChatName] = useState("");
    const [picUrl, SetPicUrl] = useState("");
    const [text, SetText] = useState("");
    const [img, SetImg] = useState("");
    const [msgs, SetMsgs] = useState([]);
    const [val, setVal] = useState();


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

    const selectUser=async(user)=>{
        SetPicUrl(null);
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

    const docSnap = await getDoc(doc(db, `lastMsg`, id));
    if(docSnap.data() && docSnap.data().from !== auth.currentUser.uid){
        await updateDoc(doc(db, `lastMsg`, id),{
            unread:false
        })
    }

    };

    console.log(msgs);
    const handleSubmit=async()=>{
        if(img!==null && text!==null && text!==""){
        setVal(()=>"");
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
            createdAt: Timestamp.fromDate(new Date()),
            media:url||"",
        });

        await setDoc(doc(db, `lastMsg`, id), {
            text,
            from:auth.currentUser.uid,
            to:chat,
            createdAt: Timestamp.fromDate(new Date()),
            media:url||"",
            unread:true,
        });


            console.log("Chat posted.");
            SetText("");
    }
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
    <Header></Header>
    <div style={{display:'flex', flexDirection:'row', width:'100%',  border:'1px solid grey', paddingTop:'7.9%', height:'100vh'}}>
    <div style={{width:'30%', border:'1px solid grey', overflow:'scroll'}}>
    <div className='chatDrawer'>
        {users.map(user => <User user={user} selectUser={selectUser} user1={auth.currentUser.uid} chat={chat}/>)}
    </div>
    </div> 

{chat && (
    <div style={{height:'80vh', width:'70%'}}>
    <div style={{height:'74vh'}}>
    <div style={{position:'relative',  display:'flex',flexDirection:'row',height:'fit-content', width:'100%',border:'1px solid grey'}}>
    <div style={{padding:'1%'}}>
    <Avatar  src={picUrl} sx={{ width: 40, height: 40, marginTop:'2%'}}></Avatar>
    </div>
    <div style={{marginLeft:'1%',paddingTop:'1.8%',fontSize:'x-large',paddingRight:'70%'}}>{chatName}</div>
   <div style={{width:'10%'}}>
    <BiDotsVerticalRounded style={{height:'100%', width:'40%', float:'right'}}/>
    </div>
    </div>   
    <div style={{maxHeight:'60vh',overflow:'scroll'}}>
        {msgs.length ? (msgs.map((msg, i)=><Message key ={i} msg={msg} user1={chat}/>)):null}

    </div>
    </div>
    <div style={{position:'relative',width:'100%',height:'fit-content',backgroundColor:'transparent', height:'fit-content', display:'flex',flexDirection:'row', marginBottom:'0px'}}>
        <div style={{width:'fit-content', paddingLeft:'1%',paddingTop:'1%',paddingRight:'1%',backgroundColor:'transparent', marginBottom:'0px'}}>
        <input type="file" id="file" style={{display: "none",backgroundColor:'transparent'}}
         onChange={(e) => SetImg(e.target.files[0])}/>
         <label htmlFor="file" >
         <Attachment/>
         </label>
            </div>
        <div style={{position:'relative',display:'flex', flexDirection:'row', width:'85%',backgroundColor:'transparent', marginBottom:'0px'}}>
        <input placeholder="Message...." value={val} style={{position:'relative',height:'100%', width:'100%', color:'white', paddingLeft:'2%', paddingRight:'2%', fontSize:'large', border:'1px solid #333', borderRadius:'5px', backgroundColor:'#333'}} onChange={(event)=>{SetText(event.target.value)}}></input>
        </div>
        <div style={{position:'relative',width:'10%', height:'100%',paddingLeft:'1%',backgroundColor:'transparent',paddingTop:'7px' }}>
        <button style={{position:'relative',height:'100%', width:'92%', border:'1px solid #405cf5', borderRadius:'5px'}} onClick={()=>{handleSubmit()}}>Post</button>
        </div>
    </div>
    </div>
)}

    
    </div>
    
   
    </div>
    )
}

export default Chats;