import './css/HashFeedPost.css';
import PostHeader from './PostHeader';
import {useState, useEffect } from "react";
import {db, auth, storage} from './firebase-config';
import {collection,getDoc ,getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp, orderBy, query, onSnapshot, setDoc, QuerySnapshot} from 'firebase/firestore';
import PostTools from './PostTools';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import moment from 'react-moment'
import {BiDotsVerticalRounded } from 'react-icons/bi';
import Avatar from '@mui/material/Avatar';
import Comment from './Comment';
import { useNavigate } from "react-router-dom";
import Moment from 'react-moment';
import createTree from './createTree';
import * as ReactBootstrap from 'react-bootstrap'
import { runTransaction } from "firebase/firestore";
//  <div style={{backgroundColor:'black', color:'white', paddingTop:'3%', paddingLeft:'2%', textAlign:'left', fontStyle:'normal'}}>Liked by Utkarsh and others</div>
function HashFeedPost({postid,authorId}) {

  const[commentTree, SetCommentTree]=useState(null);
  const [name, setName]=useState("");    
  const [captions, SetCaptions]=useState("");
  const [comments, SetComments]=useState(null);
  const [likes, SetLikes]=useState(null);
  const [saves, SetSaves]=useState(null);
  const [url, SetUrl]=useState(null);
  const [currentPicUrl, SetCurrentPicUrl]=useState(null);
  const[postUrl, SetPostUrl]=useState(null);
  const [timeStamp, SetTimestamp]=useState(null)
  const[totalComments, SetTotalComments]=useState(null);
  const[comCaption, SetComCaption]=useState(null);
  const[profilePicUrl, SetProfilePicUrl]=useState(null);
  const[typ, SetTyp]=useState("horizontal");
  const[commentStatus,SetCommentStatus]=useState(false);
  const[loading, SetLoading]= useState(true);
  const[commentLoading, SetCommentLoading]= useState(false);

  //to get: name, captions, comments, likes, saves, url 
  let navigate = useNavigate();

useEffect(()=>{

  const getUsersData = async () => {
    const docRef = doc(db, "users", authorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setName(docSnap.data().name);
      
      getDownloadURL(ref(storage, `${authorId}/${docSnap.data().profilePic}`))
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


const getCommentsStatus=async()=>{
  const docRef = doc(db, `users/${authorId}/posts/`, `${postid}`);
  const docSnap = await getDoc(docRef);
  SetCommentStatus(docSnap.data().allowComments);  
}

const getMyPic= async()=>{
  const docRef = doc(db, "users", `${auth.currentUser.uid}`);
  const docSnap = await getDoc(docRef);

  getDownloadURL(ref(storage, `${auth.currentUser.uid}/${docSnap.data().profilePic}`))
  .then((url) => {
    SetProfilePicUrl(url);
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


const getUserPost =async()=>{
  const postsCollectionRef = doc(db, `users/${authorId}/posts`, `${postid}`);
  const docSnap = await getDoc(postsCollectionRef);
 
  const usersCollectionRef = doc(db, `/users/${authorId}/comments`,`${postid}`);
  const commSnap = await getDoc(usersCollectionRef);
  SetComments(commSnap.data().validComments);
  
  try
  {
    SetUrl(docSnap.data().url);    
    SetCaptions(docSnap.data().caption);
    SetLikes(docSnap.data().likes);
    SetSaves(docSnap.data().saved);
    SetTimestamp(docSnap.data().timeStamp);

    getDownloadURL(ref(storage, `${authorId}/${docSnap.data().url}`))
    .then((url) => {
      SetPostUrl(url);
    
      SetLoading(false);
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
      SetLoading(false);
    });
    
}
catch(e){
  console.log(e.message);
}
}
SetPostUrl(null);
SetProfilePicUrl(null);
getMyPic();
getUserPost();
getCommentsStatus();
getUsersData();
getComments();
}, [postid, authorId, comments, commentStatus] );

const getComments=async()=>{
  const comRef = collection(db, `users/${authorId}/comments/${postid}/ids`)
  const q = query(comRef, orderBy("timeStamp", "desc"));
  const docSnap = await getDocs(q);
/*
  if(docSnap.size>0){
    SetCommentTree(createTree(docSnap.docs.map((doc)=>({...doc.data()}))));
  }
  else{
    SetCommentTree(null);
  }*/

  onSnapshot(q, querySnapshot=>{
    SetCommentTree(createTree(querySnapshot.docs.map((doc)=>({...doc.data()}))));
  })

  /*
  await getDocs(comRef);


  if(q.size>0){
    SetCommentTree(createTree(q.docs.map((doc)=>({...doc.data()}))));
  }
  else{
    SetCommentTree(null);
  }
*/

}

function goToHash(hash) {
  const tag = hash.substring(1, hash.length); 
  
  navigate(`/hashTag/${tag}`);
}


const incCommentNum=async()=>{
  const comRef = doc(db, `users/${authorId}/comments`, `${postid}`)
  const newfield={totalComments:comments+1};
  const data = await updateDoc(comRef, newfield);

}

const addTotalPostComments=async()=>{
  try
  {  
     incCommentNum();
     const num= comments+1;
     const usersCollectionRef = doc(db, `/users/${authorId}/comments/${postid}/ids`, `${num}`);
     await setDoc(usersCollectionRef,{
       id: comments+1,
       parent:null,
       comment: comCaption,
       author:auth.currentUser.uid,
       postAuthor:authorId,
       likes:0,
       postid:postid,
       timeStamp:Timestamp.fromDate(new Date()),
     });      
      SetTotalComments(comments+1);
       } 
 catch(error)
 {
     console.log(error.message);
     console.log("Comment was not registered :("); 
 }
}

const addToPostComments=async()=>{
  try{
    const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
    const newFields = {comments: comments + 1};
    await updateDoc(userDoc, newFields);
    SetComments(comments+1);
  }
  catch(error){
    console.log(error);
  }
  }

  const addComment=async()=>{ 
    SetCommentLoading(true);
    document.getElementById('commentInput').value = '';
    try{
      await runTransaction(db, async (transaction) => {   
    
    

    const NotRef = collection(db, `users/${authorId}/notifications`);   
   
    const comRef = doc(db, `users/${authorId}/comments`, `${postid}`)
    const docRef = await transaction.get(comRef) 
  
    const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
    const docRef1 = await transaction.get(userDoc) 
   
   
    const newfield={totalComments:docRef.data().totalComments+1, validComments:docRef.data().validComments+1};
    transaction.update(comRef, newfield);
  
    const num=docRef.data().totalComments+1;
    const usersCollectionRef = doc(db, `/users/${authorId}/comments/${postid}/ids`, `${num}`);
    transaction.set(usersCollectionRef,{
      id: docRef.data().totalComments+1,
      parent:null,
      comment: comCaption,
      author:auth.currentUser.uid,
      postAuthor:authorId,
      likes:0,
      child:0,
      postid:postid,
      timeStamp:Timestamp.fromDate(new Date()),
    });      
    

     
    const newFields1 = {comments: docRef1.data().comments + 1};
    transaction.update(userDoc, newFields1);
    
    
    if(authorId != auth.currentUser.uid){
      transaction.set((doc(NotRef)),{
        type:"comment",
        content:"commented on your post.",
        author:auth.currentUser.uid,
        postid:postid,
        timeStamp:Timestamp.fromDate(new Date()),
      })}
      })
      SetCommentLoading(false);
  }
  catch(e)
  {
    console.log(e.message)
    SetCommentLoading(false);
  }
  }
  
function goToProfile(hash) {
  const tag = hash.substring(1, hash.length); 
  navigate(`/profile/${tag}`);
}


  const CustomText = (props) => {
    const text = props.text.split(' ');
    return <span >{text.map(text => {
      if (text.startsWith('#')) {
        return <span style={{ color: 'lightblue',cursor:'pointer'}} onClick={()=>{goToHash(text)}}>{text} </span>;
      }
      else if(text.startsWith('@')){
        return <span style={{ color: 'lightblue',cursor:'pointer'}} onClick={()=>{goToProfile(text)}}>{text} </span>;
      }
      return `${text} `;
    })}</span>;
}


  return (<div className="HashFeedPost">
    <nav>
    <div style={{display:'flex', flexDirection:'row', height:'78vh'}}>
    <div style={{width:'50%', height:'90%'}}>
    <PostHeader name = {name} url={currentPicUrl} postid={postid} authorId={authorId} typ={typ}></PostHeader>
    {!loading ?
  (<img  style={{backgroundColor:'black', marginBottom:'-2%'}} src={postUrl} className="media" />):
  (<ReactBootstrap.Spinner animation="border" style={{marginTop:'30%', marginLeft:'48%', marginBottom:'30%'}}/>)}
    </div>
    <div style={{width:'50%', paddingLeft:'2%', height:'70vh'}}>
    <PostTools postid={postid} authorId={authorId} likes={likes} saves={saves} profilePic={currentPicUrl}></PostTools>
 
  <div className='caption' >
   <p  style={{height:'auto', width:'100%',flex:'1',wordBreak:'break-word'}}>
   <span style={{fontWeight:'bold'}}> {name}</span>{' '}<span ><CustomText text={captions}></CustomText></span>
   </p>
  </div>

    <div style={{color:'#888',backgroundColor:'black',paddingLeft:'3%', fontSize:'small', paddingTop:'3%'}}><Moment fromNow style={{backgroundColor:'transparent'}}>{ timeStamp ? (timeStamp.toDate()):null}</Moment></div>

    
    {(comments >= 2) && commentStatus &&(
     <div>
     <div style={{backgroundColor:'black', color:'grey', paddingLeft:'3%', paddingTop:'2%', paddingBottom:'1%'}}>{comments} comments</div>    </div>
    )
    }

  {(comments == 1) && commentStatus && (
     <div>
     <div style={{backgroundColor:'black', color:'grey', paddingLeft:'3%', paddingTop:'2%', paddingBottom:'1%'}}>{comments} comment</div>    </div>
    )
    }
   
   {commentStatus && (
    <div style={{color:'white',backgroundColor:'black',paddingLeft:'3%', fontSize:'small', overflow:'scroll', height:'42vh'}}>
    {commentTree && 
    (commentTree.map((comment) => 
      {
        return <Comment key={comment.id} comment={comment}></Comment>
      }
    )
    )}
  </div>)}
  {!commentStatus&&(
    <div style={{backgroundColor:'black', color:'#666', paddingTop:'20%', textAlign:'center'}}>Comments are turned off.</div>
  )}
  {commentStatus && (
  <div style={{position:'absolute', display:'flex', flexDirection:'row', backgroundColor:'black', height:'fit-content',bottom:'11px', width:'40%'}}>
<Avatar
    alt="preview image"
    src={profilePicUrl}
    sx={{ width: 25, height: 25, marginTop:'1%', marginLeft:'3%'}}
    />
    <input id="commentInput" placeholder='Add a comment....' style={{backgroundColor:'black', width:'90%',borderTop:'none',borderLeft:'none',borderRight:'none', borderBottom:'1px solid white', paddingLeft:'2%', height:'6vh', color:'white' }} onChange={(event)=>{SetComCaption(event.target.value)}}>
    </input>
    {!commentLoading ?
    (<button disable={commentLoading} style={{backgroundColor:'black', width:'fit-content', textAlign:'left', height:'6vh',marginTop:'0.4%', color:'deepskyblue',fontSize:'large'}} onClick={addComment}>Post</button>):
    (<button style={{backgroundColor:'black', width:'fit-content', textAlign:'left', height:'6vh',marginTop:'0.4%', color:'deepskyblue',fontSize:'large'}}><ReactBootstrap.Spinner animation="border" size="sm" style={{color:'#666', alignContent:'center'}}/></button>)}
    </div>
    )}
    
    </div>
    </div>
    </nav>
  </div>);
}

export default HashFeedPost;
