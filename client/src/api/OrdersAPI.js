import { useState, useEffect } from 'react'

import axios from 'axios'

function OrdersAPI(token) {
  
    const [orders, setOrders] = useState([])
    const [dataFilter, setDataFilter] = useState([])
    const [sort, setSort] = useState('')
    const [callback, setCallback] = useState(false)
    const [status, setStatus] = useState('')

    useEffect(() => {
        if (token) {
            const getOrders = async () => {
                try {                
                    const res = await axios.get(`/api/payment?${status}&${sort}`, {
                        headers: { Authorization: token }
                    })
                    setOrders(res.data);
                    setDataFilter(res.data)          
                } catch (err) {
                    console.log(err.response.data.msg)
                }
            }
            getOrders()
        }         
      }, [token, sort, status, callback]);

  return {
    orders: [orders, setOrders],
    dataFilter: [dataFilter, setDataFilter],
    status: [status, setStatus],
    sort: [sort, setSort],
    callback: [callback, setCallback]
  }
}

export default OrdersAPI
