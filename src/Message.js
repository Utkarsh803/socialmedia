import React from 'react'
import { MdSportsGolf } from 'react-icons/md';
import Moment from 'react-moment'
import './css/Message.css'

const Message=({msg})=>{
return(
    <div className='Message_wrapper'>
        <p style={{padding:'10px', display:'inline-block', maxWidth:'50%', textAlign:'left', borderRadius:'5px' }}>
            {msg.media ? (<img src ={msg.media} alt = {msg.text} style={{width:'100%', borderRadius:'5px'}}/>):null}
        {msg.text}
        <br/>
        <small style={{display:'inline-block', marginTop:'15px', opacity:'0.8'}}>
            <Moment fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
        </p>
    </div>
)
}
export default Message;