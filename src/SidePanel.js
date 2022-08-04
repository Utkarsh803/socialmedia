import './css/SidePanel.css';
import {useState, useEffect } from "react";
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';

function SidePanel({handleLogout, name}) {
  return (<div className="SidePanel">
    <nav>
        <div className='trend'>Trending</div>
    </nav>
  </div>);
}

export default SidePanel;
