import './css/Header.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart,AiOutlineHome, AiFillSetting, AiOutlineVideoCameraAdd,AiOutlineCloseCircle} from 'react-icons/ai';
import {BiImageAdd, BiMessageRounded, BiHelpCircle} from 'react-icons/bi';
import {FaRegBookmark , FaUserAltSlash}from 'react-icons/fa';
import logo from'./mslogo.jpg';
import {useState, useEffect} from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, getDoc,addDoc, updateDoc, deleteDoc, doc, setDoc, serverTimestamp, Timestamp,onSnapshot} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import Settings from './Settings';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import {v4} from 'uuid'
import { query, where, orderBy, limit } from "firebase/firestore";  
import SearchResult from './SearchResult';
import NotifLike from './NotifLike';
import SearchResultHash from './SearchResHash';
import React, {useRef} from 'react';
import { runTransaction } from "firebase/firestore";



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
  const[searchResHash, SetSearchResHash]=useState(null);
  const[viewNotif, SetViewNotif]=useState(null);
  const[Notif, SetNotif]=useState(null);
  const[searchInput, SetSearchInput]=useState(null);
  const[followersList, SetFollowersList]=useState(null);
  const[numPosts, SetNumPosts]=useState(null);

  let navigate = useNavigate(); 
  let notifRef = useRef();
  let profileRef = useRef();
  let addPostRef= useRef();
  let uploadRef= useRef();
  let nextRef= useRef();
  let searchRef= useRef();
  let searchRefHash= useRef();
 
  
  useEffect(()=>{

    let handler = (event)=>{
      if(!notifRef.current.contains(event.target)){
      SetViewNotif(false);}
    }

    let handler2 = (event)=>{
      if(!profileRef.current.contains(event.target)){
      SetProfileMenu(false);}
    }

    let handler3 = (event)=>{
      if(!addPostRef.current.contains(event.target)){
        handleButtonUploadImage();
      SetAddPost(false);}
    }
    let handler4 = (event)=>{
      if(!uploadRef.current.contains(event.target)){
        handleButtonUploadImage();
      SetUpload(false);}
    }
    let handler5 = (event)=>{
      if(!nextRef.current.contains(event.target)){
        handleButtonClose();
      SetNext(false);}
    }
    let handler6 = (event)=>{
      if(!searchRef.current.contains(event.target)){
      SetSearchRes(false);}
    }
    let handler7 = (event)=>{
      if(!searchRefHash.current.contains(event.target)){
      SetSearchResHash(false);}
    }

    document.addEventListener("mousedown", handler);
    document.addEventListener("mousedown", handler2);
    document.addEventListener("mousedown", handler3);
    document.addEventListener("mousedown", handler4);
    document.addEventListener("mousedown", handler5);
    document.addEventListener("mousedown", handler6);
    document.addEventListener("mousedown", handler7);


    getPostsStats();
    getNotif();
    return()=>{
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("mousedown", handler2)
      document.removeEventListener("mousedown", handler3)
      document.removeEventListener("mousedown", handler4)
      document.removeEventListener("mousedown", handler5)
      document.removeEventListener("mousedown", handler6)
      document.removeEventListener("mousedown", handler7)
    }
    }, [] );

    const getNotif= async()=>{
      try{
      const notifRef = collection(db, `users/${auth.currentUser.uid}/notifications`);
      const q = query(notifRef,orderBy('timeStamp', 'desc'))
      onSnapshot(q, querySnapshot=>{
        SetNotif(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
      })
    

    }
    catch(error)
    {
      console.log(error);
    }
    }


   const search = async(name) =>{
    SetSearchInput(name);
    const charact = name.substring(0,1);
    if(charact !== '#'){
    console.log(name);
    if(name != '' && name!=null){
    const citiesRef = collection(db, "users");
    const q = query(citiesRef, where("username", ">=", `${name}`), where("username", "<=", `${name + "~"}`), limit(3));
    const querySnapshot = await getDocs(q);
      SetSearchRes(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
      SetSearchResHash(null);
    }
    else{
      SetSearchRes(null);
    }}
    else{

      console.log(name);
    if(name != ''){
    const citiesRef = collection(db, "hashtags");
    const q = query(citiesRef, where("tag", ">=", `${name}`), where("tag", "<=", `${name + "~"}`), limit(3));
    const querySnapshot = await getDocs(q);
      SetSearchResHash(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
      SetSearchRes(null);
        }
    else{
      SetSearchResHash(null);
    }
    }
  
  
  }
  
  const getPostsStats=async()=>{
    const docRef = doc(db, `users`,`${auth.currentUser.uid}`)

    const q = query(docRef);
    onSnapshot(q, querySnapshot=>{
      SetNumPosts(querySnapshot.data().posts);
      console.log("NUm of posts",querySnapshot.data().posts);
    })


    }

    const increasePosts=async()=>{
      try{
      const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
      const newfield1 = {posts: numPosts + 1};
      await updateDoc(followingdocRef,newfield1);
      console.log("Post stats updated.");
      SetNumPosts(numPosts+1);
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

  function goToHome() {
    navigate("/");
  }


  function goToSettings() {
    navigate("/settings");
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
    console.log("Height", imageFile.height)
    console.log("Weight", imageFile.width )
    if(imageFile.width==imageFile.height){
    await createPost();
  }else{
    console.log("File resolution not supported")
  }
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
      console.log("Height", (event.target.files[0]).size)

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
        added:Timestamp.fromDate(new Date()),
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
    const hashtagArray = caption.match(/#[\p{L}]+/ugi);
    console.log("This post has hashtags"+hashtagArray);
    const imageName = imageFile.name + v4();
    try
    {
    await runTransaction(db, async (transaction) => { 
      console.log("Step0")   
      const followerRef = collection(db, `users/${auth.currentUser.uid}/followerList`);
      const data = await getDocs(followerRef);
      console.log("Step1")

      var arr=[];
      for(const hash of hashtagArray){
        const hashRef= doc(db, "hashtags", `${hash}`);
        const hashVal = await transaction.get(hashRef);
        arr.push({hashVal:hashVal, hashRef:hashRef, hash:hash});
      }
      console.log("Step2")

       await addToStorage(imageName);
       console.log("Step2i")
       const usersCollectionRef = doc(collection(db,  `/users/${auth.currentUser.uid}/posts`));
       console.log("Step2ii")
       const addedDoc =  transaction.set(usersCollectionRef, {
        authorID: auth.currentUser.uid,
        likes:0,
        comments:0,
        caption:caption,
        url:imageName,
        reported:0,
        saved:0,
        tags:hashtagArray,
        timeStamp:Timestamp.fromDate(new Date()),
        });       

        console.log("Step3")

      var a=0;
      for(const hashVal of arr ){
      console.log(arr[a].hashVal)
      
        if((arr[a].hashVal).exists()){
          console.log("Hashtag exists "+ arr[a].hash);
          transaction.update(arr[a].hashRef, {val:(arr[a].hashVal).data().val+1});
        
          const pid = auth.currentUser.uid + usersCollectionRef.id;
          transaction.set(doc(db, `hashtags/${arr[a].hash}/posts/`, `${pid}`),{
            authorId:auth.currentUser.uid,
            postId:usersCollectionRef.id,
            likes:0,
            comments:0,
            saves:0,
            reported:0,
            createdAt:Timestamp.fromDate(new Date()),
          });
        
        }
        else{
          console.log("Hashtag does not exists "+ arr[a].hash);
          transaction.set(doc(db, `hashtags`, `${arr[a].hash}`), {
            tag:arr[a].hash,
            val:1,
           });}

           const pid = auth.currentUser.uid + usersCollectionRef.id;

            transaction.set(doc(db, `hashtags/${arr[a].hash}/posts`, `${pid}`),{
            authorId:auth.currentUser.uid,
            postId:usersCollectionRef.id,
            likes:0,
            comments:0,
            saves:0,
            reported:0,
            createdAt:Timestamp.fromDate(new Date()),
          });

          console.log("added post to hastag array")
          a=a+1;
        }
        console.log("Step4")
        
         transaction.set(doc(db,  `/users/${auth.currentUser.uid}/album`, `${usersCollectionRef.id}`), {
          img:imageName,
         });         
          console.log("Image added to album with url : "+ imageName);   
          
       // createLikeList(addedDoc.id);
        
         transaction.set(doc(db,  `/users/${auth.currentUser.uid}/likes`, `${usersCollectionRef.id}`), {
          totalLikes:0,
         });         
          console.log("A like list was created for the post: "+usersCollectionRef.id);   

      //  createCommentList(addedDoc.id);

        transaction.set(doc(db,  `/users/${auth.currentUser.uid}/comments`, `${usersCollectionRef.id}`), {
          totalComments:0,
         });       
          console.log("A comment list was created for the post: "+ usersCollectionRef.id); 
      
      
      
      //addToFeed(addedDoc.id);
      
      data.forEach((docc) => {
  
        console.log(docc.id, " => ", docc.data());
        const feedRef = doc(db, `feed/${docc.id}/posts`, `${usersCollectionRef.id}`);
  
        transaction.set(feedRef, {
          added:Timestamp.fromDate(new Date()),
          author:auth.currentUser.uid,
          postID:usersCollectionRef.id,
        })  
       // SetFollowersList(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
       console.log("Added doc to"+ docc.id +"'s feed.");  
      });
      
      
        //increasePosts();

        const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
        const newfield1 = {posts: numPosts + 1};
        transaction.update(followingdocRef,newfield1);
        console.log("Post stats updated.");
        SetNumPosts(numPosts+1);
        console.log("Post ID : "+ usersCollectionRef.id);
        })
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

    <h1 style={{fontSize:'xxx-large', marginLeft:'4%', marginRight:'9%', marginTop:'1.7%'}} className='pointer'  onClick={goToHome}>Lyfy</h1>

  
   <div style={{ display:'flex', flexDirection:'column', width:'57%', backgroundColor:'black', color:'white'}}>
    <input style={{width:'60%', marginTop:'5%', backgroundColor:'white', borderRadius:'5px', color:'black'}} placeholder='search...' onChange={(event)=>search(event.target.value)}></input>
    {searchRes && 
    (
    searchRes.map((res)=>
    {return <div  style={{width:'60%', marginLeft:'4%'}} ref={searchRef}>
     <SearchResult name={res.username} authorId={res.id} url={res.profilePic}></SearchResult>
      </div>;
    })
    )}

{searchResHash && 
    (
    searchResHash.map((res)=>
    {return <div  style={{width:'60%', marginLeft:'4%'}}  ref={searchRefHash}>
     <SearchResultHash hash={res.tag}></SearchResultHash>
      </div>;
    })
    )}

    </div>
    <AiOutlineHome className='icons' onClick={goToHome}/>
    
    <BiImageAdd className='icons'  onClick={handleButtonAddPost}/>
    {addPost && (
    <div class="middletray" ref={addPostRef}>
        <button className='addMedia' onClick={handleButtonUploadImage}> <BiImageAdd className='selectionIcon' />  Add Image</button>
        <button className='addMedia'><AiOutlineVideoCameraAdd className='selectionIcon' /> Add Video</button>
    </div>
  )}

  {upload && (   
 <div class="uploadtray" ref={uploadRef}>
  <AiOutlineCloseCircle onClick={handleButtonUploadImage} className="closeButton"></AiOutlineCloseCircle>
<div className='chooseAndDisplay'>
  <input type="file" className='chooseImage' onChange={onImageChange} ></input>
</div>
{image &&(<img src={image} alt="preview image" className='preview' />)}
  <button className="uploadImage" onClick={handleButtonUpload}>Next</button>
</div>
  )}

{next&& (   
 <div class="uploadtray" ref={nextRef}>
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
        <div ref={notifRef} className='NotifTray'>
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
    <div  ref={profileRef} className="dropdown">
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