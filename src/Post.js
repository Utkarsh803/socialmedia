import './css/Post.css';
import logo from './mslogo.jpg';
import PostHeader from './PostHeader';
import {useState, useEffect } from "react";
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';
import PostTools from './PostTools';

function Post({handleLogout, name}) {
  const caption = "Hello this is my first post.";
  return (<div className="Post">
    <nav>
    <PostHeader handleLogout= {handleLogout} name = {name} ></PostHeader>
    <img src={logo} className="media" />
    <PostTools></PostTools>
    <div className='caption'>
      <div className='nametag'>{name} {caption}</div>
    </div>
    <div className='footer'> </div>
    </nav>
  </div>);
}

export default Post;
