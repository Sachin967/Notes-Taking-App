import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Profile from './Profile'
import SearchBar from './SearchBar'
import { useDispatch } from 'react-redux'
import { AuthActions } from '../store/Authslice'
import { users } from '../axios'
import { toast } from 'react-toastify'

const Navbar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
     const [searchQuery, setSearchQuery] = useState<string>('')
     const navigate = useNavigate()
     const dispatch = useDispatch()
     const handleSearch = () => {
          if (searchQuery) {
               onSearch(searchQuery)
          }
     }
    const handleLogout = () => {
          users.post('/signout')
               .then((res) => {
                    if (res.status) {
                         dispatch(AuthActions.UserLogout())
                         navigate('/login')
                    }
               })
               .catch((err) => {
                    toast.error(err.message)
               })
     }

     return (
          <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow-xl">
               <h2 className="text-xl font-medium text-black py-2">Notes</h2>
               <SearchBar
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    handleSearch={handleSearch}
               />
               <Profile handleLogout={handleLogout} />
          </div>
     )
}

export default Navbar
