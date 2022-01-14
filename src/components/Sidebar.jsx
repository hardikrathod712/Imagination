import React from 'react'
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
// import { IoIosArrowForward } from "react-icons/io";

import logoColor from '../assets/logoColor.png'
import { categories } from "../utils/data";

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-bold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';


const Sidebar = ({ user, closeToggle }) => {

    const handleCloseSidebar = () => {
        if (closeToggle) closeToggle(false)
    }

    return (
        <div className='flex flex-col justify-between h-full bg-white overflow-y-scroll min-w-210 hide-scrollbar font'>
            <div className='flex flex-col'>
                <Link
                    to='/'
                    className='flex mx-auto px-5 gap-2 my-6 pt-1 w-[210px] items-center'
                    onClick={handleCloseSidebar}
                >
                    <img src={logoColor} alt='logo' className='w-full' />
                </Link>
                <div className='flex flex-col gap-5'>
                    <NavLink
                        to='/'
                        className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                        onClick={handleCloseSidebar}
                    >
                        <RiHomeFill fontSize={20} />
                        Home
                    </NavLink>
                    <h3 className='mt-2 px-5 text-base 2xl:text-lg'>Discover Categories</h3>
                    {categories.map((category) => (
                        <NavLink
                            to={`/category/${category.name}`}
                            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                            onClick={handleCloseSidebar}
                            key={category.name}
                        >
                            <img src={category.image} className='w-8 h-8 rounded-full object-cover shadow-sm' alt='category' />
                            {category.name}
                        </NavLink>
                    ))}
                </div>
            </div>
            {user && (
                <Link
                    to={`/user-profile/${user._id}`}
                    className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
                    onClick={handleCloseSidebar}
                >
                    <img src={user.image} className='w-10 h-10 rounded-full' alt='user-profile' referrerPolicy='no-referrer' />
                    <p>{user.userName}</p>
                </Link>
            )}
        </div>
    )
}

export default Sidebar
