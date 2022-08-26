import { getDoc, doc, getDocs, query, orderBy,collection } from 'firebase/firestore';
import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import {db} from './firebase-config';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import GridImg from './GridImg';
import FeedPost from './FeedPost';
import Grid from './Grid';
import './css/HashTag.css'
import Header from './Header';
import { textAlign } from '@mui/system';

const  HashTag=()=> {

    const {hash}=useParams();
    const[val, setVal]=useState(null);
    const[posts, setPosts]=useState(null);
    const[recentPosts, setRecentPosts]=useState(null);
    const[popular, setPopular]=useState(true);
    const[recent, setRecent]=useState(false);
    const[recentClicked, setRecentClicked]=useState(false);
    const[popularClicked, setPopularClicked]=useState(false);

    useEffect(() => {
        const getHashVal=async()=>{

        const tag = '#' + hash;
        
        const docRef = doc(db, `hashtags`,`${tag}`)
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            setVal(docSnap.data().val);
        }
        }

        const getPopularPosts=async ()=>{
            const tag = '#' + hash;
            const docRef = collection(db, `hashtags/${tag}/posts`)
            const q = query(docRef, orderBy("likes","desc"));
            const docSnap = await getDocs(q);
            if(docSnap.size>0){
                setPosts(docSnap.docs.map((doc)=>({...doc.data(), id: doc.id})));
            }
            else{
                setPosts(null);
            }
        }

        getPopularPosts();
        getHashVal();
    }, [])

    const getRecentPosts=async ()=>{
        const tag = '#' + hash;
        const docRef = collection(db, `hashtags/${tag}/posts`)
        const q = query(docRef, orderBy("createdAt","desc"));
        const docSnap = await getDocs(q);
        if(docSnap.size>0){
            setRecentPosts(docSnap.docs.map((doc)=>({...doc.data(), id: doc.id})));
        }
        else{
            setRecentPosts(null);
        }
    }

    const handleButtonPopular=()=>{
    if(popular === false){
        setPopular(true);
        setRecent(false);
    }
    
    }

    const handleButtonRecent=()=>{
        if(recent === false){
            getRecentPosts();
            setRecent(true);
            setPopular(false);
        }
    }

   const  handleButtonPopularClicked=()=>{
    setPopularClicked(true)
    console.log("set popular clicked true")
    }

    const  handleButtonRecentClicked=()=>{
        setRecentClicked(true)
    }
 
    console.log(posts);
return(<div className='HashTag'>
    <nav>
    <div className='divider'>
    <Header></Header>
    <div style={{padding:'0'}}>
    <div style={{float:'right', width:'100%', textAlign:'right', backgroundColor:'transparent'}}><BiDotsVerticalRounded style={{color:'white', height:'40px', width:'40px',backgroundColor:'transparent'}}/></div>
    <div style={{color:'white', fontSize:'xxx-large', paddingLeft:'2%', width:'100%', textAlign:'center'}}>#{hash}</div>
    <div style={{fontSize:'large', color:'grey', paddingBottom:'2%', width:'100%', textAlign:'center'}} >{val}{' '} posts</div>
    
    <div className='secondTray'>
    <div className='rowCategory'>
      
     <div className={`popular ${popular?"underlined":""}`} onClick={handleButtonPopular}>Popular</div>
     
    <div className={`recent ${recent?"underlined":""}`}  onClick={handleButtonRecent}>Recent</div> 
    
      </div>
    <div className='posts'>
        
{!popularClicked && popular && posts &&(
       posts.map((post)=>
        {return <div className="indGrid"  onClick={handleButtonPopularClicked}>
          <Grid postid={post.postId} authorId={post.authorId}></Grid>
          {console.log("post is not null")}
          </div>
        })
)}

{popularClicked && popular && posts &&(
       posts.map((post)=>
        {return <div className="indPost">
          <FeedPost postid={post.postId} authorId={post.authorId}></FeedPost>
          {console.log("post is not null")}
          </div>
        })
)}

{!recentClicked && recent && recentPosts &&(
       recentPosts.map((post)=>
        {return <div className="indGrid" onClick={handleButtonRecentClicked} >
          <Grid postid={post.postId} authorId={post.authorId} ></Grid>
          {console.log("post is not null")}
          </div>
        })
)}

{recentClicked && recent && recentPosts &&(
       recentPosts.map((post)=>
        {return <div className="indPost">
          <FeedPost postid={post.postId} authorId={post.authorId}> </FeedPost>
          {console.log("post is not null")}
          </div>
        })
)}



    </div>
    </div>
    </div>
    </div>
    </nav>
    </div>
)
}

export default HashTag;