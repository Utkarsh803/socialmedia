import firebase from 'firebase'
import {auth} from './firebase-config';
import {db} from './firebase-config';
import {collection, getDoc, addDoc, updateDoc, deleteDoc, doc, setDoc} from 'firebase/firestore';
import { USER_STATE_CHANGE } from '../constants';


export function fetchUser(){

    return((dispatch)=>{
       
     const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid))
    
     if (docSnap.exists()) {
           dispatch({type: USER_STATE_CHANGE, currentUser: docSnap.data()})
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }

    })
}