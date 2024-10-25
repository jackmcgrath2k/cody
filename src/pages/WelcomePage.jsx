import React from 'react'

export default function WelcomePage() {
  return (
    <div className='flex flex-col items-center justify-center animate-fade'>
        <div className='text-center text-9xl tracking-tight font-extralight'>
            Welcome
        </div>
        <div className='text-center text-3xl tracking-tight font-extralight pt-10'>
        say it, save it, send it, whatever.
        </div>
        <div className='text-center text-xl tracking-tight font-extralight pt-10'>
        it's really that simple.
        </div>
        <div className='text-center mt-20'>
        <button class="rounded-full border border-black px-3 py-1 hover:scale-110 duration-700">Get started</button>
        </div>
    </div>
  )
}



