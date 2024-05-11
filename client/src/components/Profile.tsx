import React, { MouseEventHandler } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

interface ProfileProps {
     handleLogout: MouseEventHandler<HTMLButtonElement>
}

const Profile: React.FC<ProfileProps> = ({ handleLogout }) => {
     const { userdetails } = useSelector((state: RootState) => state.auth)
     return (
          <div className="flex items-center gap-3">
               {/* <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-900 font-medium bg-slate-100">
                    SA
               </div> */}
               <div>
                    <p className="text-sm font-medium">{userdetails?.name}</p>
                    <button onClick={handleLogout}>Logout</button>
               </div>
          </div>
     )
}

export default Profile
