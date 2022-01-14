import React from 'react'
import Loader from 'react-loader-spinner'

export const Spinner = ({ message, height = 50, width = 200 }) => {
    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <Loader
                type="BallTriangle"
                color="#00BFFF"
                height={height}
                width={width}
                className="m-5"
            />
            <p className='text-lg text-center px-2'>{message}</p>
        </div>
    )
}

export const SpinnerUpload = ({ message, height = 50, width = 200 }) => {
    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <Loader
                type="Bars"
                color="#9ca3af"
                height={height}
                width={width}
                className="m-5"
            />
            <p className='text-lg text-center px-2'>{message}</p>
        </div>
    )
}

