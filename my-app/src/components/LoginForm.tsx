import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useCookies} from 'react-cookie';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();
  const[cookies,setCookies]=useCookies(["auth_token"]);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response=await axios.post("https://x8ki-letl-twmt.n7.xano.io/api:XooRuQbs/auth/login",{email,password})
        console.log(response);
        setCookies("auth_token",response.data.authToken)
       if(response.data.authToken){
           navigate("/form")
                
       }
       
    } catch (error) {
        alert("wrong")
    }
    
  };



  return (
    <div className='bg-gradient-to-r from-violet-500 to-fuchsia-500 h-[100vh] border-2 border-solid border-black flex justify-center items-center'>
       <form onSubmit={handleSubmit} className="w-[50%] h-100  mx-auto ">
      <h1 className='text-3xl font-bold py-10 text-white'>Login</h1>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-semibold text-white">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className="w-[100%] px-3 py-2 border border-gray-300 rounded bg-stone-300 "
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1 font-semibold text-white">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          className="w-[100%] px-3 py-2 border border-gray-300 rounded bg-stone-300"
          required
        />
      </div>
      <button type="submit" className="w-[50%] px-4 py-2 bg-violet-900 text-white rounded hover:bg-violet-950 my-10">Login</button>
    </form>
    </div>
   
  );
};

export default LoginForm;
