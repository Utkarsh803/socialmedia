import './css/UploadMedia.css';
import {useState, useEffect } from "react";
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';

function UploadMedia({handleLogout, name}) {
  return (<div className="UploadMedia">
    <nav>
    <image></image>
    <div>Welcome {name}!</div>
    <button onClick={handleLogout}>Logout</button>
    </nav>
  </div>);
}

export default UploadMedia;
