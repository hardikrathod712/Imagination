import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import MasonryLayout from './MasonryLayout'
import { Spinner } from './Spinner'

const Feed = () => {
    const [loading, setLoading] = useState(false)
    const [pins, setPins] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const { categoryId } = useParams()

    useEffect(() => {
        setLoading(true)
        const query = categoryId ? searchQuery(categoryId) : feedQuery
        client.fetch(query)
            .then((data) => {
                setPins(data)
                setLoading(false)
                setRefresh(false)
            })
    }, [categoryId, refresh])

    if (loading) return <Spinner message="We are adding new ideas to your feed!" />
    if (!pins?.length) return <h1 className='text-center text-base 2xl:text-lg'>No Pins Found!</h1>
    return (
        <div>
            {pins && <MasonryLayout pins={pins} setRefresh={setRefresh} />}
        </div>
    )
}

export default Feed
