import './css/Home.css';
import Header from'./Header.js';
import Post from'./Post.js';
import SidePanel from './SidePanel';
import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc} from 'firebase/firestore';
import {signOut, onAuthStateChanged} from "firebase/auth";
import Login from './Login';




function Home() {

  const [userId, setUserId]=useState("");
    const [name, setUserName]=useState("");
    const [loaded, setLoaded]=useState(true);
    const [loggedIn, setLoggedIn]=useState(true);
    

    const [user, setUser] = useState({});

    useEffect(() => {
    onAuthStateChanged(auth, (currentUser)=>{
            if(currentUser)
            {
                setUser(currentUser);
                setLoaded(true);
                setLoggedIn(true);
            }
            else
            {
                setUser("");
                setLoggedIn(false);
                setLoaded(true);
            }
         //   window.location='App.js';
    });},[]);


  const fetchName= async()=>{
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserName(docSnap.data().name);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  const logout = async () =>
  {
          await signOut(auth);
        

  }

 
  return (<div className="Home">
    {user ? (
    <nav>
    <div className='divider'>
    <Header handleLogout={logout} name={auth.currentUser.email}></Header>
    <div className='pagehaedspace'>
    <Post handleLogout={logout} name={name} ></Post>
    </div>
    <SidePanel/>
    </div>
    </nav>):(<Login/>)
    }

  </div>);
}

export default Home;