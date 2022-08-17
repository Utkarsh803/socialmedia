import './css/NotifLike.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart, AiOutlineNotification } from 'react-icons/ai';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, getDoc, deleteDoc, doc, setDoc, serverTimestamp,query, where} from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { Link, useNavigate } from 'react-router-dom';
import GridImg from './GridImg';

function NotifLike({authorId,postid,content, timestamp, type}) {
    const NotRef = collection(db, `users/${authorId}/notifications`);
    const navigate = useNavigate();

    const[imageUrl, SetImageUrl]=useState(false);
    const[postUrl, SetPostUrl]=useState(false);
    const[follow, SetFollow]=useState(null);
    const[myFollow, SetMyFollow]=useState(null);
    const[following, SetFollowing]=useState(null);
    const[profilePic, SetProfilePic]=useState(null);
    const[username, SetUsername]=useState(false);
    const getFollow=async()=>{
    const docRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${authorId}`)
    const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            SetFollow(true);
        } else {
        // doc.data() will be undefined in this case
            SetFollow(false);
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
        const getProfilePic=async()=>{

            const docRef = doc(db, `users/${authorId}`);
            const data = await getDoc(docRef);
            SetUsername(data.data().username);
            
            getDownloadURL(ref(storage, `${authorId}/${data.data().profilePic}`))
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
            });}

            const getPostPic=async()=>{

            if(type!="follow"){
            const postRef = doc(db, `users/${auth.currentUser.uid}/posts`, `${postid}`)
            console.log({authorId});
            console.log({postid})
            const postData = await getDoc(postRef);

            getDownloadURL(ref(storage, `/${auth.currentUser.uid}/${postData.data().url}`))
            .then((postUrl) => {
              SetPostUrl(postUrl);
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
    }
            getProfilePic();
            getPostPic();
            getFollow();
            getFollowStats();
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
        SetFollow(!follow);
        try{
        const followRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${authorId}`)

        await setDoc(followRef,{
            timeStamp:serverTimestamp()
        });

        const followingRef = doc(db, `users/${authorId}/followerList`, `${auth.currentUser.uid}`)

        await setDoc(followingRef,{
            timeStamp:serverTimestamp()
        });
        console.log(authorId+"has a new follower.");
    }
        catch(error){
            console.log(error);
        }
        increaseFollower();
        await addDoc(NotRef,{
            type:"follow",
            content:"started following you.",
            author:authorId,
            timeStamp:serverTimestamp(),
          })
          console.log("Posted a notification about a follow.")
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

    const handleButttonUnfollow = async()=>{
        SetFollow(!follow);
        try{
        const followRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${authorId}`)

        await deleteDoc(followRef);


        const followingRef = doc(db, `users/${authorId}/followerList`, `${auth.currentUser.uid}`)

        await deleteDoc(followingRef);
        console.log(authorId+"has one less follower.");
    }
        catch(error){
            console.log(error);
        }
        decreaseFollower();
        deleteFeed();
    }

    const handleButtonSendToProfile=()=>{
       navigate(`/${authorId}`);
        }

        const handleButtonSendToMyprofile=()=>{
            navigate(`/myprofile`);
             }
    const like = "like";

  return (
    <div className="NotifLike">
    {type === "like" && (
    <div style={{display:'flex', flexDirection:'row', backgroundColor:'black', marginRight:'45%'}} onClick={auth.currentUser.uid != authorId ? (handleButtonSendToProfile):(handleButtonSendToMyprofile)}>
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'3%'}}
    />
    <h4 className='welcome'>{username}</h4>  
    <div style={{backgroundColor:'black', width:'200px',overflow:'hidden', whiteSpace:'nowrap', marginTop:'7%'}}> liked a post.</div>
    <img src={postUrl} style={{height:'60%', backgroundColor:'black',height:'fit-content', maxHeight:'10vh', maxWidth:'10vh'}}></img>
    </div>
   )}

    {type === "comment" && (
    <div style={{display:'flex', flexDirection:'row', backgroundColor:'black', marginRight:'45%'}} onClick={auth.currentUser.uid != authorId ? (handleButtonSendToProfile):(handleButtonSendToMyprofile)}>
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'3%'}}
    />
    <h4 className='welcome'>{username}</h4>  
    <div style={{backgroundColor:'black', width:'200px',overflow:'hidden', whiteSpace:'nowrap', marginTop:'7%'}}> commented on a post.</div>
    <img src={postUrl} style={{height:'60%', backgroundColor:'black',height:'fit-content', maxHeight:'10vh', maxWidth:'10vh'}}></img>
    </div>
   )}

    {type === "follow" && (
    <div style={{display:'flex', flexDirection:'row', backgroundColor:'black', marginRight:'45%'}} onClick={auth.currentUser.uid != authorId ? (handleButtonSendToProfile):(handleButtonSendToMyprofile)}>
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'3%'}}
    />
    <h4 className='welcome'>{username}</h4>  
    <div style={{backgroundColor:'black', width:'200px',overflow:'hidden', whiteSpace:'nowrap', marginTop:'7%'}}> started follwing you.</div>
    </div>
   )}
   
    </div>
    );
}

export default NotifLike;