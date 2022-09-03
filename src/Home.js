import './css/Home.css';
import Header from'./Header.js';
import Post from'./Post.js';

import FeedPost from './FeedPost';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, orderBy, query, onSnapshot, limit} from 'firebase/firestore';
import {signOut, onAuthStateChanged} from "firebase/auth";
import { Link } from "react-router-dom";
import * as ReactBootstrap from 'react-bootstrap'




function Home() {

    const [userId, setUserId]=useState("");
    const [name, setUserName]=useState("");
    const [loading, setLoading]=useState(true);
    const [loggedIn, setLoggedIn]=useState(true);
    const [user, setUser] = useState({});
    const [feed, setFeed] = useState(null);
    const[blocked, SetBlocked]= useState(null);
    const[muted, SetMuted]= useState(null);
    const[restricted, SetRestricted]= useState(null);

    useEffect(()=>{



      const getFeed=async()=>{
        try {
          const feedRef = collection(db, `feed/${auth.currentUser.uid}/posts`);
        const data = await getDocs(feedRef);
          const q = query(feedRef,orderBy('added', 'desc'))
          onSnapshot(q, querySnapshot=>{
            if(querySnapshot.size>=1){
            const newquery = querySnapshot.filter(x => !blocked.includes(x)|| !muted.includes(x))
            setFeed(newquery.docs.map((doc)=>({...doc.data(), id: doc.id})));
            setLoading(false);
          }
            else{
              setFeed("null");
              setLoading(false);
            }
          })
        }
      catch(error){
        console.log(error);
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
      getFeed();
      
    }, [] );






  const logout = async () =>
  {
          await signOut(auth);
        

  }

 
  return (<div className="Home">
   
 
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
    
    <div style={{display:'flex', flexDirection:'row', paddingTop:'100px'}}>
    <div className='secondTray'>
    <div className='posts'> 

   {!loading && feed !=="null" && feed!== null &&
   (
   (feed.map((post)=>
    {if ((blocked!==null) && (!(blocked.includes(post.author))&&!(muted.includes(post.author))))
      return <div className="indPost">
      <FeedPost postid={post.postID} authorId={post.author} allowComments={post.allowComments}></FeedPost>
     
      </div>
      
    })))}

{!loading && feed ==="null" && feed!== null &&
   (
<div className="indPost" style={{textAlign:'center', marginTop:'40%', color:'#666'}}>
        No posts to show. Follow other users to view their posts. 
        </div>)}


{loading &&
        (<div className="indPost" style={{textAlign:'center'}}>
        {<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '} Getting posts..... 
        </div>
        )
  } 

    </div>
    </div>
 
 



    <SidePanel/>
    </div>
    
    <div>

    </div>
   
  </div>);
}

export default Home;