import React from 'react'
import { useNavigate } from 'react-router-dom'
function QuickAssement() {
    const nav = useNavigate();
    const click = (e) =>{
    e.preventDefault();
    nav("/profile-upload");
    }
  return (
   <>
   <div className='relative flex   flex-col justify-center align-item-center' >
    quick Assesment
    
   <button  onClick={click}  >build your profile button </button>
  </div>
   </>
    //
    
  )
}

export default QuickAssement