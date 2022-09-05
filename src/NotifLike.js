import './css/NotifLike.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart, AiOutlineNotification } from 'react-icons/ai';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, getDoc, deleteDoc, doc, setDoc, serverTimestamp,query, where, Timestamp} from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { Link, useNavigate } from 'react-router-dom';
import GridImg from './GridImg';
import Moment from 'react-moment'
import * as ReactBootstrap from 'react-bootstrap'
import { runTransaction } from "firebase/firestore";

function NotifLike({authorId,postid,content, timestamp, type, identifier}) {
    const NotRef = collection(db, `users/${authorId}/notifications`);
    const navigate = useNavigate();

    const[imageUrl, SetImageUrl]=useState(false);
    const[followLoading, SetFollowLoading]=useState(false);
    const[declineLoading, SetDeclineLoading]=useState(false); 

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
           
        }
        else{
                console.log("error");
        }

        const docRef2 = doc(db, `users`,`${authorId}`)
        const docSnap2 = await getDoc(docRef2);

        if(docSnap2.exists()){
            SetFollowing(docSnap2.data().followers);
            
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
          
    }

    const deleteFeed = async()=>{
        const q = query(collection(db, `feed/${auth.currentUser.uid}/posts`), where("author", "==", `${authorId}`));
        const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
            deleteDoc(doc(db, `feed/${auth.currentUser.uid}/posts/${doc.id}`))
            
        });
            
    }

    const handleButttonUnfollow = async()=>{
        SetFollow(!follow);
        try{
        const followRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${authorId}`)

        await deleteDoc(followRef);


        const followingRef = doc(db, `users/${authorId}/followerList`, `${auth.currentUser.uid}`)

        await deleteDoc(followingRef);
      
    }
        catch(error){
            console.log(error);
        }
        decreaseFollower();
        deleteFeed();
    }

    const handleButtonSendToProfile=()=>{
       navigate(`/profile/${authorId}`);
        }

        const handleButtonSendToMyprofile=()=>{
            navigate(`/myprofile`);
             }
    const like = "like";

    const handleButtonDecline=async()=>{
      SetDeclineLoading(true);
      const NotRef = doc(db, `users/${auth.currentUser.uid}/notifications`, `${identifier}`);
      await deleteDoc(NotRef);

      const reqRef = doc(db, `users/${authorId}/profileRequests`, `${auth.currentUser.uid}`);
      const docSnap = await getDoc(reqRef);
      
      if(docSnap.exists()){
      await deleteDoc(reqRef);
      }
      SetDeclineLoading(false);
    };


    const handleButtonAccept = async()=>{
      SetFollowLoading(true);
      
      try{
        await runTransaction(db, async (transaction) => { 

      const followRef = doc(db, `users/${authorId}/followingList`, `${auth.currentUser.uid}`)
      const myfollow = await transaction.get(followRef)

      const followingRef = doc(db, `users/${auth.currentUser.uid}/followerList`, `${authorId}`)

      const followingdocRef = doc(db, `users`, `${authorId}`)
      const docfollowingdocRef =await transaction.get(followingdocRef)

      const followerdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
      const docfollowerdocRef =await transaction.get(followerdocRef)

      if(!myfollow.exists()){

      transaction.set(followRef,{
          timeStamp:serverTimestamp(),
      });
      

   
      transaction.set(followingRef,{
          timeStamp:serverTimestamp()
      });
      

      
      const newfield1 = {following:  docfollowingdocRef.data().following + 1};
     
      const newfield2 = {followers: docfollowerdocRef.data().followers + 1};

      transaction.update(followingdocRef,newfield1);
      transaction.update(followerdocRef,newfield2);
      

      const NotRef = collection(db, `users/${auth.currentUser.uid}/notifications`);
       transaction.set(doc(NotRef),{
        type:"follow",
        content:"started following you.",
        author:authorId,
        timeStamp:Timestamp.fromDate(new Date()),
      })

      const NotRef2 = collection(db, `users/${authorId}/notifications`);
      transaction.set(doc(NotRef2),{
       type:"accept",
       content:"accepted your follow request..",
       author:auth.currentUser.uid,
       timeStamp:Timestamp.fromDate(new Date()),
     })

      

      const thisRef = doc(db, `users/${auth.currentUser.uid}/notifications`, `${identifier}`);
      await deleteDoc(thisRef);

      const reqRef = doc(db, `users/${authorId}/profileRequests`, `${auth.currentUser.uid}`);
      deleteDoc(reqRef);
  
    }
    });
    SetFollowLoading(false);
  }
      catch(error){
          console.log(error);
      }
      SetFollowLoading(false);
  }



  return (
    <div className="NotifLike">
    {type === "like" && (
    <div style={{display:'flex', flexDirection:'row', backgroundColor:'transparent', width:'100%'}} onClick={auth.currentUser.uid != authorId ? (handleButtonSendToProfile):(handleButtonSendToMyprofile)} >
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'3.5%'}}
    />
    <h4 className='welcome'>{username}</h4>  
    <div style={{backgroundColor:'transparent', width:'fit-content', marginTop:'3.5%'}}> liked a post. <small><Moment fromNow ago style={{backgroundColor:'transparent', color:'grey', fontSize:'x-small'}}>{ timestamp ? (timestamp.toDate()):null}</Moment></small></div>
    <div style={{width:'10%', marginRight:'2%', marginLeft:'auto'}}>
    <img src={postUrl} style={{ backgroundColor:'black', maxHeight:'10vh'}}></img>
    </div>
    </div>
   )}

    {type === "comment" && (
    <div style={{display:'flex', flexDirection:'row', backgroundColor:'transparent', width:'100%'}} onClick={auth.currentUser.uid != authorId ? (handleButtonSendToProfile):(handleButtonSendToMyprofile)}>
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'3.5%'}}
    />
    <h4 className='welcome'>{username}</h4>  
    <div style={{backgroundColor:'transparent', width:'fit-content', marginTop:'3.5%'}}> commented on a post. <small><Moment fromNow ago style={{backgroundColor:'transparent', color:'grey', fontSize:'x-small'}}>{ timestamp ? (timestamp.toDate()):null}</Moment></small></div>
    <div style={{width:'10%',  marginRight:'2%', marginLeft:'auto'}}>
    <img src={postUrl} style={{ backgroundColor:'black', maxHeight:'10vh'}}></img>
    </div>
    </div>
   )}

    {type === "follow" && (
    <div style={{display:'flex', flexDirection:'row', backgroundColor:'transparent', width:'100%'}} onClick={auth.currentUser.uid != authorId ? (handleButtonSendToProfile):(handleButtonSendToMyprofile)}>
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'3.5%'}}
    />
    <h4 className='welcome'>{username}</h4>  
    <div style={{backgroundColor:'transparent', width:'fit-content', marginTop:'3.5%'}}>started following you. <small><Moment fromNow ago style={{backgroundColor:'transparent', color:'grey', fontSize:'x-small'}}>{ timestamp ? (timestamp.toDate()):null}</Moment></small></div>
    </div>
   )}

{type === "accept" && (
    <div style={{display:'flex', flexDirection:'row', backgroundColor:'transparent', width:'100%'}} onClick={auth.currentUser.uid != authorId ? (handleButtonSendToProfile):(handleButtonSendToMyprofile)}>
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'3.5%'}}
    />
    <h4 className='welcome'>{username}</h4>  
    <div style={{backgroundColor:'transparent', width:'fit-content', marginTop:'3.5%'}}> accepted your follow request. <small><Moment fromNow ago style={{backgroundColor:'transparent', color:'grey', fontSize:'x-small'}}>{ timestamp ? (timestamp.toDate()):null}</Moment></small></div>
    </div>
   )}

{type === "request" && (
    <div style={{display:'flex', flexDirection:'column', backgroundColor:'transparent', marginRight:'45%', width:'100%'}} >
     <div style={{display:'flex', flexDirection:'row', backgroundColor:'transparent', width:'100%'}} onClick={auth.currentUser.uid != authorId ? (handleButtonSendToProfile):(handleButtonSendToMyprofile)}>
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'3.5%'}}
    />
    <h4 className='welcome'>{username}</h4>  
    <div style={{backgroundColor:'transparent', width:'fit-content', marginTop:'3.5%'}}> requested to follow you. <small><Moment fromNow ago style={{backgroundColor:'transparent', color:'grey', fontSize:'x-small'}}>{ timestamp ? (timestamp.toDate()):null}</Moment></small></div>
    </div>
    <div style={{display:'flex', flexDirection:'row', backgroundColor:'transparent', marginLeft:'12%', height:'fit-content', maxHeight:'10vh'}} >
    {!followLoading ?
    (<button style={{width:'fit-content', marginRight:'2%',height:'fit-content'}} onClick={handleButtonAccept}>Accept</button>):(
      <button style={{width:'fit-content', marginRight:'2%',height:'fit-content'}}>{<ReactBootstrap.Spinner animation="border" size="sm"/>}</button>
    )}
    {!declineLoading ?
    (<button style={{width:'fit-content'}} onClick={handleButtonDecline}>Decline</button>):
    (
      <button style={{width:'fit-content'}}>{<ReactBootstrap.Spinner animation="border" size="sm"/>}</button>
    )}
    </div>
    </div>
   )}
   
    </div>
    );
}

export default NotifLike;