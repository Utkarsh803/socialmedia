import './css/MyProfile.css';
import Header from'./Header.js';
import Post from'./Post.js';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc} from 'firebase/firestore';
import {signOut, onAuthStateChanged} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Avatar from '@mui/material/Avatar';
import {AiFillTag, AiOutlineVideoCamera} from 'react-icons/ai';
import {FcGallery} from 'react-icons/fc';
import GridImg from './GridImg';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';



function MyProfile() {

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

    const [focusImages, SetFocusImages]=useState(true);
    const [focusVideos, SetFocusVideos]=useState(false);
    const [focusTags, SetFocusTags]=useState(false);

    const docRef = doc(db, "users", auth.currentUser.uid);
    let navigate = useNavigate(); 

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
  
    const getProfilePic= async()=>{
  
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      
    getDownloadURL(ref(storage, `${auth.currentUser.uid}/${docSnap.data().profilePic}`))
    .then((url) => {
      SetCurrentPicUrl(url);
      console.log("Profile Pic Downloaded");
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


    const postsCollectionRef = collection(db, `users/${auth.currentUser.uid}/posts`);


    useEffect(()=>{
      const getUsersData = async () => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().name);
          SetUserName(docSnap.data().username);
          SetBio(docSnap.data().bio);
          SetPhone(docSnap.data().phone);
          SetEmail(docSnap.data().email);
          SetGender(docSnap.data().gender);
          SetWebsite(docSnap.data().website);
          SetGetEmail(docSnap.data().getEmail);
          SetGetSms(docSnap.data().getSms);
          SetPrivateAccount(docSnap.data().private);
          SetTwoFactor(docSnap.data().twoFactor);
          SetCurrentPic(docSnap.data().profilePic);
          SetNumberOfFollowers(docSnap.data().followers);
          SetNumberOfFollowing(docSnap.data().following);
          SetNumberOfPosts(docSnap.data().posts);
          
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
    };

    const getUserPost =async()=>{
      const data = await getDocs(postsCollectionRef);
      SetPosts(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
    }

   try{
    getProfilePic();
   }
   catch(error){
    console.log(error);
   }
    getUsersData();
    getUserPost();
    }, [] );

  const logout = async () =>
  {
          await signOut(auth);
          navigate("/");

  }

  function getPostPic(imgName){
  getDownloadURL(ref(storage, `${auth.currentUser.uid}/${imgName}`))
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

  const handleButtonEditProfile=()=>{
    navigate("/settings");
  }
 
  return (<div className="MyProfile">
    <nav>
    <div className='divider'>
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
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
        <button className='editProfile' onClick={handleButtonEditProfile}>Edit Profile</button>
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
      
      {posts && focusImages &&
      (posts.map((post)=>
    {return <div className="indPost">
      <GridImg name={name} captions={post.caption} url={post.url} ></GridImg>
      </div>
    })
  )}  
 
  </div>
    </div>
    </div>
    </nav>
  </div>);
}

export default  MyProfile;