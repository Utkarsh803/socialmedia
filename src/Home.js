import './css/Home.css';
import Header from'./Header.js';
import Post from'./Post.js';

import FeedPost from './FeedPost';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc} from 'firebase/firestore';
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
      getFeed();
    }, [] );


  const getFeed=async()=>{
    try {
      const feedRef = collection(db, `feed/${auth.currentUser.uid}/posts`);
      const data = await getDocs(feedRef);
      setFeed(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
  }
  catch(error){
    console.log(error);
  }
}



  const logout = async () =>
  {
          await signOut(auth);
        

  }


 
  return (<div className="Home">
    <nav>
    <div className='divider'>
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
    
    
    <div className='secondTray'>
    <ul>
        <li><Link to="/josh">Josh</Link></li>
        <li><Link to="/marie">Marie</Link></li>
      </ul>
    <div className='posts'> 
  {feed &&
      (feed.map((post)=>
    {return <div className="indPost">
      <FeedPost postid={post.postID} authorId={post.author} ></FeedPost>
      </div>
    })
  )} 
    </div>
    </div>
    <SidePanel/>
    </div>
    </nav>
  </div>);
}

export default Home;