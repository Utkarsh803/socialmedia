import React, {useRef, useEffect} from 'react'
import { MdSportsGolf } from 'react-icons/md';
import Moment from 'react-moment'
import './css/Message.css'

const Message=({msg, user1})=>{
    
    const scrollRef =useRef()

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behaviour:"smooth"});
    }, [msg]);

return(
    <div className={`message_wrapper ${msg.from === user1?"":"own"}`} ref={scrollRef}>
        <p className={msg.from === user1 ? "friend":"me"}>
            {msg.media ? (<img src ={msg.media} alt = {msg.text} />):null}
        {msg.text}
        <br/>
        <small >
            <Moment fromNow style={{backgroundColor:'transparent'}}>{msg.createdAt.toDate()}</Moment>
        </small>
        </p>
    </div>
)
}
export default Message;