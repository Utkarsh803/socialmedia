import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {ChatEngine} from 'react-chat-engine'
import Header from './Header.js'
import './css/Chats.css'
import { db, auth, storage } from './firebase-config.js'
import { collection, query, where, onSnapshot, getDoc, snapshotEqual, doc } from 'firebase/firestore'
import User from './User.js'
import Avatar from '@mui/material/Avatar';

const Chats=()=>{

    const [username, SetUsername] = useState(null);
    const [users, SetUsers] = useState([]);

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
        {users.map(user => <User user={user}/>)}
    </div>
    </div>
    <div style={{minHeight:'80vh', width:'70%', padding:'0%'}}>
    <div style={{minHeight:'70vh'}}>
    <div style={{minHeight:'10vh', width:'100%',border:'1px solid grey'}}>
    <div style={{paddingLeft:'2%', paddingTop:'1%'}}>
    <div style={{dispay:'flex', flexDirection:'row'}}>
    <Avatar  src={"uk"}></Avatar>
    <div>Utkarsh5</div>
    </div>
    </div>
    
    </div>   

    </div>
    <div style={{position:'relative',width:'100%', height:'10%', marginTop:'1%', display:'flex',flexDirection:'row'}}>
        <div style={{position:'relative',displey:'flex', flexDirection:'row', width:'90%'}}>
        <input placeholder="Message...." style={{position:'relative',height:'100%', width:'100%', color:'white', paddingLeft:'2%', paddingRight:'2%', fontSize:'large'}}></input>
        </div>
        <div style={{position:'relative',width:'10%', height:'110%',bottom:'5%'}}>
        <button style={{position:'relative',height:'100%', width:'90%', marginLeft:'10%'}}>Post</button>
        </div>
    </div>
    </div>
    </div>
    </div>
    </nav>
    </div>
    )
}

export default Chats;