import {useState, useEffect } from "react";
import './css/SearchResult.css';
import {CgProfile} from 'react-icons/cg';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, getDoc, deleteDoc, doc, setDoc, serverTimestamp,query, where} from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { AiOutlineHeart,AiFillHeart} from 'react-icons/ai';


const Comment = ({ comment })=> {

  const nestedComments = (comment.children || []).map((comment) => {
    return <Comment key={comment.id} comment={comment} type="child" />
  })

  const[imageUrl, SetImageUrl]=useState(null);
  const[name, SetName]=useState(null);
  const[commentTree, SetCommentTree]=useState(null);
  const[postUrl, SetPostUrl]=useState(null);
  const[commentss, SetComments]=useState(null);
  const[totalComments, SetTotalComments]=useState(null);
  const[like,SetLike]=useState(null);

  useEffect(()=>{
    const getPostPic=async()=>{

        const docRef = doc(db, "users",`${comment.author}`)
        const docSnap = await getDoc(docRef);
        SetName(docSnap.data().username);


        getDownloadURL(ref(storage, `${comment.author}/${docSnap.data().profilePic}`))
        .then((url) => {
          SetImageUrl(url);
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
/*
          const getCommentNum=async(authorId, postid)=>{
            const comRef = doc(db, `users/${authorId}/comments/`, `${postid}`)
            const data = await getDoc(comRef);
        
            if(data.exists()){
              SetTotalComments(data.data().totalComments);
              console.log("There are"+data.data().totalComments+"comments on this post");
            }
            else{
              SetTotalComments(null);
          }
          }
*/
        getPostPic();
  }, [] );

  /*
  const addTotalPostComments=async(parentid, postid)=>{
    try
    {  
       incCommentNum(authorId, postid);
       const usersCollectionRef = doc(db, `/users/${auth.currentUser.uid}/comments/${postid}/ids`, `${auth.currentUser.uid}`);
       await setDoc(usersCollectionRef,{
         id: totalComments+1,
         parent:parentid,
         comment: comment,
         author:auth.currentUser.uid,
         postid:postid,
         timeStamp:serverTimestamp()
       });      
        SetTotalComments(totalComments+1);
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

  const incCommentNum=async(authorId, postid)=>{
    const comRef = doc(db, `users/${authorId}/comments`, `${postid}`)
    const newfield={totalComments:totalComments+1};
    const data = updateDoc(comRef, newfield);

    console.log("total counts updated");
  }

  const addToPostComments=async(authorId, postid)=>{
    try{
      const userDoc = doc(db, `/users/${authorId}/posts`, `${postid}`);
      const newFields = {comments: totalComments + 1};
      await updateDoc(userDoc, newFields);
    }
    catch(error){
      console.log(error);
    }
    }

    const addComment=async(parentid, postid)=>{    
    addTotalPostComments(parentid,authorId, postid);
    addToPostComments(authorId, postid);
    console.log(authorId)
    console.log( auth.currentUser.uid)
    if(authorId != auth.currentUser.uid){
    const NotRef = collection(db, `users/${authorId}/notifications`);
    await addDoc(NotRef,{
    type:"comment",
    content:"commented on your post.",
    author:auth.currentUser.uid,
    postid:postid,
    timeStamp:serverTimestamp(),
  })
  console.log("Posted a notification about a comment.")
}
}
*/

  const handleButtonLike=()=>{
    SetLike(!like);
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',marginLeft: '0px', marginTop: '0px' ,backgroundColor:'black', color:'white'}}>
    <div style={{display:'flex',flexDirection:'row',backgroundColor:'black', color:'white'}}>
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 26, height: 26, marginTop:'2%'}}
    />
      <div
        style={{ color: '#555',fontSize: '10pt',backgroundColor:'black', color:'white', paddingTop:'3%', paddingLeft:'2%' }}
      >
        {name}
      </div>
      </div>
      <div style={{backgroundColor:'black', color:'white', fontSize: '10pt', marginLeft:'7%', marginTop:'1%'}}>{comment.comment}</div>
      <div style={{display:'flex', flexDirection:'row', backgroundColor:'black',marginLeft:'7%', paddingTop:'1%'}}>
        <div style={{color:'white', backgroundColor:'black', paddingRight:'2%'}}>6w</div>
        <div style={{color:'white', backgroundColor:'black', paddingRight:'2%'}}>2 likes</div>
        <div style={{color:'white', backgroundColor:'black', paddingRight:'70%'}}>Reply</div>
        {like ? (<AiFillHeart style={{position:'relative', bottom:'20px',color:'red', backgroundColor:'black', paddingRight:'2%', outlineColor:'red'}} onClick={handleButtonLike}/>):(<AiOutlineHeart style={{position:'relative', bottom:'20px',color:'white', backgroundColor:'black', paddingRight:'2%',outlineColor:'white'}} onClick={handleButtonLike}/>)}
      </div>
      {nestedComments}
    </div>
  )
}

export default Comment;