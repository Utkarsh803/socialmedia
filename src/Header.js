import './css/Header.css';
import {CgProfile} from 'react-icons/cg';
import { AiOutlineHeart,AiOutlineHome, AiFillSetting, AiOutlineVideoCameraAdd,AiOutlineCloseCircle,AiFillHeart} from 'react-icons/ai';
import {BiImageAdd, BiMessageRounded, BiHelpCircle} from 'react-icons/bi';
import {FaRegBookmark , FaUserAltSlash}from 'react-icons/fa';
import {useState, useEffect} from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, getDoc,addDoc, updateDoc, deleteDoc, doc, setDoc, serverTimestamp, Timestamp,onSnapshot} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import Settings from './Settings';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import {signOut, onAuthStateChanged} from "firebase/auth";
import {v4} from 'uuid'
import { query, where, orderBy, limit } from "firebase/firestore";  
import SearchResult from './SearchResult';
import NotifLike from './NotifLike';
import SearchResultHash from './SearchResHash';
import React, {useRef} from 'react';
import { runTransaction } from "firebase/firestore";
import CropEasy from './crop/CropEasy';
import { Button, DialogActions, DialogContent, Slider, Typography ,Box} from '@mui/material';
import Cropper from 'react-easy-crop';
import { MdCancel } from 'react-icons/md';
import { FaCrop } from 'react-icons/fa';
import getCroppedImg from './crop/utils/CropImage.js';
import * as ReactBootstrap from 'react-bootstrap'





function Header() {

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
  const[openCrop,setOpenCrop]=useState(false);
  const [crop,setCrop] = useState({x:0, y:0})
  const [zoom,setZoom] = useState(1)
  const [rotation,setRotation] = useState(0)
  const[croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const[loading,setLoading]=useState(false);
  const[blocked, SetBlocked]= useState([]);
  const[muted, SetMuted]= useState([]);
  const[restricted, SetRestricted]= useState([]);
  const[newNotifs, SetNewNotifs]= useState(false);



  let navigate = useNavigate(); 
  let notifRef = useRef();
  let profileRef = useRef();
  let addPostRef= useRef();
  let uploadRef= useRef();
  let nextRef= useRef();
  let searchRef= useRef();
  let searchRefHash= useRef();
  let notifButton= useRef();
  let profileButton= useRef();
  let addPostButton= useRef();
 
  
  useEffect(()=>{

    let handler = (event)=>{
      if(notifRef.current && !notifRef.current.contains(event.target) || notifRef.current && notifButton.current.contains(event.target) ){
      SetViewNotif(false);}else if (!notifRef.current && notifButton.current.contains(event.target)){
        SetViewNotif(true)
      }
    }

    let handler2 = (event)=>{
      if(profileRef.current && !profileRef.current.contains(event.target) || profileRef.current && profileButton.current.contains(event.target)){
      SetProfileMenu(false);}else if (!profileRef.current && profileButton.current.contains(event.target)){
        SetProfileMenu(true)
      }
    }

    let handler3 = (event)=>{
      if(addPostRef.current && !addPostRef.current.contains(event.target) || addPostRef.current && addPostButton.current.contains(event.target)){
        handleButtonUploadImage();
      SetAddPost(false);}
      else if(!addPostRef.current && addPostButton.current.contains(event.target)){
        SetAddPost(true);
      }
    }
    let handler4 = (event)=>{
      if(uploadRef.current && !uploadRef.current.contains(event.target)){
        handleButtonUploadImage();
      SetUpload(false);}
    }
    let handler5 = (event)=>{
      if(nextRef.current && !nextRef.current.contains(event.target)){
        handleButtonClose();
      SetNext(false);}
    }
    let handler6 = (event)=>{
      if( searchRef.current && !searchRef.current.contains(event.target)){
      SetSearchRes(false);}
    }
    let handler7 = (event)=>{
      if(searchRefHash.current && !searchRefHash.current.contains(event.target)){
      SetSearchResHash(false);}
    }

    document.addEventListener("mousedown", handler);
    document.addEventListener("mousedown", handler2);
    document.addEventListener("mousedown", handler3);
    document.addEventListener("mousedown", handler4);
    document.addEventListener("mousedown", handler5);
    document.addEventListener("mousedown", handler6);
    document.addEventListener("mousedown", handler7);

    const getStatus=async()=>{
      let keys=[];
      let keys2=[];
      let keys3=[];
  
      var arrm =[];
      const MuteRef = collection(db, `users/${auth.currentUser.uid}/mutedUsers`)
      const muteSnap = await getDocs(MuteRef);
      if(muteSnap.size>0){
      let mymap = muteSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
      keys = [...mymap.values()]
      keys.forEach((key)=>{
        arrm.push(key.id);
      })
      SetMuted(arrm);}
  
      var arrr =[];
      const restrictRef = collection(db, `users/${auth.currentUser.uid}/restrictedUsers`)
      const resSnap = await getDocs(restrictRef);
      if(resSnap.size>0){
      let mymap2 = resSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
      keys2 = [...mymap2.values()]
      keys2.forEach((key)=>{
        arrr.push(key.id);
      })
      SetRestricted(arrr);}
  
      var arrb =[];
      const blockRef = collection(db, `users/${auth.currentUser.uid}/blockedUsers`)
      const blockSnap = await getDocs(blockRef);
      if(blockSnap.size>0){
      let mymap3 = blockSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
      keys3 = [...mymap3.values()]
      keys3.forEach((key)=>{
        arrb.push(key.id);
      })
   
      SetBlocked(arrb);}
    }


    const getNewNotifs=async()=>{
      const docRef=doc(db, "users", `${auth.currentUser.uid}`)
      const docSnap = await getDoc(docRef);
      
      const notifRef = collection(db, `users/${auth.currentUser.uid}/notifications`);
      const q = query(notifRef,orderBy('timeStamp', 'desc'), limit(1))
      const notifDoc = await getDocs(q);

   if(notifDoc.size>0){
    notifDoc.forEach((doc)=>{
      if(docSnap.data().notificationStamp < doc.data().timeStamp){
        SetNewNotifs(true);
      }
      else{
        SetNewNotifs(false);
      }
    })}
    else{
      SetNewNotifs(false);
    }
    }

    getNewNotifs();
    getStatus();
    getPostsStats();
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

    const logout = async () =>
    {
            await signOut(auth);
            navigate('/');
          
    }

    const generateKey = (pre) => {
      return `${ pre }_${ new Date().getTime() }`;
  }

  
   const search = async(name) =>{
    SetSearchInput(name);
    getStatus();
    const charact = name.substring(0,1);
    if(charact !== '#'){
    
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

  const getPrivate=async()=>{
    const docRef = doc(db, `users`,`${auth.currentUser.uid}`)
    const docSnap = await getDoc(docRef);
    return docSnap.data().private
  }
  


  const getPostsStats=async()=>{
    const docRef = doc(db, `users`,`${auth.currentUser.uid}`)

    const q = query(docRef);
    onSnapshot(q, querySnapshot=>{
      SetNumPosts(querySnapshot.data().posts);
   
    })


    }

    const zoomPercent = (value)=>{
      return `${Math.round(value *100)}%`
  }

    const increasePosts=async()=>{
      try{
      const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
      const newfield1 = {posts: numPosts + 1};
      await updateDoc(followingdocRef,newfield1);
     
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
         
        });
    }
); 

}

catch(error){
  console.log(error);
}
}

const getNotif= async()=>{
  setLoading(true);
  try{
  const notifRef = collection(db, `users/${auth.currentUser.uid}/notifications`);
  const q = query(notifRef,orderBy('timeStamp', 'desc'))
  onSnapshot(q, querySnapshot=>{
    if(querySnapshot.size>0){
    SetNotif(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
  }
  else{
    SetNotif("null");
  }
  })
setLoading(false);
}
catch(error)
{
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

  const cropComplete = (croppedArea, croppedAreaPixels)=>{
    setCroppedAreaPixels(croppedAreaPixels)
    }

    const cropImage = async() => {
      setLoading(true);
      const { file, url } = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      );
      if(file!==null){
        var binaryData = [];
        binaryData.push(url);
        SetImage(URL.createObjectURL(new Blob(binaryData, {type: "application/text"})))
        SetImageFile(file);
        setTimeout(() => {
          SetUpload(false);
          SetNext(true);
          setLoading(false);
        }, 2000);
        }
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
    setLoading(false);
  }

  function handleButtonClose() {
    SetImage(null);
    SetImageFile(null);
    SetAddPost(false);
    SetUpload(false);
    SetNext(false);
    SetPercent(0);
  }

  const getStatus=async()=>{
    let keys=[];
    let keys2=[];
    let keys3=[];

    var arrm =[];
    const MuteRef = collection(db, `users/${auth.currentUser.uid}/mutedUsers`)
    const muteSnap = await getDocs(MuteRef);
    if(muteSnap.size>0){
    let mymap = muteSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
    keys = [...mymap.values()]
    keys.forEach((key)=>{
      arrm.push(key.id);
    })
    SetMuted(arrm);}

    var arrr =[];
    const restrictRef = collection(db, `users/${auth.currentUser.uid}/restrictedUsers`)
    const resSnap = await getDocs(restrictRef);
    if(resSnap.size>0){
    let mymap2 = resSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
    keys2 = [...mymap2.values()]
    keys2.forEach((key)=>{
      arrr.push(key.id);
    })
    SetRestricted(arrr);}

    var arrb =[];
    const blockRef = collection(db, `users/${auth.currentUser.uid}/blockedUsers`)
    const blockSnap = await getDocs(blockRef);
    if(blockSnap.size>0){
    let mymap3 = blockSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
    keys3 = [...mymap3.values()]
    keys3.forEach((key)=>{
      arrb.push(key.id);
    })
 
    SetBlocked(arrb);}
  }

  
  const handleButtonNext = async() => {
    setLoading(true);
    getStatus();

    if(imageFile.width==imageFile.height){
    await createPost();
  }else{
    console.log("File resolution not supported")
  }
    SetImage(null);
    SetImageFile(null);
    SetPercent(0);
    SetUrl(null);
    SetCaption(null);
    setLoading(false);
    SetUpload(false);
    SetNext(false);
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

     
      const feedRef = doc(db, `feed/${docc.id}/posts`, `${postid}`);

      setDoc(feedRef, {
        added:Timestamp.fromDate(new Date()),
        author:auth.currentUser.uid,
        postID:postid,
      });

     // SetFollowersList(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
     
    });
  
  }
  catch(error){
    console.log(error);
  }
  }


   const createPost = async() =>{
    var hashtagArray = caption.match(/#[\p{L}]+/ugi);

    var privat = await getPrivate();
    if(hashtagArray === null){
      hashtagArray=0;
    };
    const imageName = imageFile.name + v4();
    try
    {
    await runTransaction(db, async (transaction) => { 
     
      const followerRef = collection(db, `users/${auth.currentUser.uid}/followerList`);
      const data = await getDocs(followerRef);
      
      const blockRef = collection(db, `users/${auth.currentUser.uid}/blockedUsers`)
      const block = await getDocs(blockRef);

      const restrictRef = collection(db, `users/${auth.currentUser.uid}/restrictedUsers`)
      const restrict = await getDocs(restrictRef);

      const followingdocRef = doc(db, `users`, `${auth.currentUser.uid}`)
      const docSnap= await transaction.get(followingdocRef);
      const postsNum= docSnap.data().posts;

      var arr=[];
      if(hashtagArray !== 0 && hashtagArray.length!=0 && !privat){
      for(const hash of hashtagArray){
        const hashRef= doc(db, "hashtags", `${hash}`);
        const hashVal = await transaction.get(hashRef);
        arr.push({hashVal:hashVal, hashRef:hashRef, hash:hash});
      }}

   

       await addToStorage(imageName);
     
       const usersCollectionRef = doc(collection(db, `/users/${auth.currentUser.uid}/posts`));
       
       const addedDoc =  transaction.set(usersCollectionRef, {
        authorID: auth.currentUser.uid,
        likes:0,
        comments:0,
        caption:caption,
        url:imageName,
        reported:0,
        saved:0,
        allowComments:true,
        archived:false,
        deleted:false,
        edited:false,
        tags:hashtagArray,
        timeStamp:Timestamp.fromDate(new Date()),
        });       

   

      var a=0;
      if(hashtagArray !== 0 && hashtagArray.length!=0 && !privat){
      for(const hashVal of arr ){
     
      
        if((arr[a].hashVal).exists()){
         
          transaction.update(arr[a].hashRef, {val:(arr[a].hashVal).data().val+1});
        
          const pid = auth.currentUser.uid + usersCollectionRef.id;
          transaction.set(doc(db, `hashtags/${arr[a].hash}/posts/`, `${pid}`),{
            authorId:auth.currentUser.uid,
            postId:usersCollectionRef.id,
            likes:0,
            comments:0,
            saves:0,
            show:true,
            reported:0,
            createdAt:Timestamp.fromDate(new Date()),
          });

          const hashFeed=doc(db, `users/${auth.currentUser.uid}/hashPosts`, `${usersCollectionRef.id}`)

         await  setDoc(hashFeed,{
            hash:arr[a].hash,
            postid:usersCollectionRef.id,
            pid:pid
          })
          
        }
        else{
        
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
            show:true,
            createdAt:Timestamp.fromDate(new Date()),
          });

          const hashFeed=doc(db, `users/${auth.currentUser.uid}/hashPosts`, `${usersCollectionRef.id}`)

         await setDoc(hashFeed,{
            hash:arr[a].hash,
            postid:usersCollectionRef.id,
            pid:pid
          })

          a=a+1;
        }
      }
       
        
         transaction.set(doc(db,  `/users/${auth.currentUser.uid}/album`, `${usersCollectionRef.id}`), {
          img:imageName,
         });         
             
          
       // createLikeList(addedDoc.id);
        
         transaction.set(doc(db,  `/users/${auth.currentUser.uid}/likes`, `${usersCollectionRef.id}`), {
          totalLikes:0,
         });         
          

      //  createCommentList(addedDoc.id);

        transaction.set(doc(db,  `/users/${auth.currentUser.uid}/comments`, `${usersCollectionRef.id}`), {
          totalComments:0,
          validComments:0,
         });       
         
      
      
      
      //addToFeed(addedDoc.id);
      
      data.forEach((docc) => {
        if(!blocked.includes(docc.id)&&!restricted.includes(docc.id)){
  
      
        const feedRef = doc(db, `feed/${docc.id}/posts`, `${usersCollectionRef.id}`);
  
        transaction.set(feedRef, {
          added:Timestamp.fromDate(new Date()),
          author:auth.currentUser.uid,
          postID:usersCollectionRef.id,
          reported:false,
          show:true,
        })  

        transaction.set(doc(db, `users/${auth.currentUser.uid}/feedRef/${usersCollectionRef.id}/nodes`, `${docc.id}`), {
          createdAt:serverTimestamp()
        })

       // SetFollowersList(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
      }
      });
      
      
        //increasePosts();

        
        const newfield1 = {posts: postsNum + 1};
        transaction.update(followingdocRef,newfield1);
     
        })
        SetNumPosts(numPosts+1);
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
           });          } 
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
     
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Muted list could not be created. Try Again :("); 
   }
   }



   const updateNotifStamp=async()=>{
    const docRef=doc(db, "users", `${auth.currentUser.uid}`)
    await updateDoc(docRef, {
      notificationStamp:serverTimestamp(),
    })
   }

   const handleButtonNotif=async()=>{
    SetNewNotifs(false);
    updateNotifStamp();
    getNotif();
   }


   const goToSavedPosts=()=>{
    navigate("/saved-posts");
   }

   const goToHelpCenter=()=>{
    navigate("/help");
   }

   const handleButtonChats=()=>{
    navigate("/chats");
   }

  return (<div className="Header">

    <h1 style={{fontSize:'xxx-large', marginLeft:'4%', marginRight:'9%', marginTop:'1.7%'}} className='pointer'  onClick={goToHome}>Lyfy</h1>

  
   <div style={{ display:'flex', flexDirection:'column', width:'57%', backgroundColor:'black', color:'white'}}>
    <input style={{width:'60%', marginTop:'5%', backgroundColor:'white', borderRadius:'5px', color:'black'}} placeholder='search...' onChange={(event)=>search(event.target.value)}></input>
    {searchRes && 
    <div ref={searchRef}>
    {
    searchRes.map((res)=>
    {if(!blocked.includes(res.id))
      return <div  style={{width:'60%', marginLeft:'4%'}} key={ generateKey(res.id)} >
     <SearchResult name={res.username} authorId={res.id} url={res.profilePic} SetSearchRes={SetSearchRes}></SearchResult>
      </div>;
    })
  }
    </div>
    }

{searchResHash && 
     <div ref={searchRefHash}>
    {
    searchResHash.map((res)=>
    {return <div  style={{width:'60%', marginLeft:'4%'}} >
     <SearchResultHash hash={res.tag}  SetSearchResHash={SetSearchResHash}></SearchResultHash>
      </div>;
    })
    }
    </div>
    }

    </div>
    <div className='icons'>
    <AiOutlineHome style={{width:'100%', height:'100%'}} onClick={goToHome}/>
    </div>

    <div className='icons' ref={addPostButton}>
    <BiImageAdd style={{width:'100%', height:'100%'}}/>
    </div>
    {addPost && (
    <div class="middletray" ref={addPostRef}>
        <button className='addMedia' onClick={handleButtonUploadImage}> <BiImageAdd className='selectionIcon' />  Add Image</button>
        <button className='addMedia' disabled={true}><AiOutlineVideoCameraAdd className='selectionIcon' /> Add Video (Coming Soon)</button>
    </div>
  )}

  {upload && (   
 <div class={`uploadtray ${!image && `low`}`} ref={uploadRef}>
  <AiOutlineCloseCircle onClick={handleButtonUploadImage} className="closeButton"></AiOutlineCloseCircle>

 
<div className='chooseAndDisplay'>
  <input type="file" className='chooseImage' onChange={onImageChange} ></input>
</div>
{image &&(
  <div>
     <div 
     style={{
         position:"relative",
         height:250,
         width:"auto",
         minWidth: {sn:500},
         backgroundColor:"#333",
         color:'white'
       }}
     >  
     <Cropper
     image={image}
     width={100}
     crop={crop}
     zoom={zoom}
     rotation={rotation}
     onZoomChange={setZoom}
     aspect={1}
     onRotationChange={setRotation}
     onCropChange={setCrop}
     onCropComplete={cropComplete}
     showGrid={false}
     
     />
     </div>
     <DialogActions sx={{flexDirection:'column', mx:3,my:2}}>
         <Box sx={{width:"100%", mb:1}}>
         <Box>
             <Typography>Zoom: {zoomPercent(zoom)}</Typography>
                 <Slider
                 valueLabelDisplay='auto'
                 valueLabelFormat={zoomPercent}
                 min={1}
                 max={3}
                 step={0.1}
                 value={zoom}
                 onChange={(e,zoom)=>setZoom(zoom)}
                 />
         </Box>
         <Box>
         <Typography>Rotation: {rotation}</Typography>
                 <Slider
                 valueLabelDisplay='auto'
                 min={0}
                 max={360}
                 value={rotation}
                 onChange={(e,rotation)=>setRotation(rotation)}/>
         </Box>
         </Box>
            {!loading ?(
             <button
             style={{width:'100%'}}
             onClick={cropImage}
             disabled={loading}
             >
                Next
             </button>):(
              <button
              style={{width:'100%'}}
              >
{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Loading.....
              </button>
             )}
       
     </DialogActions>
     </div>
)}

</div>
  )}

{next&& (   
 <div class="uploadtrayP" ref={nextRef}>
  <AiOutlineCloseCircle onClick={handleButtonClose} className="closeButton"></AiOutlineCloseCircle>  
<div className='flex-column'>
<textarea placeholder='Type your caption...' className='captionInput' onChange={(event)=>{SetCaption(event.target.value)}}>
</textarea>
  </div>
  {!loading ?(
  <button className="uploadImage" disabled={loading} onClick={handleButtonNext}>Post</button>
  ):(
  <button className="uploadImage">{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Posting.....</button>
  )
  }
  <p style={{backgroundColor:'black', color:'white'}}>{percent}% done</p>
</div>
  )}

<div  className='icons' ref = {notifButton}>
    {!newNotifs ?
   (<AiOutlineHeart  style={{width:'100%', height:'100%'}} onClick={handleButtonNotif}/>):
   (<AiFillHeart style={{width:'100%', height:'100%'}}   onClick={handleButtonNotif}/>)}
        </div>
        {!loading && viewNotif && Notif !=="null" && Notif !== null && (
        <div ref={notifRef} className='NotifTray'>
         {( Notif.map((res)=>
            {return <div>
             <NotifLike authorId={res.author} content={res.content} postid={res.postid} timestamp={res.timeStamp} type={res.type} identifier={res.id}></NotifLike>
              </div>;
            })
            )
    }
    </div>
    )}
    
    
            
        {!loading && viewNotif && Notif ==="null" && Notif !== null &&
          (
            <div ref={notifRef} class="NotifTray">
           <div  style={{display:'relative', width:'100%', backgroundColor:'black', color:'white', padding:'5%'}}>
             <div style={{display:'relative', width:'100%', backgroundColor:'black', color:'white', textAlign:'center'}}>No Notifications.</div>
              </div>
              </div>
         )}

      {loading && viewNotif &&
          (
            <div ref={notifRef} class="NotifTray">
           <div  style={{display:'relative', width:'100%', backgroundColor:'black', color:'white', padding:'5%'}}>
             <div style={{display:'relative', width:'100%', backgroundColor:'black', color:'white', textAlign:'center'}}>{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Getting Notifications.....</div>
              </div>
              </div>
         )}
        
     <div className='icons'>
    <BiMessageRounded style={{width:'100%', height:'100%'}} onClick={handleButtonChats}/>
    </div>

    <div className='icons' ref={profileButton}>
    <CgProfile style={{width:'100%', height:'100%'}}/>
    </div>

    {profileMenu && (
    <div  ref={profileRef} className="dropdown">
      <ul style={{background:'black', height:'fit-content'}}>
        <button className='selection'  onClick={goToMyProfile}> <CgProfile className='selectionIcon'/>  My Profile</button>
        <button className='selection' onClick={goToSettings}><AiFillSetting className='selectionIcon' />  Settings</button>
        <button className='selection'  onClick={goToSavedPosts}><FaRegBookmark className='selectionIcon' /> Saved</button>
        <button className='selection'  onClick={goToHelpCenter}><BiHelpCircle className='selectionIcon'/>  Help Center</button>
        <button className='selection' onClick={logout}>Logout</button>
      </ul>
    </div>
  )}

    
  
  </div>);
}

export default Header;