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
import * as ReactBootstrap from 'react-bootstrap'





function SavedPosts() {

    const [userId, setUserId]=useState("");
    const [name, setUserName]=useState("");
    const [loading, setLoading]=useState(true);
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
          setLoading(false);
          }
          else{
            setFeed("null");
            setLoading(false);
          }
        }
      catch(error){
        console.log(error);
        setLoading(false);
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

    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
    <div style={{paddingTop:'7%'}}>    
    
    <div className='secondTray'>
    <div className='posts'> 

  {feed!==null && !loading && feed!=="null" &&
      (feed.map((post)=>
    {
      return <div className="indPost">
      <FeedPost postid={post.id} authorId={post.authorID} ></FeedPost>
      {console.log("feed is not null")}
      </div>
      
    })
  )} 

{feed!==null && !loading && feed==="null" &&
      (<div style={{width:'100%',marginTop:'20%', textAlign:'center', color:'#666'}}>
      No saved posts. 
      </div>
      )
} 

{loading && 
      (<div style={{width:'100%',marginTop:'7%', textAlign:'center', color:'#666'}}>
{<ReactBootstrap.Spinner animation="border" size="sm"/>}{' '} Getting posts....
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