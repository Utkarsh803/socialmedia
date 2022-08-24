import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {ChatEngine} from 'react-chat-engine'
import Header from './Header.js'
import { db, auth, storage } from './firebase-config.js'
import { collection, query, where, onSnapshot, getDoc, snapshotEqual, doc } from 'firebase/firestore'
import Avatar from '@mui/material/Avatar';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"

const User=({user, selectUser, user1, chat})=> {



    const [picUrl, SetPicUrl]= useState(null);
    const [name, SetName]= useState(null);
    const [data, SetData]= useState('');

    useEffect(()=>{

        const getPic=async()=>{
            console.log("id", user);

            const userRef = doc(db, "users", `${user}`)
            const data = await getDoc(userRef);
            SetName(data.data().name);
            
            getDownloadURL(ref(storage, `${user}/${data.data().profilePic}`))
            .then((url) => {
              SetPicUrl(url);
              console.log("yesssss");
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

            const lastMsg=()=>{
              const id = user1 > user ? `${user1 + user}` : `${user + user1}`
              let unsub = onSnapshot(doc(db, "lastMsg", id), (doc)=>{
                SetData(doc.data());
             });
             return () => unsub()
            }
          
            lastMsg();
            getPic();

    }, [])

    console.log(data);
    return (
    <div className={`SearchResult ${user === chat && `selected-user`}`} onClick={()=>{selectUser(user)}}>
   <div style={{display:'flex', flexDirection:'column', backgroundColor:'transparent', height:'fit-content'}}>
    <div style={{display:'flex', flexDirection:'row', marginRight:'45%', padding:'2%', backgroundColor:'transparent',height:'fit-content'}} >
    <Avatar
    alt="preview image"
    src={picUrl}
    sx={{ width: 40, height: 40, marginTop:'2%'}}
    />
    <h4 className='welcome' style={{backgroundColor:'transparent', paddingTop:'10%', paddingLeft:'5%',height:'fit-content'}}>{name}</h4>  
    </div>  
    <div style={{position:'relative',paddingLeft:'25%', backgroundColor:'transparent', height:'fit-content', width:'90%'}}>
     {data && (data.from !== user1 && data.unread === true) ? (
  <p 
  style={{
    fontSize: '14px',
    fontWeight:'bold',
    whiteSpace:'nowrap',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    backgroundColor:'transparent'
  }}
  >
    <strong style={{
         background: '#0084ff',
         color: 'white',
         padding: '2px 4px',
         borderRadius: '10px',
         
  }}
  >{data.from!==user1 ? "New" : null}</strong>
  <span>{' '}</span>
  
   {data.text}</p>

     ):(

        <p 
        style={{
          fontSize: '14px',
          whiteSpace:'nowrap',
          width: '90%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          backgroundColor:'transparent'
        }}
        >
          <strong style={{backgroundColor:'transparent'}}>{(data && data.from===user1) ? "Me : ": null}</strong>
          {data && data.text}</p>
    )}
    </div>
    </div>
  </div>
    )
}

export default User;