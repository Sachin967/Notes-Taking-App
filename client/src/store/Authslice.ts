import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserDetails {
     email: string
     name:string
}

interface AuthState {
     Userisloggedin: boolean
     userdetails: UserDetails | null
}

const userDetailsFromLocalStorage = localStorage.getItem('userdetails')
     ? JSON.parse(localStorage.getItem('userdetails')!)
     : null

const initialState: AuthState = {
     Userisloggedin: !!userDetailsFromLocalStorage,
     userdetails: userDetailsFromLocalStorage,
}

const Authslice = createSlice({
     name: 'Auth',
     initialState,
     reducers: {
          Userlogin(state, action: PayloadAction<UserDetails>) {
               state.Userisloggedin = true
               state.userdetails = action.payload
               localStorage.setItem('userdetails', JSON.stringify(action.payload))
          },
          UserLogout(state) {
               state.Userisloggedin = false
               state.userdetails = null
               localStorage.removeItem('userdetails')
          },
     },
})

export const AuthActions = Authslice.actions

export default Authslice
