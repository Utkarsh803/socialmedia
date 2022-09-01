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

    useEffect(()=>{


      fetch('https://the-dune-api.herokuapp.com/quotes/3')
      .then((response)=>response.json())
      .then((data)=>{
        console.log("Array of Dune Quotes");
        console.log(data);
      })
      .catch((err)=>{
        console.log(err.message);
      });


      const getFeed=async()=>{
        try {
          const feedRef = collection(db, `feed/${auth.currentUser.uid}/posts`);
        const data = await getDocs(feedRef);
          const q = query(feedRef,orderBy('added', 'desc'))
          onSnapshot(q, querySnapshot=>{
            if(querySnapshot.size>=1){
            setFeed(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
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

      getFeed();
      console.log("got feed");
    }, [] );






  const logout = async () =>
  {
          await signOut(auth);
        

  }

 
  return (<div className="Home">
   
 
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
    
    <div style={{display:'flex', flexDirection:'row', paddingTop:'9%'}}>
    <div className='secondTray'>
    <div className='posts'> 

   {!loading && feed !=="null" && feed!== null &&
   (
   (feed.map((post)=>
    {
      return <div className="indPost">
      <FeedPost postid={post.postID} authorId={post.author} allowComments={post.allowComments}></FeedPost>
      {console.log("feed is not null")}
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