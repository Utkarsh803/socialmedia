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
import {FcGallery} from 'react-icons/fc';
import GridImg from './GridImg';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import React from 'react';
import {useParams} from 'react-router-dom'

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
    const[privateAccount, SetPrivateAccount]= useState(false);
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


    const[follow, SetFollow]=useState(null);
    const[myFollow, SetMyFollow]=useState(null);
    const[following, SetFollowing]=useState(null);
    
    useEffect(()=>{

      SetCurrentPicUrl(null);
      const getUsersData = () => {
        const q = query(docRef);
        onSnapshot(q,docSnap=>{
          setName(docSnap.data().name);
          SetUserName(docSnap.data().username);
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
      const q = query(postsCollectionRef,orderBy('timeStamp', 'desc'))
      onSnapshot(q, querySnapshot=>{
        SetPosts(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
      })
    }

    const getFollow=async()=>{
      try{
      const docR = doc(db, `users/${auth.currentUser.uid}/followingList`, `${uid}`)    
      const docSnap =  await getDoc(docR);
      {docSnap.exists() ? (SetFollow(true)):(SetFollow(false))}
    }
          catch(error){
            console.log(error);
          }
      }

    getFollow();
    getFollowStats();
    getUsersData();
    getUserPost();
  }, [uid] );



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

      const handleButttonFollow = async()=>{
        SetFollow(true);
        try{
        const followRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${uid}`)

        await setDoc(followRef,{
            timeStamp:serverTimestamp(),
        });
        console.log("You are now folowing"+name);

        const followingRef = doc(db, `users/${uid}/followerList`, `${auth.currentUser.uid}`)

        await setDoc(followingRef,{
            timeStamp:serverTimestamp()
        });
        console.log(uid+"has a new follower.");
    }
        catch(error){
            console.log(error);
        }
        increaseFollower();

        const NotRef = collection(db, `users/${uid}/notifications`);
         await addDoc(NotRef,{
          type:"follow",
          content:"started following you.",
          author:auth.currentUser.uid,
          timeStamp:Timestamp.fromDate(new Date()),
        })
        console.log("Posted a notification about a follow.")
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
        SetFollow(false);
        try{
        const followRef = doc(db, `users/${auth.currentUser.uid}/followingList`, `${uid}`)

        await deleteDoc(followRef);
        console.log("You are not following"+name+" anymore");

        const followingRef = doc(db, `users/${uid}/followerList`, `${auth.currentUser.uid}`)

        await deleteDoc(followingRef);
        console.log(uid+"has one less follower.");
    }
        catch(error){
            console.log(error);
        }
        decreaseFollower();
        deleteFeed();
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


  const handleButtonSetGrid=()=>{
    SetGrid(!grid);
  }

  const handleButtonEditProfile=()=>{
    navigate("/settings");
  }
 
  return (<div className="Profile">
    <nav>
    <div className='divider'>
    <Header handleLogout={logout} ></Header>
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
    </div>
    <div className='columnBionButton'>
      <div className='name'>{name}</div>
      <p className='bio'>{bio}</p>
      {website && (<a href="www.google.com" target="_blank" rel="noreferrer" className='bio'>{website}</a>)}
      <div className='rowEditButton'>
      
        {follow ? (<button className='editProfile' onClick={handleButtonUnfollow}>UnFollow</button>):(<button className='editProfile' onClick={handleButttonFollow}>Follow</button>)}
        
      </div>
    </div>
    </div>
    <div className='space05'></div>
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
      <div className='posts'>  
      {posts && focusImages && grid &&
      (posts.map((post)=>
    {return <div id={post.url} className="indGrid" onClick={handleButtonSetGrid}>
      <GridImg name={name} captions={post.caption} url={post.url} authorId={post.authorID}></GridImg>
      </div>
    })
  )}  

{posts && focusImages && !grid &&
      (posts.map((post)=>
    {return <div className="indPost">
      <Post postid={post.id} name={name} authorId={post.authorID} captions={post.caption} url={post.url} profilePic={currentPicUrl} likes={post.likes} saves={post.saved} comments={post.comments} timeStamp={post.timeStamp}></Post>
      </div>
    })
  )} 


 
  </div>
    </div>
    </div>
    </nav>
  </div>);
}

export default  Profile;