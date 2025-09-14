import React, { useState } from 'react'
import assets from '../assets/chat-app-assets/chat-app-assets/assets';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ChatContext } from '../context/Context';

const Profilepage = () => {
  // let {value}=useContext(ChatContext);
  let {authUser,updateProfile}=useContext(ChatContext);
  let [selectImg,setSelectImage]=useState(null);
  let [Fullname,setName]=useState(authUser?.fullname);
  let [bio,setBio]=useState(authUser?.bio);
  let nav=useNavigate();
let submit=async(e)=>{
   e.preventDefault();
   if(!selectImg){
    await updateProfile({fullname:Fullname,bio})
    nav('/')
    return ;
   }
const reader = new FileReader();
    reader.onloadend = async () => {
      const profilePic = reader.result; // base64 image string
      await updateProfile({ profilePic, fullname: Fullname, bio });
      nav('/');
    };
    reader.readAsDataURL(selectImg);

}
  return (
    <div className='flex items-center justify-center  min-h-screen'>
      <div className='w-5/6 max-w-2xl text-white backdrop-blur-2xl rounded-lg flex items-center justify-between max-sm:flex-col-reverse  border border-gray-500'>
        <form onSubmit={submit} className='flex flex-col gap-2 p-10 flex-1 ' action="">
          <h3 className='font-medium text-[20px]' >Profile Details</h3>
          <label htmlFor="avtar" className='cursor-pointer flex  items-center gap-2'>
            <input type="file" name="avtar" id="avtar"  accept='.png,.jpg,.jpeg' onChange={(e)=>{setSelectImage(e.target.files[0])}} hidden/>
            <img src={selectImg?URL.createObjectURL(selectImg):assets.avatar_icon} alt="" className='w-12 h-12 rounded-full' />
            <p>Profile image</p>
          </label>
          <input type='text'   placeholder='Full Name'  className=' my-3 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600 text-white' value={Fullname} onChange={(e) => { setName(e.target.value) }} />
          <textarea name='bio' id='bio' type='text' placeholder='Provide a short bio' className=' my-3 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600 text-white' rows={5} value={bio} onChange={(e) => { setBio(e.target.value) }}></textarea>
            <button type='submit' className='text-white text-lg p-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 cursor-pointer'>
              Save
            </button>
        </form>
        <img src={authUser?.profilePic ||assets.logo_icon} alt="" className='max-w-44 mx-10 max-sm:mt-10' />
      </div>
    </div>
  )
}

export default Profilepage
