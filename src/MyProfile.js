import './css/Home.css';
import Header from'./Header.js';
import Post from'./Post.js';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc} from 'firebase/firestore';
import {signOut, onAuthStateChanged} from "firebase/auth";




function MyProfile() {

  const [userId, setUserId]=useState("");
    const [name, setUserName]=useState("");
    const [loaded, setLoaded]=useState(true);
    const [loggedIn, setLoggedIn]=useState(true);
    

    const [user, setUser] = useState({});


  const logout = async () =>
  {
          await signOut(auth);
        

  }

 
  return (<div className="Home">
    <nav>
    <div className='divider'>
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
    </div>
    </nav>
  </div>);
}

export default  MyProfile;