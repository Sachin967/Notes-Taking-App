import React from 'react'

interface EmptyCardProps {
     message: string
     img: string
}

const EmptyCard: React.FC<EmptyCardProps> = ({ message, img }) => {
     return (
          <div className='flex flex-col items-center justify-center mt-20'>
               <img src={img} alt="No Notes" className="w-60" />
               <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">{message}</p>
          </div>
     )
}

export default EmptyCard
