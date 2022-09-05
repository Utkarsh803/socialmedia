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


const SearchResult = ({name, authorId, url, SetSearchRes})=> {
    const NotRef = collection(db, `users/${authorId}/notifications`);
    const navigate = useNavigate();

    const[imageUrl, SetImageUrl]=useState(false);
    const[follow, SetFollow]=useState(null);
    const[myFollow, SetMyFollow]=useState(null);
    const[following, SetFollowing]=useState(null);
    const[loading, SetLoading]=useState(false);


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


    /*
        { (authorId!=auth.currentUser.uid) && !loading && (
    follow ? (<button className='icons' disabled={loading} onClick={handleButttonUnfollow}>Unfollow</button>):(
        <button className='icons' disabled={loading} onClick={handleButttonFollow}>Follow</button>
    )
    )}

{ (authorId!=auth.currentUser.uid) && loading && (
    <button className='icons'>{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}</button>    
    )}
    */
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
 

        
        transaction.set(followingRef,{
            timeStamp:serverTimestamp(),
        });
        

        const newfield1 = {following: docfollowingdocRef.data().following + 1};
        const newfield2 = {followers: docfollowerdocRef.data().followers + 1};
        transaction.update(followingdocRef,newfield1);
        transaction.update(followerdocRef,newfield2);
    

        transaction.set(doc(NotRef),{
            type:"follow",
            content:"started following you.",
            author:auth.currentUser.uid,
            timeStamp:Timestamp.fromDate(new Date()),
          })
       
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
               
        });
            
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
       

        transaction.delete(followingRef);
       


        const newfield1 = {following: docFollowingdocRef.data().following - 1};
       
        const newfield2 = {followers: docFollowerdocRef.data().followers- 1};
      
        transaction.update(followingdocRef,newfield1);
        transaction.update(followerdocRef,newfield2);
      


        const q = query(collection(db, `feed/${auth.currentUser.uid}/posts`), where("author", "==", `${authorId}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        transaction.delete(doc(db, `feed/${auth.currentUser.uid}/posts/${doc.id}`))
       
        
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
       
       if (auth.currentUser.uid != authorId){
       navigate(`/profile/${authorId}`);
      
        }
        else{
            navigate(`/myprofile`);
         
        }
        SetSearchRes(false);
        }


  return (<div className="SearchResult">
    
    <div style={{width:'100%', display:'flex', flexDirection:'row', backgroundColor:'transparent', marginRight:'45%', cursor:'pointer'}}  onClick={handleButtonSendToProfile} >
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 40, height: 40, marginTop:'2%', cursor:'pointer'}}
    />
    <h4 className='welcome'>{name}</h4>  
    </div>

  </div>);
}

export default SearchResult;