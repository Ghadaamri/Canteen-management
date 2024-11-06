import React from 'react'
import './Header.css'

const Header = () => {
    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Welcome to COFICAB's canteen management application! </h2>
                <p>Reserve your meals, evaluate our services, and share your suggestions with just a few clicks.</p>
                <button>View Menu</button>
            </div>
        </div>
    )
}

export default Header
