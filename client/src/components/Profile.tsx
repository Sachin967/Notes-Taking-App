import React, { MouseEventHandler } from 'react'

interface ProfileProps {
     handleLogout: MouseEventHandler<HTMLButtonElement>
}

const Profile: React.FC<ProfileProps> = ({ handleLogout }) => {
     return (
          <div className="flex items-center gap-3">
               <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-900 font-medium bg-slate-100">
                    SA
               </div>
               <div>
                    <p className="text-sm font-medium">Sachin</p>
                    <button onClick={handleLogout}>Logout</button>
               </div>
          </div>
     )
}

export default Profile
