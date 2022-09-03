import { getDoc, doc, getDocs, query, orderBy,collection } from 'firebase/firestore';
import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import {db, auth} from './firebase-config';
import {BiDotsVerticalRounded } from 'react-icons/bi';
import GridImg from './GridImg';
import HashFeedPost from './HashFeedPost';
import Grid from './Grid';
import './css/HashTag.css'
import Header from './Header';
import { textAlign } from '@mui/system';
import {FcNext, FcPrevious} from 'react-icons/fc';
import {MdKeyboardBackspace} from 'react-icons/md';
import * as ReactBootstrap from 'react-bootstrap'




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
    const[loading, SetLoading]=useState(true);
    const[blocked, SetBlocked]= useState(null);
    const[muted, SetMuted]= useState(null);
    const[restricted, SetRestricted]= useState(null);

    useEffect(() => {
        const getHashVal=async()=>{

        const tag = '#' + hash;
        
        const docRef = doc(db, `hashtags`,`${tag}`)
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            setVal(docSnap.data().val);
        }
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
          if(arrm!==null){
          SetMuted(arrm);}
          else{
            SetMuted([0]);
          }
          }else{
            SetMuted([0]);
          }

      
          var arrr =[];
          const restrictRef = collection(db, `users/${auth.currentUser.uid}/restrictedUsers`)
          const resSnap = await getDocs(restrictRef);
          if(resSnap.size>0){
          let mymap2 = resSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
          keys2 = [...mymap2.values()]
          keys2.forEach((key)=>{
            arrr.push(key.id);
          })
          if(arrr!==null){
          SetRestricted(arrr);}
          else{
            SetRestricted([0]);
          }
        }else{
          SetRestricted([0]);
        }
      
          var arrb =[];
          const blockRef = collection(db, `users/${auth.currentUser.uid}/blockedUsers`)
          const blockSnap = await getDocs(blockRef);
          if(blockSnap.size>0){
          let mymap3 = blockSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
          keys3 = [...mymap3.values()]
          keys3.forEach((key)=>{
            arrb.push(key.id);
          })
        
          if(arrb!==null){
          SetBlocked(arrb);}
          else{
            SetBlocked([0]);
          }
        }
        else{
          SetBlocked([0]);
        }
        }

        getStatus();
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
            SetLoading(false);
        }
        else{
            setPosts("null");
            SetLoading(false);
        }
       
    }

    const getRecentPosts=async ()=>{
        SetLoading(true);
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
            SetLoading(false);
        }
        else{
            setRecentPosts("null");
            SetLoading(false);
        }
    }

    const handleButtonPopular=()=>{
    SetLoading(true);  
    if(popular === false){
        getPopularPosts();
        setPopular(true);
        setRecent(false);
    }
    SetLoading(false); 
    
    }

    const handleButtonRecent=()=>{
      SetLoading(true); 
        if(recent === false){
            getRecentPosts();
            setRecent(true);
            setPopular(false);
        }
        SetLoading(false); 
    }

    const getIndex=(item)=>{
        var index = 0;
        postArray.forEach((post)=>{
          if(post.postId === item){
            SetIndex(index);
            
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
           
        }
          };
        
          const goToPreviousPost = () => {
            if(index >= 1 ){
              SetIndex((index) => index - 1);
           
          }
          };
        


   const  handleButtonPopularClicked=(item)=>{
    getIndex(item);
    setPopularClicked(true)

    }

    const  handleButtonRecentClicked=(item)=>{
        getIndex(item);
        setRecentClicked(true)
    }
 
 
return(<div className='HashTag'>
    <nav>
    <Header></Header>
    <div className='divider'>
    {popularClicked && popular && posts &&(
    <div className="indPost" style={{zIndex:2}}>
     <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
      <div style={{width:'10%', display:'flex', flexDirection:'column'}}> 
      <MdKeyboardBackspace style={{marginTop:'15%', width:'100%', height:'5%', cursor:'pointer'}} onClick={()=>{handleButtonClosePopularPosts()}}>Back</MdKeyboardBackspace>
      <FcPrevious style={{color:'white', marginTop:'150%', width:'100%', cursor:'pointer'}} disabled={index === 0} onClick={()=>{goToPreviousPost()}}>Previous</FcPrevious>
      
      </div>
      <div style={{width:'80%'}}>
          <HashFeedPost postid={postArray[index].postId} authorId={postArray[index].authorId} allowComments={postArray[index].allowComments}></HashFeedPost>
          </div>
      <div style={{width:'10%', color:'white',backdropFilter:'blur(8px)'}}><FcNext style={{ marginLeft:'0%', color:'white', width:'100%', marginTop:'180%', cursor:'pointer'}} disabled={index === collectionSize - 1} onClick={()=>{goToNextPost()}} >Next</FcNext></div>
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

    <div style={{padding:'0', backgroundColor:'black'}} >
    <div style={{float:'right', width:'100%', textAlign:'right', backgroundColor:'transparent'}}><BiDotsVerticalRounded style={{color:'white', height:'40px', width:'40px',backgroundColor:'transparent'}}/></div>
    <div  className='hash'>#{hash}</div>
    <div style={{fontSize:'large', color:'grey', paddingBottom:'2%', width:'100%', textAlign:'center'}} >{val}{' '} posts</div>
    
    <div className='secondTray'>
    <div className='rowCategory'>
      
     <div className={`popular ${popular?"underlined":""}`} onClick={handleButtonPopular}>Popular</div>
     
    <div className={`recent ${recent?"underlined":""}`}  onClick={handleButtonRecent}>Recent</div> 
    
      </div>
    <div className='posts'>
        
{popular && posts!=="null" && posts!==null && !loading &&(
       posts.map((post)=>
        {if ((blocked!==null) && (!(blocked.includes(post.authorId))&&!(muted.includes(post.authorId))))
          return <div className="indGrid"  onClick={()=>{handleButtonPopularClicked(post.postId)}}>
          <Grid postid={post.postId} authorId={post.authorId}></Grid>
          
          </div>
        })
)}

{popular && posts==="null" && posts!==null && !loading &&(
        <div  style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>
          No posts for this hashtag yet.
          </div>
)}

{loading && popular && (
        <div  style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>

{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Getting posts.....
          </div>
)}

{recent && recentPosts!=="null" && recentPosts!==null && !loading &&(
       recentPosts.map((post)=>
        {if ((blocked!==null) && (!(blocked.includes(post.authorId))&&!(muted.includes(post.authorId))))
          return <div className="indGrid" onClick={()=>{handleButtonRecentClicked(post.postId)}} >
          <Grid postid={post.postId} authorId={post.authorId} ></Grid>
          
         
          </div>
        })
)}

{recent && recentPosts==="null" && recentPosts!==null && !loading &&(
        <div  style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>
          No posts for this hashtag yet.
          </div>
)}

{loading && recent && (
        <div  style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}} >
 
{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '}Getting posts.....
          </div>
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