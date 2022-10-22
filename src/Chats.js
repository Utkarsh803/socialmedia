import React, {useEffect, useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import Header from './Header.js'
import './css/Chats.css'
import { db, auth, storage } from './firebase-config.js'
import { collection, query, where, onSnapshot, getDoc,getDocs, snapshotEqual,addDoc,updateDoc, doc , serverTimestamp, Timestamp, orderBy, setDoc, FieldPath} from 'firebase/firestore'
import User from './User.js'
import Avatar from '@mui/material/Avatar';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {AiOutlineUpload, AiOutlineSearch} from 'react-icons/ai';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage"
import MessageForm from './MessageForm.js'
import { async } from '@firebase/util'
import Attachment from './Attachment.js'
import Message from './Message.js'
import { update } from 'firebase/database'
import * as ReactBootstrap from 'react-bootstrap'
import { minHeight } from '@mui/system'

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
    const[blocked, SetBlocked]= useState(null);
    const[muted, SetMuted]= useState(null);
    const[restricted, SetRestricted]= useState(null);
    const[loading, SetLoading]=useState(true);
    const[searching, SetSearching]=useState(false);
    const [youMayKnow, SetYouMayKnow]= useState([]);


    useEffect(()=>{

        const getUsers=async()=>{
        const myRef = doc(db, "users", `${auth.currentUser.uid}`);
        const data = await getDoc(myRef);

        const userRef = collection(db, `users/${auth.currentUser.uid}/followingList`);
        const q = query(userRef);
        let users = []
        onSnapshot(q, querySnapshot =>{
            querySnapshot.forEach(doc=>{
                users.push(doc.id)
              
            })
         //   SetUsers(users);
        })

        const userRef2 = collection(db, `users/${auth.currentUser.uid}/followerList`);
        const q2 = query(userRef2);
        onSnapshot(q2, querySnapshot =>{
            querySnapshot.forEach(doc=>{
              if(!users.includes(doc.id)){
                users.push(doc.id)}
              
            })
            SetUsers(users);
        })
        
        SetLoading(false);
        
        }

        
        const getStatus=async()=>{
            let keys=[];
            let keys2=[];
            let keys3=[];
  
            var arrm =[];
            const MuteRef = collection(db, `users/${auth.currentUser.uid}/mutedUsers`)
            const muteSnap = await getDocs(MuteRef);
            if(muteSnap.size>0){
            let mymap = muteSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
            keys = [...mymap.values()]
            keys.forEach((key)=>{
              arrm.push(key.id);
            })
            if(arrm!==null){
            SetMuted(arrm);}
            else{
              SetMuted([0]);
            }
            }else{
              SetMuted([0]);
            }
  
        
            var arrr =[];
            const restrictRef = collection(db, `users/${auth.currentUser.uid}/restrictedUsers`)
            const resSnap = await getDocs(restrictRef);
            if(resSnap.size>0){
            let mymap2 = resSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
            keys2 = [...mymap2.values()]
            keys2.forEach((key)=>{
              arrr.push(key.id);
            })
            if(arrr!==null){
            SetRestricted(arrr);}
            else{
              SetRestricted([0]);
            }
          }else{
            SetRestricted([0]);
          }
        
            var arrb =[];
            const blockRef = collection(db, `users/${auth.currentUser.uid}/blockedUsers`)
            const blockSnap = await getDocs(blockRef);
            if(blockSnap.size>0){
            let mymap3 = blockSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
            keys3 = [...mymap3.values()]
            keys3.forEach((key)=>{
              arrb.push(key.id);
            })
           
            if(arrb!==null){
            SetBlocked(arrb);}
            else{
              SetBlocked([0]);
            }
          }
          else{
            SetBlocked([0]);
          }
          }

        getStatus();
        getUsers();
    }, [])

    const getUsers=async()=>{
      const myRef = doc(db, "users", `${auth.currentUser.uid}`);
      const data = await getDoc(myRef);

      const userRef = collection(db, `users/${auth.currentUser.uid}/followingList`);
      const q = query(userRef);
      let users = []
      onSnapshot(q, querySnapshot =>{
          querySnapshot.forEach(doc=>{
            if(!users.includes(doc.id)){
              users.push(doc.id)}
          })
       //   SetUsers(users);
      })

      const userRef2 = collection(db, `users/${auth.currentUser.uid}/followerList`);
      const q2 = query(userRef2);
      onSnapshot(q2, querySnapshot =>{
          querySnapshot.forEach(doc=>{
            if(!users.includes(doc.id)){
              users.push(doc.id)}
            
          })
          SetUsers(users);
      })
      
      SetLoading(false);
      
      }
   
    const showResults=async(val)=>{
      SetSearching(true);
      if(val===""){
        SetUsers([])
        SetYouMayKnow([])
        SetSearching(false);
        await getUsers();
      }
      else{
        let copyUsers=[...users]
        SetUsers([])
        SetYouMayKnow([])
        const userRef2 = collection(db, `users`);
        const q2 = query(userRef2,where("username", ">=", `${val}`) , where("username", "<=", `${val + "~"}`));
       
        onSnapshot(q2, querySnapshot =>{
          let users=[]
          let unkownUsers=[]
            querySnapshot.forEach(doc=>{
              if(copyUsers.includes(doc.id)){
                users.push(doc.id)}
                else{
                  if(unkownUsers.length<4){
                  unkownUsers.push(doc.id);
                }
                }
                
              })
            SetUsers(users);
            SetYouMayKnow(unkownUsers);
        })
        
        SetLoading(false);
      }
    }

    const selectUser=async(user)=>{
        SetPicUrl(null);
        SetChat(user);
        fetchData(user);
      
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


    const handleSubmit=async()=>{
      
        document.getElementById('messageInput').value = '';
        if(img!==null && text!==null && text!==""){
        
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
    <div style={{display:'flex', flexDirection:'row', width:'100%',  border:'1px solid grey', paddingTop:'100px',minHeight:'100vh'}}>
    <div style={{width:'30%', border:'1px solid grey', overflow:'scroll'}}>
    <div style={{padding:'2%'}}>
    
    <AiOutlineSearch style={{width:'20', height:'20'}}></AiOutlineSearch>
    
    <input placeholder='search for people and rooms' style={{width:'90%', padding:'2%', backgroundColor:'#555', borderRadius:'5px', outline:'none', border:'none', color:'white', cursor:'pointer', marginLeft:'2%'}} onChange={(event)=>showResults(event.target.value)}></input>
    </div>
    {!loading &&(
    <div className='chatDrawer'>
      {searching && users.length>0 && <div style={{height:'fit-content', marginLeft:'15px'}}>Your connections:</div>}
        
        {users.map((user) => 

        {if(blocked!==null && !blocked.includes(user))
        return <User user={user} selectUser={selectUser} user1={auth.currentUser.uid} chat={chat}/>
        }
        )}

      {searching && youMayKnow.length>0 && <div style={{height:'fit-content', marginLeft:'15px'}}>Others users on Lyfy:</div>}

      {youMayKnow.map((user) => 
      {if(blocked!==null && !blocked.includes(user))
      return <User user={user} selectUser={selectUser} user1={auth.currentUser.uid} chat={chat}/>
      }
      )}

    
    </div>)}
    {loading && (
    <div style={{paddingLeft:'30%',paddingTop:'48%', color:'#666'}}>
    {<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Getting users.....
    </div>
    )}
    
    </div> 

{chat && !blocked.includes(chat) && (
    <div style={{height:'80vh', width:'70%'}}>
    <div style={{height:'74vh'}}>
    <div style={{position:'relative',  display:'flex',flexDirection:'row',height:'fit-content', width:'100%',border:'1px solid grey'}}>
    <div style={{padding:'1%'}}>
    <Avatar  src={picUrl} sx={{ width: 40, height: 40, marginTop:'2%'}}></Avatar>
    </div>
    <div style={{marginLeft:'1%',paddingTop:'1%',fontSize:'x-large', width:'fit-content'}}>{chatName}</div>
   <div style={{width:'10%', marginLeft:'auto',marginRight:'2%' }}>
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
        <input id="messageInput" placeholder="Message...."  style={{position:'relative',height:'100%', width:'100%', color:'white', paddingLeft:'2%', paddingRight:'2%', fontSize:'large', border:'1px solid #333', borderRadius:'5px', backgroundColor:'#333'}} onChange={(event)=>{SetText(event.target.value)}}></input>
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