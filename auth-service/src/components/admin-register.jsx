import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineUnlock } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';

const AdminRegister = () => {
    const [values, setValues] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!values.firstName || !values.lastName || !values.email || !values.password || !values.confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (values.password !== values.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/admin/register', values);

            setSuccess('Registration successful!');
            setError('');
            setValues({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
            console.log('Token before redirection:', localStorage.getItem('jwtToken'));

            window.location.replace('/admin-login');
            console.log('Token after redirection:', localStorage.getItem('jwtToken'));
        } catch (error) {
            setError('Error registering: ' + (error.response?.data?.error || 'Unknown error'));
            setSuccess('');
        }
    };

    return (
        <div>
            <div className='bg-slate-200 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative'>
                <h1 className='text-4xl text-white font-bold text-center mb-6'>Admin Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className='relative my-4'>
                        <input
                            type="text"
                            className='block w-72 py-2.5 px-0 text-sm text-blue bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-yellow-600 peer'
                            placeholder=''
                            id="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            required
                        />
                        <label
                            htmlFor="firstName"
                            className='absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5'
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
                        />
                        <label
                            htmlFor="lastName"
                            className='absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5'
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
                        />
                        <label
                            htmlFor="email"
                            className='absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5'
                        >
                            Email
                        </label>
                        <BiUser className='absolute top-4 right-4' />
                    </div>
                    <div className='relative my-4'>
                        <input
                            type="password"
                            className='block w-72 py-2.5 px-0 text-sm text-blue bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-yellow-600 peer'
                            placeholder=''
                            id="password"
                            value={values.password}
                            onChange={handleChange}
                            required
                        />
                        <label
                            htmlFor="password"
                            className='absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5'
                        >
                            Password
                        </label>
                        <AiOutlineUnlock className='absolute top-4 right-4' />
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
                            className='absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5'
                        >
                            Confirm Password
                        </label>
                        <AiOutlineUnlock className='absolute top-4 right-4' />
                    </div>
                    <button
                        className='w-full text-white mb-4 text-[18px] mt-6 rounded-full bg-blue-800 hover:bg-yellow-600 py-2 transition-color'
                        type="submit"
                    >
                        Register
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <div>
                        <span className='mt-4'>Already have an admin account? <Link className='text-yellow-500' to='/admin-login'>Login here</Link></span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;
