import { useState, useEffect } from 'react'
import axios from 'axios'

function ProductsAPI() {
    const [products, setProducts] = useState([])
    const [callback, setCallback] = useState(false)
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    // const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)
    const [productsAvailble, setProductsAvailable] = useState([])
    const [recommended, setRecommended] = useState([])
    const [bestSeller, setBestSeller] = useState([])
    const [newArrival, setNewArrival] = useState([])
    const [searchItem, setSearchItem] = useState([])
    const [suggestions, setSuggestions] = useState('')

    useEffect(() => {
        const getProducts = async () => {
            const res = await axios.get(`/api/products?${category}&${sort}&title[regex]=${search}`)
            setProducts(res.data.products)
            setResult(res.data.result)
        }
        getProducts()

        const getProductsAvailable = async () => {
            const res = await axios.get(`/api/products?${category}&${sort}&title[regex]=${search}`)
            setProductsAvailable(res.data.products.filter(product => product.isPublished === true))
        }
        getProductsAvailable()

        const getRecommended = async () => {
            const res = await axios.get('/api/productsHomepage?limit=8&sort=-rating')
            setRecommended(res.data.products)
        }

        getRecommended()

        const getBestSeller = async () => {
            const res = await axios.get('/api/productsHomepage?limit=8&sort=-sold')
            setBestSeller(res.data.products)
        }

        getBestSeller()

        const getNewArrival = async () => {
            const res = await axios.get('/api/productsHomepage?limit=8')
            setNewArrival(res.data.products)
        }

        getNewArrival()

    }, [callback, category, sort, search])

    useEffect(() => {
        let isCancelled = false;

        const getProducts = async () => {
            const res = await axios.get(`/api/products?${category}&${sort}&title[regex]=${suggestions}`)
            if (isCancelled) setSearchItem(res.data.products)
        }
        getProducts()
        return () => {
            isCancelled = true;
        }
    }, [suggestions])

    return {
        products: [products, setProducts],
        callback: [callback, setCallback],
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        // page: [page, setPage],
        result: [result, setResult],
        productsAvailable: [productsAvailble, setProductsAvailable],
        recommended: [recommended, setRecommended],
        bestSeller: [bestSeller, setBestSeller],
        newArrival: [newArrival, setNewArrival],
        searchItem: [searchItem, setSearchItem],
        suggestions: [suggestions, setSuggestions]
    }
}

export default ProductsAPI