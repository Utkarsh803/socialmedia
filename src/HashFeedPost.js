import './css/HashFeedPost.css';
import logo from './mslogo.jpg';
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
import Moment from 'react-moment';
import createTree from './createTree';
import { runTransaction } from "firebase/firestore";

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

  //to get: name, captions, comments, likes, saves, url 


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
  {
    SetUrl(docSnap.data().url);    
    SetCaptions(docSnap.data().caption);
    SetComments(docSnap.data().comments);
    SetLikes(docSnap.data().likes);
    SetSaves(docSnap.data().saved);
    SetTimestamp(docSnap.data().timeStamp);

    getDownloadURL(ref(storage, `${authorId}/${docSnap.data().url}`))
    .then((url) => {
      SetPostUrl(url);
      console.log("Post image set!!!");
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
}
SetPostUrl(null);
SetProfilePicUrl(null);
getMyPic();
getUserPost();
getUsersData();
getComments();
}, [postid, authorId, comments] );

const getComments=async()=>{
  const comRef = collection(db, `users/${authorId}/comments/${postid}/ids`)
  const q = query(comRef, orderBy("timeStamp", "desc"));
  const docSnap = await getDocs(q);

  if(docSnap.size>0){
    SetCommentTree(createTree(docSnap.docs.map((doc)=>({...doc.data()}))));
  }
  else{
    SetCommentTree(null);
  }

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


const incCommentNum=async()=>{
  const comRef = doc(db, `users/${authorId}/comments`, `${postid}`)
  const newfield={totalComments:comments+1};
  const data = updateDoc(comRef, newfield);

  console.log("total counts updated");
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
      console.log("Author ID: "+authorId);
      console.log("Post ID: "+postid);
      console.log("Added a comment");
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
    try{
      await runTransaction(db, async (transaction) => {   
    
    
      console.log("Process began")
    const NotRef = collection(db, `users/${authorId}/notifications`);   
   
    const comRef = doc(db, `users/${authorId}/comments`, `${postid}`)
    const docRef = await transaction.get(comRef) 
  
    const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
    const docRef1 = await transaction.get(userDoc) 
   
   
    const newfield={totalComments:docRef.data().totalComments+1};
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
      postid:postid,
      timeStamp:Timestamp.fromDate(new Date()),
    });      
    
     console.log("Author ID: "+authorId);
     console.log("Post ID: "+postid);
     console.log("Added a comment");
     
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
  }
  catch(e)
  {
    console.log(e.message)
  }
  }



  return (<div className="HashFeedPost">
    <nav>
    <div style={{display:'flex', flexDirection:'row', height:'78vh'}}>
    <div style={{width:'60%', height:'90%'}}>
    <PostHeader name = {name} url={currentPicUrl} postid={postid} authorId={authorId} typ={typ}></PostHeader>
    <img  style={{backgroundColor:'black', marginBottom:'-2%'}} src={postUrl} className="media" />
    </div>
    <div style={{width:'40%', paddingLeft:'2%', height:'70vh'}}>
    <PostTools postid={postid} authorId={authorId} likes={likes} saves={saves} profilePic={currentPicUrl}></PostTools>
    <div style={{backgroundColor:'black', color:'white', paddingTop:'3%', paddingLeft:'2%', textAlign:'left', fontStyle:'normal'}}>Liked by Utkarsh and others</div>
    <div className='caption'>
    <span style={{fontWeight:'bold', backgroundColor:'black', paddingBottom:'2%', paddingTop:'2%',marginRight:'1%'}}>{name} {'  '} </span><span style={{fontWeight:'normal', backgroundColor:'black', paddingBottom:'2%', width:'90%',paddingTop:'2%', marginLeft:'0%'}}>
{captions}
    </span>
    </div>

    <small><Moment fromNow style={{backgroundColor:'transparent'}}>{ timeStamp ? (timeStamp.toDate()):null}</Moment></small>

    
    {(comments >= 2) && (
     <div>
     <div style={{backgroundColor:'black', color:'grey', paddingLeft:'3%', paddingTop:'2%', paddingBottom:'1%'}}>{comments} comments</div>    </div>
    )
    }

  {(comments == 1) && (
     <div>
     <div style={{backgroundColor:'black', color:'grey', paddingLeft:'3%', paddingTop:'2%', paddingBottom:'1%'}}>{comments} comment</div>    </div>
    )
    }
   

    <div style={{color:'white',backgroundColor:'black',paddingLeft:'3%', fontSize:'small', overflow:'scroll', height:'42vh'}}>
    {commentTree && 
    (commentTree.map((comment) => 
      {
        return <Comment key={comment.id} comment={comment}></Comment>
      }
    )
    )}
  </div>

  <div style={{position:'absolute', display:'flex', flexDirection:'row', backgroundColor:'black', height:'fit-content',bottom:'11px', width:'40%'}}>
<Avatar
    alt="preview image"
    src={profilePicUrl}
    sx={{ width: 25, height: 25, marginTop:'1%', marginLeft:'3%'}}
    />
    <input placeholder='Add a comment....' style={{backgroundColor:'black', width:'90%',borderTop:'none',borderLeft:'none',borderRight:'none', borderBottom:'1px solid white', paddingLeft:'2%', height:'6vh', color:'white' }} onChange={(event)=>{SetComCaption(event.target.value)}}>
    </input>
    <button style={{backgroundColor:'black', width:'fit-content', textAlign:'left', height:'6vh', marginTop:'0.4%', color:'deepskyblue',fontSize:'large'}} onClick={addComment}>Post</button>
    </div>
    <div className='footer'></div>
    </div>
    </div>
    </nav>
  </div>);
}

export default HashFeedPost;