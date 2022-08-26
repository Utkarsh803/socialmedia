import {useState, useEffect } from "react";
import './css/SearchResult.css';
import {CgProfile} from 'react-icons/cg';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import {db, auth, storage} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, getDoc, deleteDoc, doc, setDoc, serverTimestamp,query, where, Timestamp, onSnapshot, QuerySnapshot} from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import {ref ,getStorage,  uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { AiOutlineHeart,AiFillHeart} from 'react-icons/ai';
import Moment from 'react-moment'
import { async } from "@firebase/util";

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
  const[reply,SetReply]=useState(false);
  const[commentInput,SetCommentInput]=useState(null);
  const[commentLikes,SetCommentLikes]=useState(comment.likes);

  


  useEffect(()=>{
    const getPostPic=async()=>{

        const docRef = doc(db, "users",`${comment.author}`)
        const docSnap = await getDoc(docRef);
        SetName(docSnap.data().username);


        getDownloadURL(ref(storage, `${comment.author}/${docSnap.data().profilePic}`))
        .then((url) => {
          SetImageUrl(url);
        console.log("got profile pic")
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

          const getCommentNum=async()=>{
            const comRef = doc(db, `users/${comment.postAuthor}/comments/`, `${comment.postid}`)
            const data = await getDoc(comRef);
        
            if(data.exists()){
              SetTotalComments(data.data().totalComments);
              console.log("There are"+data.data().totalComments+"comments on this post");
            }
            else{
              SetTotalComments(null);
          }
          }


       const getLiked =async()=>{
            const docRef = doc(db, `/users/${comment.postAuthor}/commentsLikes/${comment.postid}/ids/${comment.id}/ids`, `${auth.currentUser.uid}`);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
              SetLike(true)
            }
            else{
              SetLike(false)
            }
          }

        
        getLiked();  
        getCommentNum();
        getPostPic();
  }, [] );

  
  const addTotalPostComments=async()=>{
    try
    {  
       incCommentNum();
       const num = totalComments+1;
       const usersCollectionRef = doc(db, `/users/${comment.postAuthor}/comments/${comment.postid}/ids`, `${num}`);
       await setDoc(usersCollectionRef,{
         id: totalComments+1,
         parent:comment.id,
         comment: commentInput,
         author:auth.currentUser.uid,
         postAuthor:comment.postAuthor,
         postid:comment.postid,
         timeStamp:Timestamp.fromDate(new Date()),
       });      
       SetTotalComments(totalComments+1);
        console.log("Author ID: "+comment.postAuthor);
        console.log("Post ID: "+comment.postid);
        console.log("Added a comment");
         } 
   catch(error)
   {
       console.log(error.message);
       console.log("Comment was not registered :("); 
   }
  }

  const incCommentNum=async()=>{
    const comRef = doc(db, `users/${comment.postAuthor}/comments`, `${comment.postid}`)
    const newfield={totalComments:totalComments+1};
    const data = updateDoc(comRef, newfield);
    console.log("total counts updated  incCommentNum");
  }

  const addToPostComments=async()=>{
    try{
      const userDoc = doc(db, `/users/${comment.postAuthor}/posts`, `${comment.postid}`);
      const newFields = {comments: totalComments + 1};
      await updateDoc(userDoc, newFields);
      console.log("total counts updated addPostComments");
    }
    catch(error){
      console.log(error);
    }
    }


    const addComment=async()=>{   
    SetReply(null); 
    addTotalPostComments();
    addToPostComments();
    console.log(comment.postAuthor)
    console.log( auth.currentUser.uid)
    if(comment.postAuthor != auth.currentUser.uid){
    const NotRef = collection(db, `users/${comment.postAuthor}/notifications`);
    await addDoc(NotRef,{
    type:"comment",
    content:"Replied to a comment.",
    author:auth.currentUser.uid,
    postid:comment.postid,
    timeStamp:Timestamp.fromDate(new Date()),
  })
  console.log("Posted a notification about a comment.")
}

}


const  addCommentLikes=async()=>{

const usersCollectionRef = doc(db, `/users/${comment.postAuthor}/comments/${comment.postid}/ids`, `${comment.id}`);
const docRef = updateDoc(usersCollectionRef,{
  likes:commentLikes+1,
})

SetCommentLikes(commentLikes+1);
console.log("added likes")
}



const  addUserToLikeList=async()=>{
const docRef = doc(db, `/users/${comment.postAuthor}/commentsLikes/${comment.postid}/ids/${comment.id}/ids`, `${auth.currentUser.uid}`);
await setDoc(docRef, {
  createdAt:Timestamp.fromDate(new Date()),
  author:auth.currentUser.uid,
})
console.log("added user to ike list")
}

  const handleButtonLike=()=>{
    SetLike(true);
    addCommentLikes();
    addUserToLikeList();
  }

  
const  subCommentLikes=()=>{

  const usersCollectionRef = doc(db, `/users/${comment.postAuthor}/comments/${comment.postid}/ids`, `${comment.id}`);
  const docRef = updateDoc(usersCollectionRef,{
    likes:commentLikes-1,
  })
  
  SetCommentLikes(commentLikes-1);
  console.log("subbed likes")
  }
  
  
  
  const  subUserToLikeList=async()=>{
  const docRef = doc(db, `/users/${comment.postAuthor}/commentsLikes/${comment.postid}/ids/${comment.id}/ids`, `${auth.currentUser.uid}`);
  await deleteDoc(docRef)
  console.log("deleted user to ike list")
  }
  

  const handleButtonUnlike=()=>{
    SetLike(false);
    subCommentLikes();
    subUserToLikeList();
  }

  const handleButtonReply=()=>{
    SetReply(!reply);
  }

  return (
    <div style={{backgroundColor:'black'}}>
    {comment.parent===null ?
    (
    <div style={{ display:'flex',flexDirection:'column',marginLeft: '0px', marginTop: '0px' ,backgroundColor:'black', color:'white', paddingBottom:'3%'}}>
    <div style={{display:'flex',flexDirection:'row',backgroundColor:'black', color:'white'}}>
    <Avatar
    alt="preview image"
    src={imageUrl}
    sx={{ width: 26, height: 26, marginTop:'2%'}}
    />
      <div
        style={{ color: '#555',fontSize: '10pt',backgroundColor:'black', color:'white', paddingTop:'3%', paddingLeft:'2%'}}
      >
        {name}
      </div>
      </div>
      <div style={{backgroundColor:'black', color:'white', fontSize: '10pt', marginLeft:'7%', marginTop:'1%'}}>{comment.comment}</div>
      <div style={{display:'flex', flexDirection:'row', backgroundColor:'black',marginLeft:'7%', paddingTop:'2%', paddingBottom:'2%'}}>
        <div style={{color:'grey', backgroundColor:'black', paddingRight:'2%'}}><Moment fromNow ago style={{backgroundColor:'transparent', color:'grey'}}>{ comment.timeStamp ? (comment.timeStamp.toDate()):null}</Moment></div>
        <div style={{color:'grey', backgroundColor:'black', paddingRight:'2%'}}>{commentLikes} likes</div>
        <div style={{color:'grey', backgroundColor:'black'}} onClick={handleButtonReply}>Reply </div>
        {like ? (<AiFillHeart style={{position:'relative', bottom:'20px',color:'red', backgroundColor:'black', paddingRight:'2%', outlineColor:'red',marginRight:'1%' ,marginLeft:'auto'}} onClick={handleButtonUnlike}/>):(<AiOutlineHeart style={{position:'relative', bottom:'20px',color:'white', backgroundColor:'black', paddingRight:'2%',outlineColor:'white',marginRight:'1%' ,marginLeft:'auto'}} onClick={handleButtonLike}/>)}
      </div>
      {reply &&(
        <div style={{display:'flex', flexDirection:'row', backgroundColor:'black', color:'white', paddingLeft:'7%', height:'50px'}}>
        <input placeholder="your reply..." style={{backgroundColor:'black', color:'white', border:'none', borderBottom:'1px solid white', height:'20px',paddingTop:'6%'}} onChange={(event)=>{SetCommentInput(event.target.value)}}></input>
        <button  style={{backgroundColor:'black', color:'white', height:'fit-content', width:'fit-content'}} onClick={addComment}>Post</button>
        </div>
        )}
      {nestedComments}
    </div>
    ):
    (
      <div style={{ display:'flex',flexDirection:'column', paddingTop: '5px' ,backgroundColor:'black', color:'white', marginLeft:'7%', borderLeft:'0.5px solid grey',  paddingBottom:'2%'}}>
      <div style={{display:'flex',flexDirection:'row',backgroundColor:'black', color:'white',marginLeft:'2%'}}>
      <Avatar
      alt="preview image"
      src={imageUrl}
      sx={{ width: 26, height: 26, marginTop:'2%'}}
      />
        <div
          style={{ color: '#555',fontSize: '10pt',backgroundColor:'black', color:'white', paddingTop:'3%', paddingLeft:'2%'}}
        >
          {name}
        </div>
        </div>
        <div style={{backgroundColor:'black', color:'white', fontSize: '10pt', marginLeft:'7%', marginTop:'1%', paddingLeft:'2.5%'}}>{comment.comment}</div>
        <div style={{display:'flex', flexDirection:'row', backgroundColor:'black',marginLeft:'7%', paddingTop:'2%', paddingBottom:'2%', paddingLeft:'2.5%'}}>
          <div style={{color:'grey', backgroundColor:'black', paddingRight:'2%'}}><Moment fromNow ago style={{backgroundColor:'transparent', color:'grey'}}>{ comment.timeStamp ? (comment.timeStamp.toDate()):null}</Moment></div>
          <div style={{color:'grey', backgroundColor:'black', paddingRight:'2%'}}>{commentLikes} likes</div>
          <div style={{color:'grey', backgroundColor:'black'}} onClick={handleButtonReply}>Reply</div>
          {like ? (<AiFillHeart style={{position:'relative', bottom:'20px',color:'red', backgroundColor:'black', paddingRight:'2%', outlineColor:'red',marginRight:'1%' ,marginLeft:'auto'}} onClick={handleButtonUnlike}/>):(<AiOutlineHeart style={{position:'relative', bottom:'20px',color:'white', backgroundColor:'black', paddingRight:'2%',outlineColor:'white',marginRight:'1%' ,marginLeft:'auto'}} onClick={handleButtonLike}/>)}
        </div>
        {reply &&(
        <div style={{display:'flex', flexDirection:'row', backgroundColor:'black', color:'white', paddingLeft:'7%', height:'50px'}}>
        <input placeholder="your reply..." style={{backgroundColor:'black', color:'white', border:'none', borderBottom:'1px solid white', height:'20px',paddingTop:'6%'}} onChange={(event)=>{SetCommentInput(event.target.value)}}></input>
        <button  style={{backgroundColor:'black', color:'white', height:'fit-content', width:'fit-content'}} onClick={addComment}>Post</button>
        </div>
        )}
        {nestedComments}
      </div>
    )}
    </div>
  )
}

export default Comment;