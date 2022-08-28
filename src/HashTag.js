import { getDoc, doc, getDocs, query, orderBy,collection } from 'firebase/firestore';
import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import {db} from './firebase-config';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import GridImg from './GridImg';
import HashFeedPost from './HashFeedPost';
import Grid from './Grid';
import './css/HashTag.css'
import Header from './Header';
import { textAlign } from '@mui/system';
import {FcNext, FcPrevious} from 'react-icons/fc';
import {MdKeyboardBackspace} from 'react-icons/md';


const  HashTag=()=> {

    const {hash}=useParams();
    const[val, setVal]=useState(null);
    const[posts, setPosts]=useState(null);
    const[recentPosts, setRecentPosts]=useState(null);
    const[popular, setPopular]=useState(true);
    const[recent, setRecent]=useState(false);
    const[recentClicked, setRecentClicked]=useState(false);
    const[popularClicked, setPopularClicked]=useState(false);
    const [postArray, SetPostArray]=useState();
    const [index, SetIndex]=useState([]);
    const[collectionSize, SetCollectionSize]=useState();

    useEffect(() => {
        const getHashVal=async()=>{

        const tag = '#' + hash;
        
        const docRef = doc(db, `hashtags`,`${tag}`)
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            setVal(docSnap.data().val);
        }
        }

        getPopularPosts();
        getHashVal();
    }, [])

    const getPopularPosts=async ()=>{
        const tag = '#' + hash;
        const docRef = collection(db, `hashtags/${tag}/posts`)
        const q = query(docRef, orderBy("likes","desc"));
        const docSnap = await getDocs(q);
        if(docSnap.size>0){
            setPosts(docSnap.docs.map((doc)=>({...doc.data(), id: doc.id})));
            let mymap = docSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
            let keys = [...mymap.values()]
            SetCollectionSize(keys.length);
            SetPostArray(keys);
        }
        else{
            setPosts(null);
        }
        console.log("Got popular posts")
    }

    const getRecentPosts=async ()=>{
        const tag = '#' + hash;
        const docRef = collection(db, `hashtags/${tag}/posts`)
        const q = query(docRef, orderBy("createdAt","desc"));
        const docSnap = await getDocs(q);
        if(docSnap.size>0){
            setRecentPosts(docSnap.docs.map((doc)=>({...doc.data(), id: doc.id})));
            let mymap = docSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
            let keys = [...mymap.values()]
            SetCollectionSize(keys.length);
            SetPostArray(keys);
        }
        else{
            setRecentPosts(null);
        }
    }

    const handleButtonPopular=()=>{
    if(popular === false){
        getPopularPosts();
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

    const getIndex=(item)=>{
        var index = 0;
        postArray.forEach((post)=>{
          if(post.postId === item){
            SetIndex(index);
            console.log("index",index);
          }
          else{
            index=index+1;
          }
        })
      }

      const handleButtonClosePopularPosts=()=>{
        setPopularClicked(false);
      }

      const handleButtonCloseRecentPosts=()=>{
        setRecentClicked(false);
      }

      const goToNextPost = () => {
        if(index < collectionSize-1){
            SetIndex((index) => index + 1);
            console.log("going to next post")
        }
          };
        
          const goToPreviousPost = () => {
            if(index >= 1 ){
              SetIndex((index) => index - 1);
            console.log("going to previous post")
          }
          };
        


   const  handleButtonPopularClicked=(item)=>{
    getIndex(item);
    setPopularClicked(true)
    console.log("set popular clicked true")
    }

    const  handleButtonRecentClicked=(item)=>{
        getIndex(item);
        setRecentClicked(true)
    }
 
    console.log(posts);
return(<div className='HashTag'>
    <nav>
    <div className='divider'>
    <Header></Header>

    {popularClicked && popular && posts &&(
    <div className="indPost" style={{zIndex:2}}>
     <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
      <div style={{width:'10%', display:'flex', flexDirection:'column'}}> 
      <MdKeyboardBackspace style={{marginTop:'10%', width:'100%', height:'5%', cursor:'pointer'}} onClick={()=>{handleButtonClosePopularPosts()}}>Back</MdKeyboardBackspace>
      <FcPrevious style={{color:'white', marginTop:'150%', width:'100%', cursor:'pointer'}} disabled={index === 0} onClick={()=>{goToPreviousPost()}}>Previous</FcPrevious>
      
      </div>
      <div style={{width:'80%'}}>
          <HashFeedPost postid={postArray[index].postId} authorId={postArray[index].authorId}></HashFeedPost>
          </div>
      <div style={{width:'10%', color:'white'}}><FcNext style={{ marginLeft:'0%', color:'white', width:'100%', marginTop:'180%', cursor:'pointer'}} disabled={index === collectionSize - 1} onClick={()=>{goToNextPost()}} >Next</FcNext></div>
      </div>
      </div>
)}



{recentClicked && recent && recentPosts &&(
      <div className="indPost" style={{zIndex:2}}>
      <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
       <div style={{width:'10%', display:'flex', flexDirection:'column'}}> 
       <MdKeyboardBackspace style={{marginTop:'10%', width:'100%', height:'5%', cursor:'pointer'}} onClick={()=>{handleButtonCloseRecentPosts()}}>Back</MdKeyboardBackspace>
       <FcPrevious style={{color:'white', marginTop:'150%', width:'100%', cursor:'pointer'}} disabled={index === 0} onClick={()=>{goToPreviousPost()}}>Previous</FcPrevious>
       
       </div>
       <div style={{width:'80%'}}>
           <HashFeedPost postid={postArray[index].postId} authorId={postArray[index].authorId}></HashFeedPost>
           </div>
       <div style={{width:'10%', color:'white'}}><FcNext style={{ marginLeft:'0%', color:'white', width:'100%', marginTop:'180%', cursor:'pointer'}} disabled={index === collectionSize - 1} onClick={()=>{goToNextPost()}} >Next</FcNext></div>
       </div>
       </div>
        
)}

    <div style={{padding:'0'}} >
    <div style={{float:'right', width:'100%', textAlign:'right', backgroundColor:'transparent'}}><BiDotsVerticalRounded style={{color:'white', height:'40px', width:'40px',backgroundColor:'transparent'}}/></div>
    <div  className='hash'>#{hash}</div>
    <div style={{fontSize:'large', color:'grey', paddingBottom:'2%', width:'100%', textAlign:'center'}} >{val}{' '} posts</div>
    
    <div className='secondTray'>
    <div className='rowCategory'>
      
     <div className={`popular ${popular?"underlined":""}`} onClick={handleButtonPopular}>Popular</div>
     
    <div className={`recent ${recent?"underlined":""}`}  onClick={handleButtonRecent}>Recent</div> 
    
      </div>
    <div className='posts'>
        
{popular && posts &&(
       posts.map((post)=>
        {return <div className="indGrid"  onClick={()=>{handleButtonPopularClicked(post.postId)}}>
          <Grid postid={post.postId} authorId={post.authorId}></Grid>
          {console.log("post is not null")}
          </div>
        })
)}

{recent && recentPosts &&(
       recentPosts.map((post)=>
        {return <div className="indGrid" onClick={()=>{handleButtonRecentClicked(post.postId)}} >
          <Grid postid={post.postId} authorId={post.authorId} ></Grid>
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