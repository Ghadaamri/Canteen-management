import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { BiUser } from 'react-icons/bi';
import { AiOutlineUnlock } from 'react-icons/ai';

const Register = () => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.id]: e.target.value
    });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Utiliser l'URL correcte, assurez-vous que '/auth/register' est la route correcte
      const response = await axios.post('http://localhost:5001/auth/register', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword
      });
      setSuccess('Registration successful!');
      setError('');
    } catch (error) {
      // Ajouter une vérification pour les erreurs spécifiques
      if (error.response && error.response.data) {
        setError('Error registering: ' + error.response.data.error);
      } else {
        setError('Error registering: ' + error.message);
      }
      setSuccess('');
    }
  };

  return (
    <div>
      <div className='bg-slate-200 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative'>
        <h1 className='text-4xl text-white font-bold text-center mb-6'>Register</h1>
        <form onSubmit={handleSubmit} autoComplete='off'>
          <div className='relative my-4'>
            <input
              type="text"
              className='block w-72 py-2.5 px-0 text-sm text-blue bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-yellow-600 peer'
              placeholder=''
              id="firstName"
              value={values.firstName}
              onChange={handleChange}
              required
              autoComplete='off'
            />
            <label
              htmlFor="firstName"
              className='absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              First Name
            </label>
            <BiUser className='absolute top-4 right-4' />
          </div>
          <div className='relative my-4'>
            <input
              type="text"
              className='block w-72 py-2.5 px-0 text-sm text-blue bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-yellow-600 peer'
              placeholder=''
              id="lastName"
              value={values.lastName}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <label
              htmlFor="lastName"
              className='absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Last Name
            </label>
            <BiUser className='absolute top-4 right-4' />
          </div>
          <div className='relative my-4'>
            <input
              type="email"
              className='block w-72 py-2.5 px-0 text-sm text-blue bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-yellow-600 peer'
              placeholder=''
              id="email"
              value={values.email}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <label
              htmlFor="email"
              className='absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Your Email
            </label>
            <BiUser className='absolute top-4 right-4' />
          </div>
          <div className='relative my-4'>
            <input
              type={values.showPassword ? "text" : "password"}
              className='block w-72 py-2.5 px-0 text-sm text-blue bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-yellow-600 peer'
              placeholder=''
              id="password"
              value={values.password}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="password"
              className='absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Your Password
            </label>
            <AiOutlineUnlock 
              className='absolute top-4 right-4 cursor-pointer'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            />
          </div>
          <div className='relative my-4'>
            <input
              type="password"
              className='block w-72 py-2.5 px-0 text-sm text-blue bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-yellow-600 peer'
              placeholder=''
              id="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="confirmPassword"
              className='absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Confirm Password
            </label>
            <AiOutlineUnlock 
              className='absolute top-4 right-4 cursor-pointer'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            />
          </div>
          <button
            className='w-full text-white mb-4 text-[16px] mt-6 rounded-full bg-blue-800 hover:bg-yellow-600 py-2 transition-color'
            type="submit"
          >
            Register
          </button>
          
          <div>
            <span className='mt-4'>Already have an account? <Link className='text-yellow-500' to='/login'>Login here</Link></span>
            <br />
            <span className='mt-2'>Or <Link className='text-yellow-500' to='/admin-register'>Register as an Admin</Link></span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
