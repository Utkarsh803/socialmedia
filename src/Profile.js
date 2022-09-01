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



function Profile() {

   
    const {uid} =useParams();
    console.log("Welcome to", {uid});

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

    const[blocked, SetBlocked]= useState(false);
    const[muted, SetMuted]= useState(false);
    const[restricted, SetRestricted]= useState(false);


    const[follow, SetFollow]=useState(false);
    const[request, SetRequest]=useState(false);
    const[myFollow, SetMyFollow]=useState(null);
    const[following, SetFollowing]=useState(null);
    const [postArray, SetPostArray]=useState(null);
    const [index, SetIndex]=useState([]);
    const[collectionSize, SetCollectionSize]=useState();
    
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
  
      const restrictRef = doc(db, `users/${auth.currentUser.uid}/restrictedUsers`, `${uid}`)
      const resSnap = await getDoc(restrictRef);
      if(resSnap.exists()){ 
      SetRestricted(true);
    }
  
      const blockRef = doc(db, `users/${auth.currentUser.uid}/blockedUsers`, `${uid}`)
      const blockSnap = await getDoc(blockRef);
      if(blockSnap.exists()){ 
      SetBlocked(true);
      }
    }


    getStatus();
    getFollowStats();
    getUsersData();
    getFollow();
    getUserPost();
    if(privateAccount && !follow){
      getRequested();
    }
  }, [uid, index] );



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
    SetBlocked(true);
    const blockRef = doc(db, `users/${auth.currentUser.uid}/blockedUsers`, `${uid}`)
    await setDoc(blockRef, {
      createdAt:serverTimestamp(),
    })
    console.log("blockeded")
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
  console.log("unblocked")
  }


  const handleButtonOptions=()=>{
    console.log("open");
    SetOptions(!options);
  }

  const handleButtonEditProfile=()=>{
    navigate("/settings");
  }
 
  return (<div className="Profile">
    <nav>
   
    <Header handleLogout={logout} ></Header>

    {options && 
      (<div  style={{position:'absolute', top:'22.5%',left:'75%', width:'fit-content', zIndex:'3', backgroundColor:'black'}}>
        <ul style={{justifyContent:'center'}}>
          
          {restricted ? (<button className='option' onClick={handleButtonUnRestrict}>UnRestrict</button>):(<button className='option' onClick={handleButtonRestrict}>Restrict</button>)}

          
          {muted? (<button className='option' onClick={handleButtonUnMute}>UnMute</button>):(<button className='option' onClick={handleButtonMute}>Mute</button>)}
          
          
          {blocked ? (<button className='option' onClick={handleButtonUnBlock}>UnBlock</button>):(<button className='option' onClick={handleButtonBlock}>Block</button>)}
          
        </ul>
      </div>
  )} 

    {posts && focusImages && !grid &&
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
      </div>
  )} 

    <div className='firstTray'>
    <div className='rowPicnStat'>
    <div className='profilePic'>  
    <Avatar
    alt="preview image"
    src={currentPicUrl}
    sx={{ width: 156, height: 156}}
    />
    </div>
    <div className='row'>
    <div className='column'>
      <div className='number'>{numberOfPosts}</div>
      <div className='category'>Posts</div>
    </div>
    <div className='column'>
      <div className='number'>{numberOFollowers}</div>
      <div className='category'>Followers</div>
    </div>
    <div className='column'>
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
 
 
 
 
 
    </div>
 
    </nav>
  </div>);
}

export default  Profile;