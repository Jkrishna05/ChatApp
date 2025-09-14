import React, { useState } from 'react'
import assets from '../assets/chat-app-assets/chat-app-assets/assets'
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/Context';
import { useContext } from 'react';


const Loginpage = () => {
  
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [fullname, setFullname] = useState('');
  let [bio, setBio] = useState('');
  let [image, setImage] = useState(null);
  let [issubmit, setIssubmit] = useState(false);
     let [currState, setCurrState] = useState('Sign up');
  // let value=React.useContext(ChatContext);
  let {authUser,login}=useContext(ChatContext);

  let onSubmit=(e)=>{
    e.preventDefault();
    if(currState==='Sign up' && !issubmit){
      setIssubmit(true);
    }
      //submit the form
      let data={email,password,fullname,bio,image};
      console.log(data);
      login(currState==='Sign up'?'signupUser':'loginUser',{email,password,fullname,bio,image});
    
  }
  return (
    <div className='min-h-screen flex items-center justify-center backdrop-blur-2xl max-sm:flex-col gap-10 sm:justify-evenly'>
      <img src={assets.logo_big} className='w-[min(30vw,250px)]' alt="" />
      {/* Sign up /Login form  */}
       
      <form onSubmit={onSubmit} className='flex flex-col bg-[#8d90af17] p-6 rounded-2xl'  action="">
        <h2 className='font-medium text-white text-[30px] flex justify-between items-center'>{currState}
          {issubmit && ( <img src={assets.arrow_icon} alt="" className='h-[35px]' onClick={()=>{setIssubmit(false)}} /> )}
        </h2>

        {currState === 'Sign up' && !issubmit && ( <input type='text' placeholder='Full Name' className=' my-3 p-2 rounded-md focus:outline-none   focus:ring-2 focus:ring-indigo-500 border border-gray-600 text-white' value={fullname} onChange={(e) => { setFullname(e.target.value) }} required />)}

        {!issubmit && <div className='flex flex-col '>
          
          <input type='email' placeholder='Email' className=' my-3 p-2 rounded-md focus:outline-none  border border-gray-600  focus:ring-2 focus:ring-indigo-500 text-white' value={email} onChange={(e) => { setEmail(e.target.value) }} required />
          <input type='password' placeholder='Password' className=' my-3 p-2 rounded-md focus:outline-none  border border-gray-600  focus:ring-2 focus:ring-indigo-500 text-white' value={password} onChange={(e) => { setPassword(e.target.value) }} required   />

        </div> }

        {currState === 'Sign up' && issubmit && (<textarea type='text' placeholder='Provide a short bio' className=' my-3 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600 text-white' rows={5} value={bio} onChange={(e) => { setBio(e.target.value) }}></textarea>)}
            <button className='bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 rounded-full text-white mt-3 w-full cursor-pointer' type='submit' >
              {currState === 'Sign up' ? (issubmit ? 'Complete Sign up' : 'Create Acount') : 'Login Now'}
            </button>
            <div className='text-sm flex items-center gap-2 mt-3 text-gray-400'>
              <input type="checkbox" name="checkbox" id="" className='mr-2' required />
              <p>Agree to the terms of use & privacy policy</p>
            </div>
            {currState === 'Sign up' ? (
              <p className='text-gray-400 mt-3'>Already have an account? <span className='text-violet-500 cursor-pointer' onClick={() => { setCurrState('Log In'); setIssubmit(false) }}>login here</span></p>
            ) : (
              <p className='text-gray-400 mt-3'>Create a new account? <span className='text-violet-500 cursor-pointer' onClick={() => setCurrState('Sign up')}>Click here</span></p>
            )}
      </form>

    </div>
  )
}

export default Loginpage
