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




function Home() {

    const [userId, setUserId]=useState("");
    const [name, setUserName]=useState("");
    const [loaded, setLoaded]=useState(true);
    const [loggedIn, setLoggedIn]=useState(true);
    const [user, setUser] = useState({});
    const [feed, setFeed] = useState(null);

    useEffect(()=>{



      const getFeed=async()=>{
        try {
          const feedRef = collection(db, `feed/${auth.currentUser.uid}/posts`);
          const data = await getDocs(feedRef);
          const q = query(feedRef,orderBy('added', 'desc'))
          onSnapshot(q, querySnapshot=>{
            setFeed(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
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
    <nav>
    <div className='divider'>
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
    
    
    <div className='secondTray'>
    <div className='posts'> 

   {feed && (feed.map((post)=>
    {return <div className="indPost">
      <FeedPost postid={post.postID} authorId={post.author} ></FeedPost>
      {console.log("feed is not null")}
      </div>
      
    }))}

  {(feed===null) &&
        (<div className="indPost" style={{textAlign:'center'}}>
        No posts to show. Follow other users to view their posts. 
        </div>
        )
  } 

    </div>
    </div>
 
 



    <SidePanel/>
  
    </div>
    <div>

    </div>
    </nav>
  </div>);
}

export default Home;