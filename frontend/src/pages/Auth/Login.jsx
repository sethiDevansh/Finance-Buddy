import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';
import FinanceBuddyLogo from '../../assets/images/logo_finance_buddy.png'

const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();

  //handle login function

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError('Please enter a valid email address !!!');
      return; 
    }
    if(!password) {
      setError('Please enter your password !!!');
      return;
    }
    setError('');

    // login API call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
    });
      const {token, user} = response.data;

      if(token){
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch(err) {
      if(err.response && err.response.data.message) {
        setError(err.response.data.message || 'Login failed. Please try again.');
      }else{
        setError("Something went wrong. Please try again later.");
      }
    }
  }

  return (
    <AuthLayout>  
      <div className='lg:w-[70%] h-3/4 md:h-full px-2 pt-0 flex flex-col justify-center '>
        <img 
          src={FinanceBuddyLogo} 
          alt="Finance Buddy" 
          className="w-70 pt-2"
        />
        <h3 className='text-xl font-bold text-black'>Welcome Back </h3>
        <p className='text-md text-slate-700 mt-[5px] mb-6'>
          Please enter your details to log in
          </p>

          <form onSubmit={handleLogin}>
            <Input 
              value={email}
              onChange={({target}) => setEmail(target.value)}
              label='Email Address'
              placeholder='username@example.com'
              type='text'
              required
            />

            <Input 
              value={password}
              onChange={({target}) => setPassword(target.value)}
              label='Password'
              placeholder='Min 8 characters'
              type='password' 
              required
            />

            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

            <button type='submit' className='btn-primary font-semibold'>
              LOGIN
            </button>

            <p className='text-[17px] text-slate-800 mt-3 '>
              Don't have an account?{" "}
              <Link className='font-medium text-primary underline' to='/signUp'>
                SignUp 
              </Link>
            </p>

          </form>
      </div>
    </AuthLayout>
  );
};

export default Login