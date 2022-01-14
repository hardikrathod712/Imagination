import React, { useState, useEffect } from 'react'

import { feedQuery, searchQuery } from "../utils/data";
import { client } from "../client";
import { Spinner } from "./Spinner";
import MasonryLayout from './MasonryLayout';

const Search = ({ searchTerm }) => {

    const [pins, setPins] = useState(null)
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        setLoading(true)
        const query = searchTerm ? searchQuery(searchTerm.toLowerCase()) : feedQuery
        client.fetch(query)
            .then((data) => {
                setPins(data)
                setLoading(false)
                setRefresh(false)
            })
    }, [searchTerm, refresh])

    return (
        <div>
            {loading && <Spinner />}
            {pins?.length !== 0 && <MasonryLayout pins={pins} setRefresh={setRefresh} />}
            {pins?.length === 0 && searchTerm !== '' && !loading && (
                <div className='mt-10 text-center text-base 2xl:text-xl'>
                    No Pins Found!
                </div>
            )}
        </div>
    )
}

export default Search
