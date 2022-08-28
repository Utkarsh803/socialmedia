import './css/SavedPosts.css';
import Header from'./Header.js';
import Post from'./Post.js';
import FeedPost from './FeedPost';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc} from 'firebase/firestore';
import {signOut, onAuthStateChanged} from "firebase/auth";
import { Link } from "react-router-dom";




function SavedPosts() {

    const [userId, setUserId]=useState("");
    const [name, setUserName]=useState("");
    const [loaded, setLoaded]=useState(true);
    const [loggedIn, setLoggedIn]=useState(true);
    const [user, setUser] = useState({});
    const [feed, setFeed] = useState(null);

    useEffect(()=>{

      const getFeed=async()=>{
        try {
          const feedRef = collection(db, `users/${auth.currentUser.uid}/savedPosts`);
          const data = await getDocs(feedRef);
          if(data.size>0){
          setFeed(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
          }
          else{
            setFeed(null);
          }
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

 
  return (<div className="SavedPosts">
    <nav>
    <div className='divider'>
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
    
    
    <div className='secondTray'>
    <div className='posts'> 

  {feed &&
      (feed.map((post)=>
    {return <div className="indPost">
      <FeedPost postid={post.id} authorId={post.authorID} ></FeedPost>
      {console.log("feed is not null")}
      </div>
      
    })
  )} 

{(feed===null) &&
      (<div className="indPost" style={{textAlign:'center'}}>
      No saved posts. 
      </div>
      )
} 

  </div>
    </div>
    </div>
    </nav>
  </div>);
}

export default SavedPosts;