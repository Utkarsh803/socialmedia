import './css/Header.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart,AiOutlineHome, AiFillSetting, AiOutlineVideoCameraAdd,AiOutlineCloseCircle} from 'react-icons/ai';
import {BiImageAdd, BiMessageRounded, BiHelpCircle} from 'react-icons/bi';
import {FaRegBookmark , FaUserAltSlash}from 'react-icons/fa';
import logo from'./mslogo.jpg';
import {useState, useEffect} from "react";
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import Settings from './Settings';

function Header({handleLogout, name}) {

  const[profileMenu, SetProfileMenu]=useState(false);
  const[addPost, SetAddPost]=useState(false);
  const[upload, SetUpload]=useState(false);
  const[image, SetImage]=useState();
  const[next, SetNext]=useState(false);
  const[caption, SetCaption]=useState(null);

  let navigate = useNavigate(); 

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
    SetAddPost(false);
    SetUpload(!upload);
    SetNext(false);
  }

  function handleButtonClose() {
    SetImage(null);
    SetAddPost(false);
    SetUpload(false);
    SetNext(false);
  }

  
  function handleButtonNext() {
    SetUpload(!upload);
    SetNext(!next);
  }

  function handleButtonUpload() {
    
    
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      SetImage(URL.createObjectURL(event.target.files[0]));
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
  <button className="uploadImage" onClick={handleButtonNext}>Next</button>
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
  <button className="uploadImage" onClick={handleButtonNext}>Post</button>
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