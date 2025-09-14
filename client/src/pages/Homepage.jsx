import React, {  useState } from 'react'
import Siderbar from '../components/Homepage/Siderbar'
import Chatbox from '../components/Homepage/Chatbox'
import {ChatData} from "../context/Chatprovider"
import Profilebar from '../components/Homepage/Profilebar'
import { useContext } from 'react'

const Homepage = () => {
    // let chatvalues=useContext(ChatData);
    let {selecteduser}=useContext(ChatData);
    let [help ,setHelp]=useState(null);
    return (
        <div className='border w-full h-screen text-amber-50 sm:px-[15%] sm:py-[5%] flex items-center justify-center'>
            <div className={`h-[100%] w-[100%] border-2 border-gray-600 rounded-2xl overflow-hidden grid grid-cols-1 relative backdrop-blur-xl ${selecteduser?'md:grid-cols-[1fr_1.5fr] xl:grid-cols-[1.3fr_2fr_1fr]':'md:grid-cols-2'}`}>
                <Siderbar />
                <Chatbox help={help} setHelp={setHelp} />
                <Profilebar help={help} setHelp={setHelp}  />
            </div>
        </div>
    )
}

export default Homepage
