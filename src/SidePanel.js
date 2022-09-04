import './css/SidePanel.css';
import {useState, useEffect } from "react";
import {db} from './firebase-config';
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, onSnapshot} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

function SidePanel() {
  const[trends, SetTrends]= useState(null);
  const navigate =useNavigate();

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


const goToHash=(hash)=>{
const tag = hash.substring(1, hash.length); 
navigate(`/hashTag/${tag}`);
}

const handleButtonPrivacy=()=>{ 
  navigate(`/policy-term-cookies`);
  }



  return (
  <div className="SidePanel" >
    
        <div className='trend'>Trending</div>
        <div style={{padding:'0%'}}>
        { trends && (
          trends.map((res)=>
            {if(res.val>0)
              return <div >
            <div style={{padding:'1%',fontSize:'large', display:'flex', flexDirection:'column'}} >
               <div onClick={()=>goToHash(res.tag)} className='pointer'> {res.tag}{' '}<div><small style={{fontSize:'small', color:'grey', paddingLeft:'3%'}} >{res.val}{' '} posts</small></div></div>
              </div>
              </div>
            })
    )}
        </div>
        <div style={{position:'fixed', display:'flex', flexDirection:'row', bottom:'9%', fontSize:'small', width:'38%', backgroundColor:'transparent'}}>
<span style={{width:'33%', backgroundColor:'transparent', cursor:'pointer'}} onClick={handleButtonPrivacy}> Privacy Policy</span>
<span style={{whiteSpace:'pre',width:'33%', backgroundColor:'transparent', cursor:'pointer'}}> About us</span>
<span style={{whiteSpace:'pre',width:'33%', backgroundColor:'transparent', cursor:'pointer'}}> Contact</span>
</div>
   
  </div>)
}

export default SidePanel;
