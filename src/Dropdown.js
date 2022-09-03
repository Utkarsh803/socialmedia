import React,{useState} from 'react'
import './css/Dropdown.css'
import {GoTriangleDown,GoTriangleUp} from 'react-icons/go';

const Dropdown=({name, text})=>{


    const[open, setOpen]=useState(false);
return(
    <div style={{width:'100%'}} className="Dropdown">
        <div className='name' onClick={()=>{setOpen(!open)}}>
        {name}
        {!open ? (
        <GoTriangleDown style={{float:'right', color:'white', paddingTop:'1%'}}/>
        ):(
        <GoTriangleUp style={{float:'right',color:'white', paddingTop:'1%'}}/>
        )}
        </div>
        {open&&
        (
        <p style={{width:'100%', height:'fit-content',wordBreak:'break-word',marginTop:'40px',marginBottom:'40px', minHeight:'50px' ,whiteSpace:'pre-line',verticalAlign:'bottom'}}>
        {text}
        </p>
        )}
    </div>
)
}

export default Dropdown;