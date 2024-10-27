import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';

export default function Header() {
  return (
    
    <header className="flex justify-center text-black tracking-tighter py-4 mx-6">
      <a href="/">
      <div className="text-center text-2xl font-black">
        Cody
      </div>
      </a>
      <div className="absolute top-5 right-6 text-center text-xl font-light">
       | Sign out
      </div>
    </header>
  )
}
