import './css/Profile.css';
import Header from'./Header.js';
import Post from'./Post.js';
import SidePanel from './SidePanel';
import {useState, useEffect , useRef} from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, serverTimestamp, query, where, Timestamp, orderBy, onSnapshot} from 'firebase/firestore';
import {signOut, onAuthStateChanged} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Avatar from '@mui/material/Avatar';
import {AiFillTag, AiOutlineVideoCamera} from 'react-icons/ai';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {FcGallery} from 'react-icons/fc';
import GridImg from './GridImg';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import React from 'react';
import {useParams} from 'react-router-dom'
import {FcNext, FcPrevious} from 'react-icons/fc';
import {MdKeyboardBackspace} from 'react-icons/md';
import { runTransaction } from "firebase/firestore";
import { FaTruckLoading } from 'react-icons/fa';
import * as ReactBootstrap from 'react-bootstrap'
import { getStackUtilityClass } from '@mui/system';
import List from './List';



function Profile() {

   
    const {uid} =useParams();
    console.log("Welcome to", {uid});
    const piid = {uid}
    const [name, setName]=useState("");    
    const [username, SetUserName]=useState("");
    const [website, SetWebsite]=useState("");
    const [bio, SetBio]=useState("");
    const [phone, SetPhone]=useState("");
    const [email, SetEmail]=useState("");
    const [gender, SetGender]=useState("");
    const[twoFactor, SetTwoFactor]= useState(false);
    const[privateAccount, SetPrivateAccount]= useState(true);
    const[getEmail, SetGetEmail]= useState(false);
    const[getSms, SetGetSms]= useState(false);
    const [currentPic, SetCurrentPic]=useState(null);
    const [currentPicUrl, SetCurrentPicUrl]=useState(null);
    const [posts, SetPosts]=useState(null);
    const [numberOFollowers, SetNumberOfFollowers]=useState(null);
    const [numberOFollowing,SetNumberOfFollowing]=useState(null);
    const [numberOfPosts, SetNumberOfPosts]=useState(null);
    const [time, setTime] = useState(Date. now()); 
    const [focusImages, SetFocusImages]=useState(true);
    const [focusVideos, SetFocusVideos]=useState(false);
    const [focusTags, SetFocusTags]=useState(false);
    const [grid, SetGrid]=useState(true);
    const[loading, SetLoading]= useState(true);
    const[followLoading, SetFollowLoading]= useState(false);
    const[options, SetOptions]= useState(false);

    const[showFollowers, SetShowFollowers]= useState(false);
    const[showFollowing, SetShowFollowing]= useState(false);
 

    const[blocked, SetBlocked]= useState(null);
    const[blockedList, SetBlockedList]= useState(null);

    const[muted, SetMuted]= useState(false);
    const[restricted, SetRestricted]= useState(false);
    const[followerList, SetFollowerList]=useState(null);
    const[followingList, SetFollowingList]=useState(null);

    const[follow, SetFollow]=useState(false);
    const[request, SetRequest]=useState(false);
    const[myFollow, SetMyFollow]=useState(null);
    const[following, SetFollowing]=useState(null);
    const [postArray, SetPostArray]=useState(null);
    const [index, SetIndex]=useState([]);
    const[collectionSize, SetCollectionSize]=useState();
    const followString="follow"
    
    useEffect(()=>{

      SetCurrentPicUrl(null);
      const getUsersData = () => {
        const q = query(docRef);
        onSnapshot(q,docSnap=>{
          setName(docSnap.data().name);
          SetUserName(docSnap.data().username);
          SetPrivateAccount(docSnap.data().private);
          SetBio(docSnap.data().bio);
          SetWebsite(docSnap.data().website);           
          SetNumberOfFollowers(docSnap.data().followers);
          SetNumberOfFollowing(docSnap.data().following);
          SetNumberOfPosts(docSnap.data().posts);

          getDownloadURL(ref(storage, `${uid}/${docSnap.data().profilePic}`))
      .then((url) => {
        SetCurrentPicUrl(url);
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
          
        });}

    const getUserPost =async()=>{
      console.log("loading1: ", loading);
      const q = query(postsCollectionRef,orderBy('timeStamp', 'desc'))
      onSnapshot(q, querySnapshot=>{
        if(querySnapshot.size>0){
        SetPosts(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
        let mymap = querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id}))
        let keys = [...mymap.values()]
        SetCollectionSize(keys.length);
        SetPostArray(keys);
        console.log("There are "+((keys.length)-1)+" posts");
        SetLoading(false);
      }
        else{
          SetPosts("null");
          SetLoading(false);
        }
      })
    }

    const getFollow=async()=>{
      try{
      const docR = doc(db, `users/${auth.currentUser.uid}/followingList`, `${uid}`)    
      const docSnap =  await getDoc(docR);
      
      if (docSnap.exists()){
      SetFollow(true);
      }
    }
          catch(error){
            console.log(error);
          }
      }

      const getRequested=async()=>{
        const reqRef = doc(db, `users/${auth.currentUser.uid}/profileRequests`, `${uid}`);
        const docSnap = await getDoc(reqRef);
        if(docSnap.exists()){
          SetRequest(true);
        }
      }

    const getStatus=async()=>{
      const MuteRef = doc(db, `users/${auth.currentUser.uid}/mutedUsers`, `${uid}`)
      const muteSnap = await getDoc(MuteRef);
      if(muteSnap.exists()){ 
      SetMuted(true);
    }
    else{
      SetMuted(false);
    }
  
      const restrictRef = doc(db, `users/${auth.currentUser.uid}/restrictedUsers`, `${uid}`)
      const resSnap = await getDoc(restrictRef);
      if(resSnap.exists()){ 
      SetRestricted(true);
    }
    else{
      SetRestricted(false);
    }
  
      const blockRef = doc(db, `users/${auth.currentUser.uid}/blockedUsers`, `${uid}`)
      const blockSnap = await getDoc(blockRef);
      if(blockSnap.exists()){ 
      SetBlocked(true);
      }
      else{
        SetBlocked(false);
      }
    }

    const getOwnProfile=()=>{
      if(auth.currentUser.uid===uid){
        navigate("/myProfile");
        console.log("own profile")
      }
      console.log(uid);
    console.log("Not own profile")
    }



    getOwnProfile();
    getStatus();
    getFollowStats();
    getUsersData();
    getFollow();
    getUserPost();
    if(privateAccount && !follow){
      getRequested();
    }
  }, [uid, index] );

  const getStatus=async()=>{
    let keys3=[];
    var arrb =[];
    const blockRef = collection(db, `users/${auth.currentUser.uid}/blockedUsers`)
    const blockSnap = await getDocs(blockRef);
    if(blockSnap.size>0){
    let mymap3 = blockSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
    keys3 = [...mymap3.values()]
    keys3.forEach((key)=>{
      arrb.push(key.id);
    })
    console.log("keys"+arrb)
    if(arrb!==null){
    SetBlockedList(arrb);}
    else{
      SetBlockedList([0]);
    }
  }
  else{
    SetBlockedList([0]);
  }
  }


  const getFollowingList=async()=>{
    try{
    const docR = collection(db, `users/${uid}/followingList`)    
    const docSnap =  await getDocs(docR);
    
    if (docSnap.size>0){
    SetFollowingList(docSnap.docs.map((doc)=>({...doc.data(), id: doc.id})));
    }
  }
        catch(error){
          console.log(error);
        }
    }



      const getFollowStats=async()=>{
        const docRef = doc(db, `users`,`${auth.currentUser.uid}`)
          const q = query(docRef);
          onSnapshot(q,docSnap=>{
            SetMyFollow(docSnap.data().following);
          });

        const docRef2 = doc(db, `users`,`${uid}`)
        const docSnap2 = await getDoc(docRef2);

        if(docSnap2.exists()){
            SetFollowing(docSnap2.data().followers);
            console.log("their"+docSnap2.data().followers);
        }
        else{
                console.log("error");
        }

        }



        const increaseFollower=async()=>{
          try{
          const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
          const followerdocRef = doc(db, `users`, `${uid}`)
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
          const followerdocRef = doc(db, `users`, `${uid}`)
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

      const handleButtonClosePosts=()=>{
        SetGrid(!grid);
      }

      const handleButttonRequest = async()=>{
        SetFollowLoading(true);
       
        try{
          await runTransaction(db, async (transaction) => { 

        const NotRef = collection(db, `users/${uid}/notifications`);
         transaction.set(doc(NotRef),{
          type:"request",
          content:"has requested to follow you.",
          author:auth.currentUser.uid,
          timeStamp:Timestamp.fromDate(new Date()),
        })
        console.log("Posted a notification about a request.")

        const reqRef = doc(db, `users/${auth.currentUser.uid}/profileRequests`, `${uid}`);
        transaction.set(reqRef, {
          createdAt:serverTimestamp(),
          declined:false,
        })

        console.log("sent request");
     
      })
      SetRequest(true);      
    }
        catch(error){
            console.log(error);
        }
        SetFollowLoading(false);
    }

    
      const handleButttonFollow = async()=>{
        SetFollowLoading(true);
        var i=0;
        try{
          await runTransaction(db, async (transaction) => { 

        const followRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${uid}`)
        const myfollow = await transaction.get(followRef)
        const followingRef = doc(db, `users/${uid}/followerList`, `${auth.currentUser.uid}`)
        const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
        const docfollowingdocRef =await transaction.get(followingdocRef)
        const followerdocRef = doc(db, `users`, `${uid}`)
        const docfollowerdocRef =await transaction.get(followerdocRef)

        if(!myfollow.exists()){

        transaction.set(followRef,{
            timeStamp:serverTimestamp(),
        });
        console.log("You are now folowing"+name);

     
        transaction.set(followingRef,{
            timeStamp:serverTimestamp()
        });
        console.log(uid+"has a new follower.");

        
        const newfield1 = {following:  docfollowingdocRef.data().following + 1};
       
        const newfield2 = {followers: docfollowerdocRef.data().followers + 1};

        transaction.update(followingdocRef,newfield1);
        transaction.update(followerdocRef,newfield2);
        console.log("follow stats updated.");

        const NotRef = collection(db, `users/${uid}/notifications`);
         transaction.set(doc(NotRef),{
          type:"follow",
          content:"started following you.",
          author:auth.currentUser.uid,
          timeStamp:Timestamp.fromDate(new Date()),
        })
        console.log("Posted a notification about a follow.")
      i=1;
      }
      });
      if(i===1){
      SetFollow(true);
      SetMyFollow(myFollow+1);
      SetFollowing(following+1);
      }
    }
        catch(error){
            console.log(error);
        }
        SetFollowLoading(false);
    }




    const deleteFeed = async()=>{
      const q = query(collection(db, `feed/${auth.currentUser.uid}/posts`), where("author", "==", `${uid}`));
      const querySnapshot = await getDocs(q);
          querySnapshot.forEach((docc) => {
            console.log(docc.id);  
            deleteDoc(doc(db, `feed/${auth.currentUser.uid}/posts/${docc.id}`))
          });
          console.log("deleted posts from your feed.")
  }

    const handleButtonUnfollow = async()=>{
      SetFollowLoading(true);
      var i=0;
        try{
          await runTransaction(db, async (transaction) => { 
        const followRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${uid}`)
        const myfollow = await transaction.get(followRef)
        const followingRef = doc(db, `users/${uid}/followerList`, `${auth.currentUser.uid}`)
        const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
        const docFollowingdocRef = await transaction.get(followingdocRef)
        const followerdocRef = doc(db, `users`, `${uid}`)
        const docFollowerdocRef = await transaction.get(followerdocRef)

        if(myfollow.exists()){
        transaction.delete(followRef);
        console.log("You are not following"+name+" anymore");

        transaction.delete(followingRef);
        console.log(uid+"has one less follower.");


        const newfield1 = {following: docFollowingdocRef.data().following - 1};
        
        const newfield2 = {followers: docFollowerdocRef.data().followers - 1};
       
        transaction.update(followingdocRef,newfield1);
        transaction.update(followerdocRef,newfield2);
        console.log("follow stats updated.")

        const q = query(collection(db, `feed/${auth.currentUser.uid}/posts`), where("author", "==", `${uid}`));
        const querySnapshot = await getDocs(q);
            querySnapshot.forEach((docc) => {
              console.log(docc.id);  
              transaction.delete(doc(db, `feed/${auth.currentUser.uid}/posts/${docc.id}`))
            });
            console.log("deleted posts from your feed.")
          i=1;
          }
        
      });
      if(i===1){
        SetMyFollow(myFollow-1);
        SetFollowing(following-1);
        SetFollow(false);
        SetRequest(false);
      }
    }
        catch(error){
            console.log(error);
        }
        SetFollowLoading(false);
    }

  

    const docRef = doc(db, "users", uid);
    let navigate = useNavigate(); 
    const myRef = useRef(null)

    const handleButtonFocusImages=()=>{
      SetFocusImages(true);
      SetFocusTags(false);
      SetFocusVideos(false);
    }

    const handleButtonFocusVideos=()=>{
      SetFocusVideos(true);
      SetFocusTags(false);
      SetFocusImages(false);
    }
    const handleButtonFocusTags=()=>{
      SetFocusTags(true);
      SetFocusVideos(false);
      SetFocusImages(false);
    }

    const postsCollectionRef = collection(db, `users/${uid}/posts`);



  const logout = async () =>
  {
          await signOut(auth);
          navigate("/");

  }

  function getPostPic(imgName){
  getDownloadURL(ref(storage, `${uid}/${imgName}`))
  .then((url) => {
    console.log("Profile Pic Downloaded");
    return url;
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

  const getIndex=(item)=>{
    var index = 0;
    postArray.forEach((post)=>{
      if(post.id === item){
        SetIndex(index);
        console.log("index",index);
      }
      else{
        index=index+1;
      }
    })
  }

  const goToNextPost = () => {
    if(index < collectionSize-1){
        SetIndex((index) => index + 1);
    }
      };
    
      const goToPreviousPost = () => {
        if(index >= 1 ){
          SetIndex((index) => index - 1);
        console.log("going to previous post")
      }
      };

      
  const handleButtonSetGrid=(id)=>{
    getIndex(id);
    SetGrid(!grid);
  }

  const handleButtonRestrict=async()=>{
    SetRestricted(true);
    const restrictRef = doc(db, `users/${auth.currentUser.uid}/restrictedUsers`, `${uid}`)
    await setDoc(restrictRef, {
      createdAt:serverTimestamp(),
    })
    console.log("restricted")
  }

  const handleButtonMute=async()=>{
    SetMuted(true);
    const MuteRef = doc(db, `users/${auth.currentUser.uid}/mutedUsers`, `${uid}`)
    await setDoc(MuteRef, {
      createdAt:serverTimestamp(),
    })
    console.log("muted")
  }

  const handleButtonBlock=async()=>{
    SetOptions(false);
    try{
    SetBlocked(true);
    const blockRef = doc(db, `users/${auth.currentUser.uid}/blockedUsers`, `${uid}`)

    const myRef = doc(db, `users`, `${auth.currentUser.uid}`)
    const myDoc = await getDoc(myRef)
    const theirRef = doc(db, `users`, `${uid}`)
    const theirDoc = await getDoc(theirRef)
    console.log("step95")

    const ownfollowerRef = doc(db, `users/${auth.currentUser.uid}/followerList`, `${uid}`)
    const a =await getDoc(ownfollowerRef)

    console.log("step96")
    
    const ownfollowingRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${uid}`)
    const b =await getDoc(ownfollowingRef)

    console.log("step97")    
    const theirfollowerRef = doc(db, `users/${uid}/followerList`, `${auth.currentUser.uid}`)
    const c =await getDoc(theirfollowerRef)

    console.log("step98")
    const theirfollowingRef = doc(db, `users/${uid}/followingList`, `${auth.currentUser.uid}`)
    const d =await getDoc(theirfollowingRef)

    console.log("step99")
    const block2Ref = doc(db, `users/${uid}/blockedUsers`, `${auth.currentUser.uid}`)


    //removes likes and comments...
    var postids=[]
    const postsRef = collection(db, `users/${auth.currentUser.uid}/posts`)
    const postDocs = await getDocs(postsRef);
    let mymap = postDocs.docs.map((doc)=>({...doc.data(), id: doc.id}))
    postids = [...mymap.values()]
    console.log("postids")
    console.log(postids)

    console.log("step100")


    for(const docc of postids){
      var commentids=[];

      const postidRef = doc(db, `users/${auth.currentUser.uid}/posts`, `${docc.id}`)
      const postidDocs = await getDoc(postidRef);

      const commentsRef = collection(db, `users/${auth.currentUser.uid}/comments/${docc.id}/ids`)
      const q =query(commentsRef, where("author", "==", `${uid}`));
      const querySnapshot = await getDocs(q);
      let mymap2 = querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id}))
      commentids = [...mymap2.values()]
      console.log("commentids")
      console.log(commentids)

      console.log("step1")
      //remove post like
      const likesRef = doc(db, `users/${auth.currentUser.uid}/likes/${docc.id}/ids`, `${uid}`) 
      const likesDoc = await getDoc(likesRef);
      if(likesDoc.exists()){
        deleteDoc(likesRef);
        updateDoc(postidRef,{likes:postidDocs.data().likes-1})
      }
      console.log("removed a like")

      console.log("step2")

            //remove all comments
      for(const commentDoc of  commentids){
      if(commentDoc.child===0){
        console.log("step3")
        console.log(commentDoc.id)
            
        console.log("Process began")   
        const comRef = doc(db, `users/${auth.currentUser.uid}/comments`, `${docc.id}`)
        const docRef = await getDoc(comRef) 
        console.log("step4")
      
        const newfield={validComments:docRef.data().validComments-1};
        updateDoc(comRef, newfield);
       
        console.log("step5")
      
       
        const usersCollectionRef = doc(db, `/users/${auth.currentUser.uid}/comments/${docc.id}/ids`, `${commentDoc.id}`);
        
        deleteDoc(usersCollectionRef);      
        console.log("step6")
        console.log("deleted a comment");
      
      }
      else{
        const usersCollectionRef = doc(db, `/users/${auth.currentUser.uid}/comments/${docc}/ids`, `${commentDoc.id}`);
        updateDoc(usersCollectionRef,{
          comment: "[deleted]",
          author:"[deleted]",
        });      
        console.log("step6")

        console.log("deleted a comment");
      }
      };      console.log("step7")
    
    }

    await setDoc(block2Ref, {
      createdAt:serverTimestamp(),
      origin:auth.currentUser.uid,
    })

    if(d.exists()){
      updateDoc(theirRef , {following:theirDoc.data().following-1});
    deleteDoc(theirfollowingRef)
    }

    if(c.exists()){
      updateDoc(theirRef , {followers:theirDoc.data().followers-1});
    deleteDoc(theirfollowerRef)
    }

    if(b.exists()){
      updateDoc(myRef, {following:myDoc.data().following-1});
      deleteDoc(ownfollowingRef)}

    if(a.exists()){
        updateDoc(myRef, {followers:myDoc.data().followers-1});
        deleteDoc(ownfollowerRef);
        }

    
      await setDoc(blockRef, {
          createdAt:serverTimestamp(),
          origin:auth.currentUser.uid,
        })

    console.log("blockeded")
    SetOptions(false);
  }
  catch(e){
    console.log(e.message);
    SetOptions(false);
  }
}

  
  const handleButtonUnRestrict=async()=>{
    SetRestricted(false);
    const restrictRef = doc(db, `users/${auth.currentUser.uid}/restrictedUsers`, `${uid}`)
    const docSnap = await getDoc(restrictRef);
    if(docSnap.exists()){ 
    await deleteDoc(restrictRef)
  }
  console.log("UnRestricted")
  }

  const handleButtonUnMute=async()=>{
    SetMuted(false);
    const MuteRef = doc(db, `users/${auth.currentUser.uid}/mutedUsers`, `${uid}`)
    const docSnap = await getDoc(MuteRef);
    if(docSnap.exists()){ 
    await deleteDoc(MuteRef)
  }
  console.log("Unmuted")
  }

  const handleButtonUnBlock=async()=>{
    SetBlocked(false);
    const blockRef = doc(db, `users/${auth.currentUser.uid}/blockedUsers`, `${uid}`)
    const docSnap = await getDoc(blockRef);
    if(docSnap.exists()){ 
    await deleteDoc(blockRef)
  }

  const block2Ref = doc(db, `users/${uid}/blockedUsers`, `${auth.currentUser.uid}`)
  const docSnap2 = await getDoc(block2Ref);
  if(docSnap2.exists()){ 
    await deleteDoc(block2Ref);
  }
  
  console.log("unblocked")
  }


  const handleButtonOptions=()=>{
    console.log("open");
    SetOptions(!options);
  }

  const handleButtonEditProfile=()=>{
    navigate("/settings");
  }



  const getFollowersList=async()=>{
    try{
    const docR = collection(db, `users/${uid}/followerList`)    
    const docSnap =  await getDocs(docR);
    console.log(docSnap)
    
    if (docSnap.size>0){
    SetFollowerList(docSnap.docs.map((doc)=>({...doc.data(), id: doc.id})));
    console.log("Got followers list")
    }
    
  }catch(error){
          console.log(error);
        }
    }

  const handleButtonShowFollowers=async()=>{
try{
  if(showFollowing===false){
    await getStatus();
  await  getFollowersList();
  SetShowFollowers(!showFollowers);}
  else{
    SetShowFollowers(!showFollowers);
  }
  }
  catch(e){
    console.log(e.message)
  }
  
  }

  const handleButtonShowFollowing=async()=>{
    if(showFollowing===false){
    await getStatus();
    await getFollowingList();
    SetShowFollowing(!showFollowing)}
    else{
      SetShowFollowing(!showFollowing)
    }
  }
 
  return (<div className="Profile">
    <nav>
   
    <Header handleLogout={logout} ></Header>

    {options && 
      (<div  style={{position:'absolute', top:'22.5%',left:'75%', width:'fit-content', zIndex:'3', backgroundColor:'black'}}>
        <ul style={{justifyContent:'center'}}>
          
          {restricted ? (<button className='option' onClick={handleButtonUnRestrict}>UnRestrict</button>):(<button className='option' disabled={restricted} onClick={handleButtonRestrict}>Restrict</button>)}

          
          {muted? (<button className='option' onClick={handleButtonUnMute}>UnMute</button>):(<button className='option' disabled={muted} onClick={handleButtonMute}>Mute</button>)}
          
          
          {blocked ? (<button className='option' onClick={handleButtonUnBlock}>UnBlock</button>):(<button className='option' disabled={blocked} onClick={handleButtonBlock}>Block</button>)}
          
        </ul>
      </div>
  )} 

  {showFollowing && followingList !== null &&(
    <div className='list'>
  {followingList.map((res)=>
    {if (!(blockedList.includes(res.id)))
    return <div style={{width:'100%'}}>
    <List authorId={res.id} typ={followString}></List>
  </div>})}
  </div>)}
  
  {showFollowers && followerList!==null && (
      <div className='list'>
        {followerList.map((res)=>
    {if (!(blockedList.includes(res.id)))
  return <div style={{width:'100%'}}>
     <List authorId={res.id} typ={followString}></List>
  </div>}
  )}
      </div>
    )}


    {posts && focusImages && !grid && blocked!==null && !blocked &&
      (<div className="indPost">
      <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
      <div style={{width:'10%', display:'flex', flexDirection:'column'}}>

      <MdKeyboardBackspace style={{marginTop:'10%', width:'100%', height:'5%', cursor:'pointer'}} onClick={()=>{handleButtonClosePosts()}}>Back</MdKeyboardBackspace>
      <FcPrevious style={{color:'white', marginTop:'150%', width:'100%', cursor:'pointer'}} disabled={index === 0} onClick={()=>{goToPreviousPost()}}>Previous</FcPrevious>
      
      </div>
      <div style={{width:'80%'}}>
      <Post postid={postArray[index].id} name={name} authorId={postArray[index].authorID} captions={postArray[index].caption} url={postArray[index].url} profilePic={currentPicUrl} likes={postArray[index].likes} saves={postArray[index].saved} comments={postArray[index].comments} timeStamp={postArray[index].timeStamp} allowComments={postArray[index].allowComments}></Post>
      </div>
      <div style={{width:'10%', color:'white'}}><FcNext style={{color:'white', width:'100%', marginTop:'180%', cursor:'pointer'}} disabled={index === collectionSize - 1} onClick={()=>{goToNextPost()}}>Next</FcNext></div>
      </div>
      </div>)}

{blocked!==null && !blocked &&
    (<div className='firstTray'>
    <div className='rowPicnStat'>
    <div className='profilePic'>  
    <Avatar
    alt="preview image"
    src={currentPicUrl}
    sx={{ width: '100%', height: '100%'}}
    />
    </div>
    <div className='row'>
    <div className='column' >
      <div className='number'>{numberOfPosts}</div>
      <div className='category'>Posts</div>
    </div>
    <div className='column' onClick={()=>{handleButtonShowFollowers()}}>
      <div className='number'>{numberOFollowers}</div>
      <div className='category'>Followers</div>
    </div>
    <div className='column' onClick={()=>{handleButtonShowFollowing()}}>
      <div className='number'>{numberOFollowing}</div>
      <div className='category'>Following</div>
    </div>
    </div>  
    <div style={{height:'40px',width:'40px', backgroundColor:'black', color:'white'}}>
      <BiDotsVerticalRounded style={{width:'100%', height:'40px', cursor:'pointer'}} onClick={()=>{handleButtonOptions()}}/>
    </div>
    </div>
    <div className='columnBionButton'>
      <div className='name'>{name}</div>
      <p className='bio'>{bio}</p>
      {website && (<a href="www.google.com" target="_blank" rel="noreferrer" className='bio'>{website}</a>)}
     
     
      <div className='rowEditButton'>
      
       {!followLoading && !privateAccount &&
        (follow ? (<button className='editProfile' disabled={followLoading} onClick={handleButtonUnfollow}>UnFollow</button>):
        (<button className='editProfile' disabled={followLoading} onClick={handleButttonFollow}>Follow</button>))}


      {!followLoading && privateAccount && follow &&
        (<button className='editProfile' disabled={followLoading} onClick={handleButtonUnfollow}>UnFollow</button>)}

      {!followLoading && privateAccount && !follow &&
        ( !request ? (<button className='editProfile' disabled={followLoading} onClick={handleButttonRequest}>Request</button>):(
          <button className='editProfile' disabled={followLoading}>Requested</button>
        ))}
        
        {followLoading &&
        (<button className='editProfile'>
        {<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Please wait...</button>)}

      </div>


   
   
    </div>
    </div>
    )}

{blocked!==null && !blocked &&(
    <div className='secondTray'>
      <div className='rowCategory'>
      {focusImages ?
      (<FcGallery className='catIconFocused' onClick={handleButtonFocusImages}></FcGallery>):(
        <FcGallery className='catIcon' onClick={handleButtonFocusImages}></FcGallery>
      )}
      
      {focusVideos ?(<AiOutlineVideoCamera className='catIconFocused' onClick={handleButtonFocusVideos}></AiOutlineVideoCamera>)
      :(<AiOutlineVideoCamera className='catIcon' onClick={handleButtonFocusVideos}></AiOutlineVideoCamera>)}

    
      {focusTags ? (<AiFillTag className='catIconFocused' onClick={handleButtonFocusTags}></AiFillTag>)
      :(<AiFillTag className='catIcon' onClick={handleButtonFocusTags}></AiFillTag>)}
      
    
      </div>

{!privateAccount &&( 
      <div className='posts'>  
      {posts !== null && focusImages && grid && !loading && posts !== "null" &&
      (posts.map((post)=>
    {if(!post.deleted)  
      return <div id={post.url} className="indGrid" onClick={()=>{handleButtonSetGrid(post.id)}}>
       
      <GridImg name={name} captions={post.caption} url={post.url} authorId={post.authorID}></GridImg>
       
      </div>
    })
  )}  

{posts !== null && focusImages && grid && !loading && posts === "null" &&
      (<div style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>
       {name}{' '} hasn't posted anything yet.
      </div>
  )}  

{loading &&  (
      <div style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>
{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Getting Posts.....
      
      </div>
      
      )}  
 </div>)};

 {privateAccount && follow && ( 
      <div className='posts'>  
      {posts !== null && focusImages && grid && !loading && posts !== "null" &&
      (posts.map((post)=>
    { if(!post.deleted)  
      return <div id={post.url} className="indGrid" onClick={()=>{handleButtonSetGrid(post.id)}}>
      <GridImg name={name} captions={post.caption} url={post.url} authorId={post.authorID}></GridImg>
      </div>
    })
  )}  

{posts !== null && focusImages && grid && !loading && posts === "null" &&
      (<div style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>
       {name}{' '} hasn't posted anything yet.
      </div>
  )}  

{loading &&  (
      <div style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>
{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Getting Posts.....
      
      </div>
      
      )}  
 </div>)};


{privateAccount && !follow && ( 
      <div className='posts'>  
      <div style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>
       Follow {name} to see their posts.
      </div>
 </div>)};
 
 
 
 
 
    </div>)}

    {blocked!==null && blocked &&(
      <div style={{alignContent:'center', color:'white'}}>
     <div style={{display:'flex', flexDirection:'column',paddingTop:'200px',alignContent:'center', color:'white'}}>
      <h1 style={{textAlign:'center', color:'white'}}>Sorry, this page isn't available..</h1>
      <h5 style={{textAlign:'center'}}>The link you followed may be broken, or the page may have been removed.</h5>
      </div>
      </div>
    )}
 
    </nav>
  </div>);
}

export default  Profile;