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

function SearchResult({name, authorId, url}) {
    const NotRef = collection(db, `users/${authorId}/notifications`);
    const navigate = useNavigate();

    const[imageUrl, SetImageUrl]=useState(false);
    const[follow, SetFollow]=useState(null);
    const[myFollow, SetMyFollow]=useState(null);
    const[following, SetFollowing]=useState(null);

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
        function getPostPic(){
            
            getDownloadURL(ref(storage, `${authorId}/${url}`))
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
            timeStamp:serverTimestamp(),
        });
        console.log("You are now folowing"+name);

        const followingRef = doc(db, `users/${authorId}/followerList`, `${auth.currentUser.uid}`)

        await setDoc(followingRef,{
            timeStamp:serverTimestamp(),
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
            author:auth.currentUser.uid,
            timeStamp:Timestamp.fromDate(new Date()),
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
        console.log("You are not following"+name+" anymore");

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
       console.log("sent to ", authorId);
        }

        const handleButtonSendToMyprofile=()=>{
            navigate(`/myprofile`);
             }
    

  return (<div className="SearchResult">
    <div style={{display:'flex', flexDirection:'row', backgroundColor:'black', marginRight:'45%'}} onClick={auth.currentUser.uid != authorId ? (handleButtonSendToProfile):(handleButtonSendToMyprofile)}>
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'2%'}}
    />
    <h4 className='welcome'>{name}</h4>  
    </div>

    { (authorId!=auth.currentUser.uid) && (
    follow ? (<button className='icons' onClick={handleButttonUnfollow}>Unfollow</button>):(
        <button className='icons' onClick={handleButttonFollow}>Follow</button>
    )
    )}

    
  
  </div>);
}

export default SearchResult;