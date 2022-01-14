import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineCloudDownload, AiOutlineArrowUp } from 'react-icons/ai'
import { MdDelete, MdError } from 'react-icons/md'
import { client } from '../client'
import { SpinnerUpload } from './Spinner'
import { categories } from '../utils/data'

const CreatePin = ({ user }) => {
    const [title, setTitle] = useState('')
    const [about, setAbout] = useState('')
    const [destination, setDestination] = useState('')
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState(false)
    const [category, setCategory] = useState(null)
    const [imageAsset, setImageAsset] = useState(null)
    const [wrongImageType, setWrongImageType] = useState(false)
    const navigate = useNavigate()

    const uploadImage = (e) => {
        setLoading(true)
        const selectedFile = e.target.files[0]
        const { type, name } = selectedFile
        client.assets
            .upload('image', selectedFile, { contentType: type, filename: name })
            .then((document) => {
                setImageAsset(document)
                setLoading(false)
            })
            .catch((error) => {
                console.log('Image Upload Error', error);
            })
    }

    const savePin = (e) => {
        if (title && about && destination && imageAsset?._id && category) {
            const doc = {
                _type: 'pin',
                title,
                about,
                destination,
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset?._id
                    }
                },
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id
                },
                category,
            }
            client.create(doc)
                .then(()=>{
                    navigate('/')
                })
        } else {
            setFields(true)
            setTimeout(() => setFields(false), 4000)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
            {fields && (
                <div className='flex items-center w-4/5 bg-red-100 mb-6 p-2'>
                    <MdError className='text-red-700' fontSize={25}/>
                    <p className='text-red-800 ml-2 text-lg transition-all ease-in duration-150 '>Please fill in all the fields.</p>
                </div>
            )}
            <div className='flex flex-col lg:flex-row justify-center items-center bg-white p-3 lg:p-5 w-full lg:w-4/5'>
                <div className='bg-secondaryColor p-3 flex flex-0.7 w-full rounded-lg'>
                    <div className='flex flex-col justify-center items-center border-2 border-dotted border-gray-400 h-420 w-full p-3 rounded-lg'>
                        {/* {loading && <SpinnerUpload />} */}
                        {wrongImageType && <p className='text-red-600 text-xl transition-all ease-in duration-150'>Wrong Image Type</p>}
                        {!imageAsset ? (<div>
                            {!loading ? (
                                <label className='hover:cursor-pointer'>
                                    <div className='flex flex-col justify-center items-center h-full'>
                                        <div className='flex flex-col justify-center items-center'>
                                            <p className='font-bold text-2xl'>
                                                <AiOutlineCloudDownload />
                                            </p>
                                            <p className='text-lg'>
                                                Click to upload
                                            </p>
                                        </div>
                                        <p className='text-gray-400 text-sm'>
                                            Use High-Quality JPG, PNG, GIF or SVG files less than 20MB
                                        </p>
                                    </div>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        name='upload-image'
                                        onChange={uploadImage}
                                        className='w-0 h-0'
                                    />
                                </label>
                            ) : (<SpinnerUpload />)
                            }
                        </div>
                        ) : (
                            <div className='relative h-full'>
                                <img src={imageAsset?.url} alt='uploaded-image' className='w-full h-full' />
                                <button
                                    type='button'
                                    className='absolute bottom-2 right-2 p-2 rounded-full bg-white hover:bg-red-500 hover:shadow-md text-xl cursor-pointer outline-none transition-all duration-500 ease-in-out'
                                    onClick={() => setImageAsset(null)}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-6 lg:pl-10 lg:pr-5 mt-5 w-full'>
                    <input
                        type='text'
                        placeholder='Add your title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='outline-none font-bold text-2xl sm:text-3xl text-gray-500 border-b-2 p-2 focus:border-blue-500'
                    />
                    {user && (
                        <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
                            <img
                                src={user.image}
                                className='w-8 h-8 sm:w-10 sm:h-10 rounded-full opacity-90 hover:opacity-100'
                                alt='user-profile'
                            />
                            <p className='font-bold text-base sm:text-lg text-gray-800'>{user.userName}</p>
                        </div>
                    )}
                    <input
                        type='text'
                        placeholder='What your pin is about'
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        className='outline-none text-base sm:text-lg text-gray-500 border-b-2 p-1 focus:border-blue-500'
                    />
                    <input
                        type='text'
                        placeholder='Add a destination link'
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className='outline-none text-base sm:text-lg text-gray-500 border-b-2 p-1 focus:border-blue-500'
                    />
                    <div className='flex flex-col'>
                        <div>
                            <p className='text-base sm:text-lg '>Choose pin category</p>
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                className='mt-2 outline-none w-4/5 text-base border-b-2 text-gray-500 p-2 rounded-md cursor-pointer focus:border-blue-500 capitalize'
                            >
                                <option value='other' className='bg-white'>Select category</option>
                                {categories.map((category) => {
                                    return <option value={category.name} className='text-base border-0 outline-none bg-white text-black' key={category.name}>{category.name}</option>
                                })}
                            </select>
                        </div>
                        <div className='flex justify-end items-end mt-5'>
                            <button
                                type='button'
                                onClick={savePin}
                                className='bg-red-500 font-bold text-white p-2 rounded-full w-28 outline-none'
                            >
                                Save Pin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePin
