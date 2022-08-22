import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {ChatEngine} from 'react-chat-engine'
import Header from './Header.js'
import { db, auth, storage } from './firebase-config.js'
import { collection, query, where, onSnapshot, getDoc, snapshotEqual, doc } from 'firebase/firestore'
import Avatar from '@mui/material/Avatar';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"

const User=({user})=> {

    const [picUrl, SetPicUrl]= useState(null);
    const [name, SetName]= useState(null);

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

            getPic();

    }, [])

    
    return (
    <div className="SearchResult">
    <div style={{display:'flex', flexDirection:'row', backgroundColor:'black', marginRight:'45%'}} >
    <Avatar
    alt="preview image"
    src={picUrl}
    sx={{ width: 40, height: 40, marginTop:'2%'}}
    />
    <h4 className='welcome'>{name}</h4>  
    </div>  
  </div>
    )
}

export default User;