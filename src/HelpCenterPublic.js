import './css/HelpCenter.css';
import LoginHeader from './LoginHeader';
import * as React from 'react';
import Dropdown from'./Dropdown.js';
import policyJson from './policy.json';

function HelpCenterPublic() {

  return (<div className="HelpCenter">
    <nav>
    <LoginHeader></LoginHeader>
    <div style={{paddingTop:'100px', backgroundColor:'black', width:'100%', height:'80vh'}}>
    <div className="formContainer" style={{paddinLeft:'0%', marginLeft:'0%', width:'100%', height:'80vh'}}>
       <div style={{width:'98%', backgroundColor:'transparent', color:'white', height:'100%'}}>
       <h5 style={{color:'red', textAlign:'center', marginBottom:'40px'}}>**Please Note**:This app is a coding project still under development and not meant to store highly sensitive info. Only store info that you feel can be safely viewed by public and the developer. </h5> 
       {policyJson.map((feature)=>
           <Dropdown name={feature.name} text={feature.text}></Dropdown>)}
       </div>
   </div>
    
    </div>
    </nav>
  </div>);
}

export default HelpCenterPublic;