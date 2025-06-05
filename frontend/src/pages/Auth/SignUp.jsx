import React, { useContext, useState } from 'react';
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';
import FinanceBuddyLogo from '../../assets/images/logo_finance_buddy.png'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle Sign Up Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError(""); // Clear any previous error if all validations pass

    try{

      // If profilePic is selected, upload it first
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
          fullName,
          email,
          password,
          profileImageUrl
      });
      const { token, user } = response.data;

      if(token){
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch(err) {
      if(err.response && err.response.data.message) {
        setError(err.response.data.message || 'SignUp failed. Please try again.');
      }else{
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 pt-1 flex flex-col justify-center'>
        { <div className='pt-4 font-bold'>
        {/* //   <img 
        //   src={FinanceBuddyLogo} 
        //   alt="Finance Buddy" 
        //   className="w-50 pl-2 mt-0"
        // />
         */}
         <h2 className='text-xl'>Finance Buddy</h2>
        </div> }
        <h3 className='text-xl font-semibold text-black mt-40'>Create an Account</h3>
        {/* <p className='text-md text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p> */}

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label='Full Name'
              placeholder='Enter your full name'
              type='text'
            />

            <Input 
              value={email}
              onChange={({target}) => setEmail(target.value)}
              label='Email Address'
              placeholder='username@example.com'
              type='text'
              required
            />

            <div className='col-span-2'>
              <Input 
              value={password}
              onChange={({target}) => setPassword(target.value)}
              label='Password'
              placeholder='Min 8 characters'
              type='password' 
              required
            />
            </div>
          </div>

          {error && <p className='text-red-600 text-sm pb-2.5'>{error}</p>}
          
          <button type='submit' className='btn-primary font-semibold'>
            SIGNUP
          </button>
          
          <p className='text-[17px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <Link className='font-medium text-primary underline' to='/login'>
              Login 
            </Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
