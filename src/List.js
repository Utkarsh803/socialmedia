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
import { runTransaction } from "firebase/firestore";
import * as ReactBootstrap from 'react-bootstrap'


const List = ({authorId, typ})=> {
    const NotRef = collection(db, `users/${authorId}/notifications`);
    const navigate = useNavigate();

    console.log(authorId)

    const[imageUrl, SetImageUrl]=useState(false);
    const[follow, SetFollow]=useState(null);
    const[myFollow, SetMyFollow]=useState(null);
    const[following, SetFollowing]=useState(null);
    const[blocked, SetBlocked]=useState(null);
    const[muted, SetMuted]=useState(null);
    const[restricted, SetRestricted]=useState(null);
    const[loading, SetLoading]=useState(false);
    const[name, SetName]=useState("");
    const[remove,SetRemove]=useState(false);
    const followString = "follow"


    const getFollow=async()=>{
    const docRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${authorId}`)
    const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            SetFollow(true);
            SetRemove(true);
        } else {
        // doc.data() will be undefined in this case
            SetFollow(false);
            SetRemove(false);
        }
    }

    const getBlock=async()=>{
        const docRef = doc(db, `users/${auth.currentUser.uid}/blockedUsers`, `${authorId}`)
        const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                SetBlocked(true);
            } else {
            // doc.data() will be undefined in this case
                SetBlocked(false);
            }
        }

        const getMute=async()=>{
            const docRef = doc(db, `users/${auth.currentUser.uid}/mutedUsers`, `${authorId}`)
            const docSnap = await getDoc(docRef);
        
                if (docSnap.exists()) {
                    SetMuted(true);
                } else {
                // doc.data() will be undefined in this case
                    SetMuted(false);
                }
            }

            const getRestrict=async()=>{
                const docRef = doc(db, `users/${auth.currentUser.uid}/restrictedUsers`, `${authorId}`)
                const docSnap = await getDoc(docRef);
            
                    if (docSnap.exists()) {
                        SetRestricted(true);
                    } else {
                    // doc.data() will be undefined in this case
                        SetRestricted(false);
                    }
                }

    const getFollowStats=async()=>{
        const docRef = doc(db, `users`,`${auth.currentUser.uid}`)
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            SetMyFollow(docSnap.data().following);
            console.log("this"+docSnap.data().following);
        }
        else{
                console.log("error");
        }

        const docRef2 = doc(db, `users`,`${authorId}`)
        const docSnap2 = await getDoc(docRef2);

        if(docSnap2.exists()){
            SetFollowing(docSnap2.data().followers);
            console.log("their"+docSnap2.data().followers);
        }
        else{
                console.log("error");
        }

        }


    useEffect(()=>{
        const getPostPic=async()=>{

            const docRef= doc(db, `users`, `${authorId}`)
            const docSnap = await getDoc(docRef);
            SetName(docSnap.data().name);

            getDownloadURL(ref(storage, `${authorId}/${docSnap.data().profilePic}`))
            .then((url) => {
              SetImageUrl(url);
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
            getPostPic();
            if(typ==="follow" || typ==="remove"){
            getFollow();
            getFollowStats();
        }
            if(typ==="block"){
            getBlock();}
            if(typ==="mute"){
            getMute();}
            if(typ==="restrict"){
            getRestrict();}
      }, [] );



    const increaseFollower=async()=>{
        try{
        const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
        const followerdocRef = doc(db, `users`, `${authorId}`)
        const newfield1 = {following: myFollow + 1};
        SetMyFollow(myFollow+1);
        const newfield2 = {followers: following + 1};
        SetFollowing(following+1);
        await updateDoc(followingdocRef,newfield1);
        await updateDoc(followerdocRef,newfield2);
        console.log("follow stats updated.");
        }
        catch(error){
            console.log(error);
        }
    }

    const handleButtonRemove=async()=>{
        SetLoading(true);
        try{
            await runTransaction(db, async (transaction) => { 

        const profileRef = doc(db, `users/${auth.currentUser.uid}`);
        const profileDoc = await transaction.get(profileRef);

        const profileRef2 = doc(db, `users/${authorId}`);
        const profileDoc2 = await transaction.get(profileRef2);

        transaction.update(profileRef, {followers:profileDoc.data().followers-1})
        transaction.update(profileRef, {following:profileDoc2.data().following-1})

        transaction.delete(doc(db, `users/${auth.currentUser.uid}/followerList`, `${authorId}`));
        transaction.delete(doc(db, `users/${authorId}/followingList`, `${auth.currentUser.uid}`));
            })
            SetRemove(false);
            SetLoading(false);
        }
        catch(e){
            console.log(e.message);
            SetLoading(false);
        }

    }

    const decreaseFollower=async()=>{
        try{
        const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
        const followerdocRef = doc(db, `users`, `${authorId}`)
        const newfield1 = {following: myFollow - 1};
        SetMyFollow(myFollow-1);
        const newfield2 = {followers: following - 1};
        SetFollowing(following-1);
        await updateDoc(followingdocRef,newfield1);
        await updateDoc(followerdocRef,newfield2);
        console.log("follow stats updated.")
        }
        catch(error){
            console.log(error);
        }
    }
 
     const handleButttonFollow = async()=>{
        SetLoading(true);
        var i = 0;
        try{
        await runTransaction(db, async (transaction) => { 
        const followRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${authorId}`)
        const myfollow = await transaction.get(followRef);
        const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
        const docfollowingdocRef =await transaction.get(followingdocRef)
        const followerdocRef = doc(db, `users`, `${authorId}`)
        const docfollowerdocRef =await transaction.get(followerdocRef)
        
        const followingRef = doc(db, `users/${authorId}/followerList`, `${auth.currentUser.uid}`)

if(!myfollow.exist){
        transaction.set(followRef,{
            timeStamp:serverTimestamp(),
        });
        console.log("You are now folowing"+name);

        
        transaction.set(followingRef,{
            timeStamp:serverTimestamp(),
        });
        console.log(authorId+"has a new follower.");

        const newfield1 = {following: docfollowingdocRef.data().following + 1};
        const newfield2 = {followers: docfollowerdocRef.data().followers + 1};
        transaction.update(followingdocRef,newfield1);
        transaction.update(followerdocRef,newfield2);
        console.log("follow stats updated.");

        transaction.set(doc(NotRef),{
            type:"follow",
            content:"started following you.",
            author:auth.currentUser.uid,
            timeStamp:Timestamp.fromDate(new Date()),
          })
          console.log("Posted a notification about a follow.")
          i=1;}
        });

        if(i===1){
        SetMyFollow(myFollow+1);
        SetFollowing(following+1);
        SetFollow(!follow);
    }
    }
        catch(error){
            console.log(error);
        }
        SetLoading(false);
    }

    const deleteFeed = async()=>{
        const q = query(collection(db, `feed/${auth.currentUser.uid}/posts`), where("author", "==", `${authorId}`));
        const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
            deleteDoc(doc(db, `feed/${auth.currentUser.uid}/posts/${doc.id}`))
            console.log(doc.id);    
        });
            console.log("deleted "+ {authorId}+"'s posts from your feed.")
    }

    const handleButtonUnBlock=async()=>{
        SetBlocked(false);
        const blockRef = doc(db, `users/${auth.currentUser.uid}/blockedUsers`, `${authorId}`)
        const docSnap = await getDoc(blockRef);
        if(docSnap.exists()){ 
        await deleteDoc(blockRef)
    }

    const blockRef2 = doc(db, `users/${authorId}/blockedUsers`, `${auth.currentUser.uid}`)
    const docSnap2 = await getDoc(blockRef2);
    if(docSnap2.exists()){ 
    await deleteDoc(blockRef2)
}

}

const handleButtonUnMute=async()=>{
    SetMuted(false);
    const blockRef = doc(db, `users/${auth.currentUser.uid}/mutedUsers`, `${authorId}`)
    const docSnap = await getDoc(blockRef);
    if(docSnap.exists()){ 
    await deleteDoc(blockRef)
}
} 


const handleButtonUnRestrict=async()=>{
    SetRestricted(false);
    const blockRef = doc(db, `users/${auth.currentUser.uid}/restrictedUsers`, `${authorId}`)
    const docSnap = await getDoc(blockRef);
    if(docSnap.exists()){ 
    await deleteDoc(blockRef)
}
}

    const handleButttonUnfollow = async()=>{
        SetLoading(true);
        var i = 0;
        try{
         await runTransaction(db, async (transaction) => { 


       
        const followRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${authorId}`)
        const myfollow = await transaction.get(followRef);
        const followingRef = doc(db, `users/${authorId}/followerList`, `${auth.currentUser.uid}`)
        const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
        const docFollowingdocRef = await transaction.get(followingdocRef)
        const followerdocRef = doc(db, `users`, `${authorId}`)
        const docFollowerdocRef = await transaction.get(followerdocRef)
        
        if(myfollow.exists()){
        transaction.delete(followRef);
        console.log("You are not following"+name+" anymore");

        transaction.delete(followingRef);
        console.log(authorId+"has one less follower.");


        const newfield1 = {following: docFollowingdocRef.data().following - 1};
       
        const newfield2 = {followers: docFollowerdocRef.data().followers- 1};
      
        transaction.update(followingdocRef,newfield1);
        transaction.update(followerdocRef,newfield2);
        console.log("follow stats updated.")


        const q = query(collection(db, `feed/${auth.currentUser.uid}/posts`), where("author", "==", `${authorId}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        transaction.delete(doc(db, `feed/${auth.currentUser.uid}/posts/${doc.id}`))
        console.log(doc.id);    
        
    });
    i=1;
        }
    });
    if(i===1){
    SetMyFollow(myFollow-1);
    SetFollowing(following-1);
    SetFollow(!follow);}
}
        catch(error){
            console.log(error);
        }
        SetLoading(false);
    }

    const handleButtonSendToProfile=()=>{
        console.log("step1")
       if (auth.currentUser.uid != authorId){
       navigate(`/profile/${authorId}`);
       console.log("sent to ", authorId);
       console.log("step2")
        }
        else{
            navigate(`/myprofile`);
            console.log("step2")
        }
        }


  return (<div className="SearchResult">
    
    <div style={{width:'20%',display:'flex', flexDirection:'row', backgroundColor:'transparent', marginRight:'45%', cursor:'pointer'}}  onClick={handleButtonSendToProfile} >
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'2%', cursor:'pointer'}}
    />
    <h4 className='welcome'>{name}</h4>  
    </div>

    { (authorId!=auth.currentUser.uid) && !loading && typ===followString && (
    follow ? (<button className='icons' disabled={loading} onClick={handleButttonUnfollow}>Unfollow</button>):(
        <button className='icons' disabled={loading} onClick={handleButttonFollow}>Follow</button>
    )
    )}


{(authorId!=auth.currentUser.uid) && !loading && typ==="block" && blocked && (
<button className='icons' disabled={loading} onClick={handleButtonUnBlock}>UnBlock</button>)}

{(authorId!=auth.currentUser.uid) && !loading && typ==="mute" && muted && (
<button className='icons' disabled={loading} onClick={handleButtonUnMute}>UnMute</button>)}

{(authorId!=auth.currentUser.uid) && !loading && typ==="restrict" && restricted && (
<button className='icons' disabled={loading} onClick={handleButtonUnRestrict}>UnRestrict</button>)}

{(authorId!=auth.currentUser.uid) && !loading && typ==="remove" && remove &&(
<button className='icons' disabled={loading} onClick={handleButtonRemove}>Remove</button>)}

{ (authorId!=auth.currentUser.uid) && loading && (
    <button className='icons'>{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}</button>    
    )}



  </div>);
}

export default List;