import React from 'react'
import Homepage from './pages/Homepage'
import { Navigate, Route, Routes } from 'react-router-dom'
import Profilepage from './pages/Profilepage'
import Loginpage from './pages/Loginpage'
import  { Toaster } from 'react-hot-toast'
import { ChatContext } from './context/Context'
import { useContext } from 'react'

const App = () => {
  let value=useContext(ChatContext);
  let {authUser}=value;

  return (
    <div className='bg-[url("./bgImage.svg")] bg-cover'>
      <Toaster />
      <Routes>
        <Route path='/' element={authUser?<Homepage />:<Navigate to='/login'/>} />
        <Route path='/profile' element={authUser?<Profilepage />:<Navigate to='/login'/>} />
        <Route path='/login' element={!authUser?<Loginpage />:<Navigate to='/'/>} />
      </Routes>

    </div>
  )
}

export default App
