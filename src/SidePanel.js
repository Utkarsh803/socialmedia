import './css/SidePanel.css';
import {useState, useEffect } from "react";
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, onSnapshot} from 'firebase/firestore';

function SidePanel() {
  const[trends, SetTrends]= useState(null);

  useEffect(()=>{
    
    const getTrends=async()=>{
      const hashRef = collection(db, `hashtags`);
      const q = query(hashRef, orderBy('val', 'desc'), limit(5));
      onSnapshot(q, querySnapshot=>{
        SetTrends(querySnapshot.docs.map((doc)=>({...doc.data(), id: doc.id})));
      })
    };

    getTrends();

  }, [])



  return (
  <div className="SidePanel" >
    <nav>
        <div className='trend'>Trending</div>
        <div style={{padding:'5%'}}>
        { trends && (
          trends.map((res)=>
            {return <div>
            <div style={{padding:'2%', fontSize:'x-large'}}>
                {res.tag}{' '}
              </div>
              <small style={{fontSize:'small', color:'grey'}}>{res.val}{' '} posts</small>
              </div>
            })
    )}
        </div>
        <div style={{position:'fixed', display:'flex', flexDirection:'row', bottom:'6%', fontSize:'small', width:'38%', backgroundColor:'transparent'}}>
<span style={{width:'33%', backgroundColor:'transparent'}}> Privacy Policy</span>
<span style={{whiteSpace:'pre',width:'33%', backgroundColor:'transparent'}}> About us</span>
<span style={{whiteSpace:'pre',width:'33%', backgroundColor:'transparent'}}> Contact</span>
</div>
    </nav>
  </div>)
}

export default SidePanel;
