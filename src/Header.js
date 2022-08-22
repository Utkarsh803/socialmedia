import './css/Header.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart,AiOutlineHome, AiFillSetting, AiOutlineVideoCameraAdd,AiOutlineCloseCircle} from 'react-icons/ai';
import {BiImageAdd, BiMessageRounded, BiHelpCircle} from 'react-icons/bi';
import {FaRegBookmark , FaUserAltSlash}from 'react-icons/fa';
import logo from'./mslogo.jpg';
import {useState, useEffect} from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, getDoc,addDoc, updateDoc, deleteDoc, doc, setDoc, serverTimestamp} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import Settings from './Settings';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import {v4} from 'uuid'
import { query, where, orderBy, limit } from "firebase/firestore";  
import SearchResult from './SearchResult';
import NotifLike from './NotifLike';



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
  const[searchRes, SetSearchRes]=useState(null);
  const[viewNotif, SetViewNotif]=useState(null);
  const[Notif, SetNotif]=useState(null);
  const[searchInput, SetSearchInput]=useState(null);
  const[followersList, SetFollowersList]=useState(null);
  const[numPosts, SetNumPosts]=useState(null);

  let navigate = useNavigate(); 
 
  
  useEffect(()=>{
    getPostsStats();
    getNotif();
    }, [] );

    const getNotif= async()=>{
      try{
      const notifRef = collection(db, `users/${auth.currentUser.uid}/notifications`);
      const data = await getDocs(notifRef);
      if(data.size>0){
      SetNotif(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
      }
      else{
        SetNotif(null);
      }
    }
    catch(error)
    {
      console.log(error);
    }
    }




   const search = async(name) =>{
    SetSearchInput(name);
    console.log(name);
    if(name != ''){
    const citiesRef = collection(db, "users");
    const q = query(citiesRef, where("username", ">=", `${name}`), where("username", "<=", `${name + "~"}`), limit(3));
    const querySnapshot = await getDocs(q);
      SetSearchRes(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
    }
    else{
      SetSearchRes(null);
    }
  }
  
  const getPostsStats=async()=>{
    const docRef = doc(db, `users`,`${auth.currentUser.uid}`)
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
        SetNumPosts(docSnap.data().following);
        console.log("this many posts"+docSnap.data().posts);
    }
    else{
            console.log("error");
    }
    }

    const increasePosts=async()=>{
      try{
      const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
      const newfield1 = {posts: numPosts + 1};
      SetNumPosts(numPosts+1);
      await updateDoc(followingdocRef,newfield1);
      console.log("Post stats updated.");
      }
      catch(error){
          console.log(error);
      }
  }

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

  const addToFeed=async(postid)=>{
    try {
    const followerRef = collection(db, `users/${auth.currentUser.uid}/followerList`);
    const data = await getDocs(followerRef);
    
    data.forEach((docc) => {

      console.log(docc.id, " => ", docc.data());
      const feedRef = doc(db, `feed/${docc.id}/posts`, `${postid}`);

      setDoc(feedRef, {
        added:serverTimestamp(),
        author:auth.currentUser.uid,
        postID:postid,
      });

     // SetFollowersList(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
     console.log("Added doc to"+ docc.id +"'s feed.");  
    });
  
  }
  catch(error){
    console.log(error);
  }
  }


   const createPost = async() =>{
    try
    {  
      const hashtagArray = caption.match(/#[\p{L}]+/ugi);
      console.log("This post has hashtags"+hashtagArray);
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
        tags:hashtagArray,
        timeStamp:serverTimestamp(),
        });       
        addToAlbum(addedDoc.id, imageName);
        createLikeList(addedDoc.id);
        createCommentList(addedDoc.id);
        addToFeed(addedDoc.id);
        increasePosts();
        console.log("Post ID : "+ addedDoc.id);   
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

   const  addToAlbum = async(postId, url) =>{
    try
    {  
      await setDoc(doc(db,  `/users/${auth.currentUser.uid}/album`, `${postId}`), {
        img:url,
       });         
        console.log("Image added to album with url : "+ url);   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Image could not be added to album. Try Again :("); 
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

   const addToFollowerList = async(uid) =>{
    try
    {  
      await setDoc(doc(db,  `/users/${auth.currentUser.uid}/followers`, `${uid}`), {
        totalFollowers:0,
       });         
        console.log("A Follower list was created for the post: ");   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Follower list could not be created. Try Again :("); 
   }
   }

   
   const addToFollowingList = async(uid) =>{
    try
    {  
        await setDoc(doc(db,  `/users/${auth.currentUser.uid}/following`, `${uid}`), {
            totalFollowing:0,
           });        
        console.log("A Following list was created for the post: ");   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Following list could not be created. Try Again :("); 
   }
   }

   
   const addToSavedList = async(uid) =>{
    try
    {  
        await setDoc(doc(db,  `/users/${auth.currentUser.uid}/saved`, `${uid}`), {
            totalSaves:0,
           });        
        console.log("A Savedlist was created for the post: ");   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Saved list could not be created. Try Again :("); 
   }
   }
   const addToBlockedList = async(uid) =>{
    try
    {  
      await setDoc(doc(db,  `/users/${auth.currentUser.uid}/blocked`, `${uid}`), {
        totalBlocked:0,
       });         
        console.log("A Blocked list was created for the post: ");   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Blocked list could not be created. Try Again :("); 
   }
   }

   const addToRestricetedList = async(uid) =>{
    try
    {  
      await setDoc(doc(db,  `/users/${auth.currentUser.uid}/restricted`, `${uid}`), {
        totalRestricted:0,
       });         
        console.log("A Restricted list was created for the post: ");   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Restricted list could not be created. Try Again :("); 
   }
   }

   
   const addToMutedList = async(uid) =>{
    try
    {  
      await setDoc(doc(db,  `/users/${auth.currentUser.uid}/muted`, `${uid}`), {
        totalMuted:0,
       });         
        console.log("A Muted list was created for the post: ");   
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Muted list could not be created. Try Again :("); 
   }
   }


   const handleButtonNotif=()=>{
    SetViewNotif(!viewNotif);
   }


   const goToSavedPosts=()=>{
    navigate("/saved-posts");
   }

   const handleButtonChats=()=>{
    navigate("/chats");
   }

  return (<div className="Header">

    <h1 style={{fontSize:'xxx-large', marginLeft:'4%', marginRight:'9%', marginTop:'1.7%'}}>Lyfy</h1>

  
   <div style={{ display:'flex', flexDirection:'column', width:'57%', backgroundColor:'black', color:'white'}}>
    <input style={{width:'60%', marginTop:'5%', backgroundColor:'white', borderRadius:'1%', color:'white'}} placeholder='search...' onChange={(event)=>search(event.target.value)}></input>
    {searchRes && 
    (
    searchRes.map((res)=>
    {return <div  style={{width:'60%', marginLeft:'4%'}}>
     <SearchResult name={res.username} authorId={res.id} url={res.profilePic}></SearchResult>
      </div>;
    })
    )}
    </div>
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
  <button className="uploadImage" onClick={handleButtonNext}>Post</button><p style={{backgroundColor:'black', color:'white'}}>{percent}% done</p>
</div>
  )}

    
    <AiOutlineHeart className='icons' onClick={handleButtonNotif}/>
        
        {viewNotif && Notif && (
        <div className='NotifTray'>
         {( Notif.map((res)=>
            {return <div>
             <NotifLike authorId={res.author} content={res.content} postid={res.postid} timestamp={res.timeStamp} type={res.type}></NotifLike>
              </div>;
            })
            )
    }
    </div>
    )}
    
    
            
        {viewNotif && (Notif==null) && (
        
          (
            <div class="NotifTray">
           <div  style={{display:'relative', width:'100%', backgroundColor:'black', color:'white', padding:'5%'}}>
             <div style={{display:'relative', width:'100%', backgroundColor:'black', color:'white', textAlign:'center'}}>No Notifications.</div>
              </div>
              </div>
            )
         )}
        
     
    <BiMessageRounded className='icons'onClick={handleButtonChats}/>
    
    <CgProfile className='icons' onClick={handleButtonProfileMenu}/>
    {profileMenu && (
    <div class="dropdown">
      <ul style={{background:'black', height:'fit-content'}}>
        <button className='selection'  onClick={goToMyProfile}> <CgProfile className='selectionIcon'/>  My Profile</button>
        <button className='selection' onClick={goToSettings}><AiFillSetting className='selectionIcon' />  Settings</button>
        <button className='selection'  onClick={goToSavedPosts}><FaRegBookmark className='selectionIcon' /> Saved</button>
        <button className='selection'><BiHelpCircle className='selectionIcon'/>  Help Center</button>
        <button className='selection' onClick={handleLogout}>Logout</button>
      </ul>
    </div>
  )}

    
  
  </div>);
}

export default Header;