import './css/Header.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart,AiOutlineHome, AiFillSetting, AiOutlineVideoCameraAdd,AiOutlineCloseCircle} from 'react-icons/ai';
import {BiImageAdd, BiMessageRounded, BiHelpCircle} from 'react-icons/bi';
import {FaRegBookmark , FaUserAltSlash}from 'react-icons/fa';
import logo from'./mslogo.jpg';
import {useState, useEffect} from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, serverTimestamp} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import Settings from './Settings';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import {v4} from 'uuid'


function Header({handleLogout, name}) {

  const[profileMenu, SetProfileMenu]=useState(false);
  const[addPost, SetAddPost]=useState(false);
  const[upload, SetUpload]=useState(false);
  const[image, SetImage]=useState(null);
  const[next, SetNext]=useState(false);
  const[caption, SetCaption]=useState(null);
  const[imageFile, SetImageFile]=useState(null);
  const[percent, SetPercent]=useState(0);
  const[postID, SetPostID]=useState(null);
  const[url, SetUrl]=useState(null);

  let navigate = useNavigate(); 
  
  
  
  const addToStorage = async(imgName) =>{

  if (imageFile == null) {
      window.alert("Please choose a file first!");
      return;
  }

  try{
  const storageRef = ref(storage, `/${auth.currentUser.uid}/${imgName}`);
  SetUrl(imgName);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
        const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        SetPercent(percent);
    },
    (err) => console.log(err),
    () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          console.log(imgName);
        });
    }
); 
console.log('image upload successful!');
}

catch(error){
  console.log(error);
}
}

  

  function goToMyProfile() {
    navigate("/myprofile");
  }

  function goToSettings() {
    navigate("/settings");
  }

  function goToHome() {
    navigate("/");
  }



  function handleButtonProfileMenu() {
    SetProfileMenu(!profileMenu);
  }

  function handleButtonAddPost() {
    SetAddPost(!addPost);
  }

  function handleButtonUploadImage() {
    SetImage(null);
    SetImageFile(null);
    SetAddPost(false);
    SetUpload(!upload);
    SetNext(false);
  }

  function handleButtonClose() {
    SetImage(null);
    SetImageFile(null);
    SetAddPost(false);
    SetUpload(false);
    SetNext(false);
  }

  
  const handleButtonNext = async() => {
    await createPost();
    SetUpload(false);
    SetNext(false);
    SetImage(null);
    SetImageFile(null);
    SetPercent(0);
    SetUrl(null);
    SetCaption(null);
    
  }

  function handleButtonUpload() {
    SetUpload(!upload);
    SetNext(!next);
    
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      SetImage(URL.createObjectURL(event.target.files[0]));
      SetImageFile(event.target.files[0]);
    }
   }

   const createPost = async() =>{
    try
    {  
       const imageName = imageFile.name + v4();
       await addToStorage(imageName);
       const usersCollectionRef = collection(db,  `/users/${auth.currentUser.uid}/posts`);
       const addedDoc = await addDoc (usersCollectionRef, {
        author: "Utkarsh",
        authorID: auth.currentUser.uid,
        likes:0,
        comments:0,
        caption:caption,
        url:imageName,
        reported:0,
        saved:0,
        timeStamp:serverTimestamp(),
        });       
        createLikeList(addedDoc.id);
        createCommentList(addedDoc.id);
        console.log("You have created your first post!!Its id is "+ addedDoc.id);   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Post was not created :("); 
   }
   }

   const createLikeList = async(postId) =>{
    try
    {  
      await setDoc(doc(db,  `/users/${auth.currentUser.uid}/likes`, `${postId}`), {
        totalLikes:0,
       });         
        console.log("A like list was created for the post: "+ postId);   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Post list could not be created. Try Again :("); 
   }
   }

   const createCommentList = async(postId) =>{
    try
    {  
       await setDoc(doc(db,  `/users/${auth.currentUser.uid}/comments`, `${postId}`), {
        totalComments:0,
       });       
        console.log("A comment list was created for the post: "+ postId);   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Post comment could not be created. Try Again :("); 
   }
   }



  return (<div className="Header">

    <img src={logo} className="logo" />
    <input placeholder='search...'></input>
    
    <AiOutlineHome className='icons' onClick={goToHome}/>
    
    <BiImageAdd className='icons'  onClick={handleButtonAddPost}/>
    {addPost && (
    <div class="middletray">
        <button className='addMedia' onClick={handleButtonUploadImage}> <BiImageAdd className='selectionIcon' />  Add Image</button>
        <button className='addMedia'><AiOutlineVideoCameraAdd className='selectionIcon' /> Add Video</button>
    </div>
  )}

  {upload && (   
 <div class="uploadtray">
  <AiOutlineCloseCircle onClick={handleButtonUploadImage} className="closeButton"></AiOutlineCloseCircle>
<div className='chooseAndDisplay'>
  <input type="file" className='chooseImage' onChange={onImageChange} ></input>
</div>
{image &&(<img src={image} alt="preview image" className='preview' />)}
  <button className="uploadImage" onClick={handleButtonUpload}>Next</button>
</div>
  )}

{next&& (   
 <div class="uploadtray">
  <AiOutlineCloseCircle onClick={handleButtonClose} className="closeButton"></AiOutlineCloseCircle>  
<div className='flex-column'>
{image &&(<img src={image} alt="preview image" className='previewSmall' />)}
<textarea placeholder='Type yor caption...' className='captionInput' onChange={(event)=>{SetCaption(event.target.value)}}>
</textarea>
  </div>
  <button className="uploadImage" onClick={handleButtonNext}>Post</button><p>{percent}% done</p>
</div>
  )}

    
    <AiOutlineHeart className='icons'/>
    
    <BiMessageRounded className='icons'/>
    
    <CgProfile className='icons' onClick={handleButtonProfileMenu}/>
    {profileMenu && (
    <div class="dropdown">
      <ul>
        <button className='selection'  onClick={goToMyProfile}> <CgProfile className='selectionIcon'/>  My Profile</button>
        <button className='selection' onClick={goToSettings}><AiFillSetting className='selectionIcon' />  Settings</button>
        <button className='selection'><FaRegBookmark className='selectionIcon' /> Saved</button>
        <button className='selection'><BiHelpCircle className='selectionIcon'/>  Help Center</button>
        <button className='selection' onClick={handleLogout}>Logout</button>
      </ul>
    </div>
  )}

    
  
  </div>);
}

export default Header;