import {useState, useEffect } from "react";
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';

function Fetch() {

    const usersCollectionRef = collection(db, "users");
  return (<div>
    <nav>
    <image></image>
    <div>Welcome {name}!</div>
    <button onClick={handleLogout}>Logout</button>
    </nav>
  </div>);
}

export default Fetch;
