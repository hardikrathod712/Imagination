import React, { useState, useEffect } from 'react'
// import { AiOutlineLogout } from "react-icons/ai"
import { useParams, useNavigate } from "react-router-dom"
import { GoogleLogout } from "react-google-login"

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../utils/data"
import { client } from "../client"
import { Spinner } from "./Spinner"
import MasonryLayout from './MasonryLayout'
import { fetchUser } from '../utils/fetchUser'

const UserProfile = () => {

    const [user, setUser] = useState(null)
    const [pins, setPins] = useState(null)
    const [text, setText] = useState('Created')
    const [activeTab, setActiveTab] = useState('created')
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const { userId } = useParams()
    const navigate = useNavigate()
    const loggedUser = fetchUser()

    const randomImage = 'https://source.unsplash.com/1920x1080/?japan,nature,galaxy'

    const activeTabStyle = 'p-2 underline font-bold underline-offset-[6px] text-lg 2xl:text-xl tracking-tight'
    const notActiveTabStyle = 'p-2 hover:underline underline-offset-[6px] text-lg 2xl:text-xl tracking-tight'

    const logout = () => {
        localStorage.clear()
        navigate('/login')
    }

    useEffect(() => {
        const query = userQuery(userId)
        client.fetch(query)
            .then((data) => {
                setUser(data[0])
            })
    }, [userId])

    useEffect(() => {
        setLoading(true)
        const query = text === 'Created' ? userCreatedPinsQuery(userId) : userSavedPinsQuery(userId)
        client.fetch(query)
            .then((data) => {
                setPins(data)
                setLoading(false)
                setRefresh(false)
            })
    }, [text, refresh]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) {
        return <Spinner message='Loading profile...' />
    }

    return (
        <div className='relative pb-2 h-full justify-center items-center'>
            <div className='flex flex-col pb-5'>
                <div className='relative flex flex-col mb-7'>
                    <div className='flex flex-col justify-center items-center'>
                        <img
                            src={randomImage}
                            className='relative h-[300px] w-full 2xl:h-420 shadow-lg object-cover'
                            alt='banner'
                        />
                        <div className='absolute bg-red-300 mix-blend-overlay top-0 left-0 w-full h-[300px] 2xl:h-420 backdrop-blur-sm backdrop-opacity-75 hover:backdrop-blur-none' />
                        <img
                            src={user.image}
                            className='relative w-30 h-30 2xl:w-40 2xl:h-40 rounded-full -mt-10 2xl:-mt-20 shadow-xl object-cover'
                            alt='user-profile'
                        />
                        <h1 className='mt-4 text-2xl 2xl:text-4xl text-center font-bold tracking-wider'>{user.userName}</h1>
                        <div className='mt-2'>
                            {user._id === loggedUser?.googleId && (
                                <GoogleLogout
                                    clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                                    render={(renderProps) => (
                                        <button type='button'
                                            className='bg-red-400 text-white font-semibold px-4 py-2 text-sm 2xl:text-base rounded-full cursor-pointer outline-none shadow-md hover:bg-red-500'
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}
                                        >
                                            Logout
                                        </button>
                                    )}
                                    onLogoutSuccess={logout}
                                    cookiePolicy='single_host_origin'
                                />
                            )}
                        </div>
                    </div>
                    <div className='text-center mt-8 mb-7 gap-4 flex justify-center items-center'>
                        <button
                            type='button'
                            onClick={(e) => {
                                setText(e.target.textContent)
                                setActiveTab('created')
                            }}
                            className={`${activeTab === 'created' ? activeTabStyle : notActiveTabStyle}`}
                        >
                            Created
                        </button>
                        <button
                            type='button'
                            onClick={(e) => {
                                setText(e.target.textContent)
                                setActiveTab('saved')
                            }}
                            className={`${activeTab === 'saved' ? activeTabStyle : notActiveTabStyle}`}
                        >
                            Saved
                        </button>
                    </div>
                    {
                        loading ? (
                            <Spinner height={30} width={200} />
                        ) : pins?.length ? (
                            <div className='px-2'>
                                <MasonryLayout pins={pins} setRefresh={setRefresh} />
                            </div>
                        ) : (
                            <div className='flex justify-center items-center text-lg 2xl:text-xl w-full mt-4'>
                                No Pins Found!
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default UserProfile
