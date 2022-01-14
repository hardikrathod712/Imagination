import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MdOutlineFileDownload, MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import { pinDetailQuery, pinDetailMorePinQuery } from "../utils/data";
import { Spinner } from "./Spinner";
import MasonryLayout from "./MasonryLayout";

const PinDetail = ({ user }) => {
    const [pins, setPins] = useState(null)
    const [pinDetail, setPinDetail] = useState(null)
    const [comment, setComment] = useState('')
    const [addingComment, setAddingComment] = useState(false)
    const [hideComment, setHideComment] = useState(false)
    const { pinId } = useParams()

    const fetchPinDetails = () => {
        let query = pinDetailQuery(pinId)
        if (query) {
            client.fetch(query)
                .then((data) => {
                    setPinDetail(data[0])
                    if (data[0]) {
                        query = pinDetailMorePinQuery(data[0])
                        client.fetch(query)
                            .then((res) => {
                                setPins(res)
                            })
                    }
                })
        }
    }

    const addComment = () => {
        if (comment) {
            setAddingComment(true)

            client.patch(pinId)
                .setIfMissing({ comments: [] })
                .insert('after', 'comments[-1]', [{
                    comment,
                    _key: uuidv4(),
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user._id
                    }
                }])
                .commit()
                .then(() => {
                    fetchPinDetails()
                    setComment('')
                    setAddingComment(false)
                })
        }
    }

    useEffect(() => {
        fetchPinDetails()
    }, [pinId]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!pinDetail) return <Spinner message='Loading Pin...' />

    return (
        <>
            <div className='p-4 flex flex-col xl:flex-row m-auto bg-white shadow-md' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
                <div className='flex justify-center items-center md:items-start flex-initial'>
                    <img
                        src={pinDetail?.image && urlFor(pinDetail.image).url()}
                        className='rounded-3xl'
                        alt='user-post'
                    />
                </div>
                <div className='w-full p-6 flex-1 xl:min-w-620'>
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-2 items-center'>
                            <a
                                href={`${pinDetail?.image?.asset?.url}?dl=`}
                                download
                                onClick={(e) => e.stopPropagation()}
                                className='bg-white w-11 h-11 rounded-full flex items-center justify-center text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none hover:bg-gray-200'
                            >
                                <MdOutlineFileDownload fontSize={25} />
                            </a>
                        </div>
                        <a
                            href={pinDetail.destination}
                            target='_blank'
                            rel='noreferrer'
                            className='pr-3 hover:underline'
                        >
                            {pinDetail.destination.length > 20 ? pinDetail.destination.slice(8, 20) : pinDetail.destination.slice(8)}
                        </a>
                    </div>
                    <div>
                        <h1 className='font-bold text-4xl text-gray-500 break-words mt-3'>
                            {pinDetail.title}
                        </h1>
                        <p className='mt-3'>{pinDetail.about}</p>
                    </div>
                    <Link to={`user-profile/${pinDetail.postedBy?._id}`} className='flex gap-2 items-center mt-5 bg-white rounded-lg'>
                        <img src={pinDetail.postedBy?.image} className='w-10 h-10 rounded-full object-cover' alt='user-profile' />
                        <p className='font-semibold capitalize tracking-wider'>{pinDetail.postedBy?.userName}</p>
                    </Link>
                    <h2 className='flex gap-1 items-center mt-12 text-xl font-bold'>
                        Comments
                        {!hideComment ? <MdKeyboardArrowRight className='hover:bg-gray-200 rounded-full' fontSize={25} onClick={() => setHideComment(!hideComment)} /> : <MdKeyboardArrowDown className='hover:bg-gray-200 rounded-full' fontSize={25} onClick={() => setHideComment(!hideComment)} />}
                    </h2>
                    <div className='max-h-[240px] overflow-y-auto no-scrollbar'>
                        {hideComment && pinDetail?.comments?.map((comment, i) => (
                            <div className='flex gap-2 mt-3 items-center bg-white rounded-lg' key={i}>
                                <img
                                    src={comment.postedBy.image}
                                    alt='user-profile'
                                    className='w-8 h-8 rounded-full cursor-pointer'
                                />
                                <div className='flex flex-col'>
                                    <p className='font-bold'>
                                        {comment.postedBy.userName}
                                    </p>
                                    <p>
                                        {comment.comment}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {
                        hideComment && (
                            <div className='flex flex-wrap mt-6 gap-3 items-center'>
                                <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
                                    <img src={pinDetail.postedBy?.image} className='w-9 h-9 rounded-full' alt='user-profile' />
                                </Link>
                                <input
                                    type='text'
                                    className='flex-1 border-gray-200 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                                    placeholder='Add a comment'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button
                                    type='button'
                                    className='bg-red-500 text-white rounded-full px-5 py-2 outline-none font-semibold'
                                    onClick={addComment}
                                >
                                    {addingComment ? '...' : 'Post'}
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
            <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
                More like this
            </h2>
            {
                pins?.length > 0 ? (
                    <MasonryLayout pins={pins} />
                ) : (
                    <h2 className='text-lg mt-8'>
                        Oops, we didnt find anything :(
                    </h2>
                )
            }
        </>
    )
}

export default PinDetail
