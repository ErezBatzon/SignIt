import React from 'react'
import { PiSignatureDuotone } from "react-icons/pi";


const Navbar = () => {
  return (
    <div className='navbar'>
        <PiSignatureDuotone    size={40} style={{backgroundColor: 'transparent',margin: '15px'}}/>
        <p className='header'>SignIt</p>
    </div>
  )
}

export default Navbar