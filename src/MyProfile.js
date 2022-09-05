import './css/MyProfile.css';
import Header from'./Header.js';
import Post from'./Post.js';
import SidePanel from './SidePanel';
import {useState, useEffect , useRef} from "react";
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, orderBy, query, onSnapshot} from 'firebase/firestore';
import {signOut, onAuthStateChanged} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Avatar from '@mui/material/Avatar';
import {AiFillTag, AiOutlineVideoCamera} from 'react-icons/ai';
import {FcGallery} from 'react-icons/fc';
import {FcNext, FcPrevious} from 'react-icons/fc';
import {MdKeyboardBackspace} from 'react-icons/md';
import List from './List';

import GridImg from './GridImg';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap'



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
    const [time, setTime] = useState(Date. now()); 
    const [focusImages, SetFocusImages]=useState(true);
    const [focusVideos, SetFocusVideos]=useState(false);
    const [focusTags, SetFocusTags]=useState(false);
    const [grid, SetGrid]=useState(true);
    const [postArray, SetPostArray]=useState();
    const [index, SetIndex]=useState([]);
    const[collectionSize, SetCollectionSize]=useState();
    const[loading, SetLoading]= useState(true);
    const[showFollowers, SetShowFollowers]= useState(false);
    const[showFollowing, SetShowFollowing]= useState(false);
    const[followerList, SetFollowerList]=useState(null);
    const[followingList, SetFollowingList]=useState(null);

    const docRef = doc(db, "users", auth.currentUser.uid);
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

    const postsCollectionRef = collection(db, `users/${auth.currentUser.uid}/posts`);

    const typeString = "follow"
    useEffect(()=>{

        const getUsersData = async () => {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {

            setName(docSnap.data().name);
            SetUserName(docSnap.data().username);
            SetBio(docSnap.data().bio);
            SetWebsite(docSnap.data().website);           
            SetNumberOfFollowers(docSnap.data().followers);
            SetNumberOfFollowing(docSnap.data().following);
            SetNumberOfPosts(docSnap.data().posts);

            getDownloadURL(ref(storage, `${auth.currentUser.uid}/${docSnap.data().profilePic}`))
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
            
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
      };
  
      const getUserPost =async()=>{
        const q = query(postsCollectionRef,orderBy('timeStamp', 'desc'))
        onSnapshot(q, querySnapshot=>{
          if(querySnapshot.size>0){
          SetPosts(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
          let mymap = querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id}))
          let keys = [...mymap.values()]
          SetCollectionSize(keys.length);
          SetPostArray(keys);
          
          SetLoading(false);
        }
          else{
            SetPosts("null");
            SetLoading(false);
          }
        })
      }
      getUsersData();
      getUserPost();
    }, [index] );

  const logout = async () =>
  {
          await signOut(auth);
          navigate("/");

  }

  const getIndex=(item)=>{
    var index = 0;
    postArray.forEach((post)=>{
      if(post.id === item){
        SetIndex(index);
       
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
   
  }
  };


  function getPostPic(imgName){
  getDownloadURL(ref(storage, `${auth.currentUser.uid}/${imgName}`))
  .then((url) => {
    
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

  const handleButtonClosePosts=()=>{
    SetGrid(!grid);
  }

  const handleButtonSetGrid=(id)=>{
    getIndex(id);
    SetGrid(!grid);
  }

  const handleButtonEditProfile=()=>{
    navigate("/settings");
  }

  const getFollowersList=async()=>{
    try{
    const docR = collection(db, `users/${auth.currentUser.uid}/followerList`)    
    const docSnap =  await getDocs(docR);
    
    
    if (docSnap.size>0){
    SetFollowerList(docSnap.docs.map((doc)=>({...doc.data(), id: doc.id})));
    
    }
    
  }catch(error){
          console.log(error);
        }
    }

    const getFollowingList=async()=>{
      try{
      const docR = collection(db, `users/${auth.currentUser.uid}/followingList`)    
      const docSnap =  await getDocs(docR);
      
      if (docSnap.size>0){
      SetFollowingList(docSnap.docs.map((doc)=>({...doc.data(), id: doc.id})));
      }
    }
          catch(error){
            console.log(error);
          }
      }


      const handleButtonShowFollowers=async()=>{
        try{
          if(showFollowing===false){
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
            await getFollowingList();
            SetShowFollowing(!showFollowing)}
            else{
              SetShowFollowing(!showFollowing)
            }
          }
  
  

 
  return (<div className="MyProfile">
    <nav>
  
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>

    {showFollowing && followingList !== null && (
    <div className='list'>
  {followingList.map((res)=>
     <List authorId={res.id} typ={typeString} ></List>)}
  </div>)}
  
  {showFollowers && followerList!==null && (
      <div className='list'>
        {followerList.map((res)=>
  <div style={{width:'100%'}}>
     <List authorId={res.id} typ={typeString}></List>
  </div>
  )}
      </div>
    )}

    {posts && focusImages && !grid &&
      (<div className="indPost">
      <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
      <div style={{width:'10%',display:'flex', flexDirection:'column'}}>

      <MdKeyboardBackspace style={{marginTop:'15%', width:'100%', height:'5%', cursor:'pointer'}} onClick={()=>{handleButtonClosePosts()}}>Back</MdKeyboardBackspace>
      <FcPrevious style={{color:'white', marginTop:'150%', width:'100%', cursor:'pointer'}} disabled={index === 0} onClick={()=>{goToPreviousPost()}}>Previous</FcPrevious>
      
      </div>
      <div style={{width:'80%'}}>
      <Post postid={postArray[index].id} name={name} authorId={postArray[index].authorID} captions={postArray[index].caption} url={postArray[index].url} profilePic={currentPicUrl} likes={postArray[index].likes} saves={postArray[index].saved} comments={postArray[index].comments} timeStamp={postArray[index].timeStamp} allowComments={postArray[index].allowComments}></Post>
      </div>
      <div style={{width:'10%', color:'white'}}><FcNext style={{ color:'white', width:'100%', marginTop:'180%', cursor:'pointer'}} disabled={index === collectionSize - 1} onClick={()=>{goToNextPost()}} >Next</FcNext></div>
      </div>
      </div>
  )} 

    <div className='firstTray'>
    <div className='rowPicnStat'>
    <div className='profilePic'>  
    <Avatar
    alt="preview image"
    src={currentPicUrl}
    sx={{ width: '100%', height: '100%', maxHeight:200}}
    />
    </div>
    <div className='row'>
    <div className='column'>
      <div className='number'>{numberOfPosts}</div>
      <div className='category'>Posts</div>
    </div>
    <div className='column'style={{cursor:'pointer'}} onClick={()=>{handleButtonShowFollowers()}}>
      <div className='number' >{numberOFollowers}</div>
      <div className='category'>Followers</div>
    </div>
    <div className='column'  style={{cursor:'pointer'}}  onClick={()=>{handleButtonShowFollowing()}}>
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
      {posts !== null && focusImages && grid && !loading && posts !== "null" &&
      (posts.map((post)=>
    { if((!post.deleted))
      return <div id={post.url} className="indGrid" onClick={()=>{handleButtonSetGrid(post.id)}}>
       {!(post.deleted) && (
      <GridImg name={name} captions={post.caption} url={post.url} authorId={post.authorID}></GridImg>
       )}
      </div>
    }
    )
  )}  


{posts !== null && focusImages && grid && !loading && posts === "null" &&
      (<div style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>
       You haven't posted anything yet.
      </div>
  )} 

{loading &&  (
      <div style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>
        
{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Getting Posts.....
      
      </div>
      
      )}  

 
  </div>
    </div>
  
    </nav>
  </div>);
}

export default  MyProfile;