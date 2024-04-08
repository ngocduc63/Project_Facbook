import { useState, useEffect } from 'react'
import useAxiosPrivate from '../api/axiosPrivate'

const usePosts = (pageNum = 1, isRefecth) => {
    const axiosPrivate = useAxiosPrivate()
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false)

    useEffect(() => {
        setResults([])
    }, [isRefecth])

    useEffect(() => {
        setIsLoading(true)
        setIsError(false)
        setError({})

        const controller = new AbortController()
        const { signal } = controller

        axiosPrivate.get((`/post-management/post/get-new-feed/${pageNum}`), { signal })
            .then(response => {
                const data = response.data;

                setResults(prev => [...prev, ...data.data.datas])
                setHasNextPage(pageNum <= data.data.maxPage - 1)
                setIsLoading(false)
            })
            .catch(e => {
                setIsLoading(false)
                if (signal.aborted) return
                setIsError(true)
                setError({ message: e.message })
            })

        return () => controller.abort()

    }, [axiosPrivate, pageNum])

    return { isLoading, isError, error, results, hasNextPage }
}

export default usePosts