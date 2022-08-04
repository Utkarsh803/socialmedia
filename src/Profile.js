import {useState, useEffect } from "react";
import {db, auth} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';

function Profile() {
  return (<div >
    <nav>
    <div>Welcome {auth.currentUser.email}!</div>
    </nav>
  </div>);
}

export default Profile;