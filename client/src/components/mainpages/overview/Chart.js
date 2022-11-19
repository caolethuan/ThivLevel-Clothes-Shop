import React, { useContext, useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import { FaBoxOpen } from 'react-icons/fa'
import { IoShirt } from 'react-icons/io5'

function Chart() {
  const state = useContext(GlobalState)
  const [products] = state.productsAPI.products
  const [token] = state.token
  const [orders, setOrders] = useState([])
  const [orderTotal, setOrderTotal] = useState(0)
  const [totalSales, setTotalSales] = useState(0)

  useEffect(() => {
    if (token) {
      const getOrder = async () => {
        const res = await axios.get(`/api/payment`, {
          headers: { Authorization: token }
        })
        setOrders(res.data)
        const data = res.data
        setOrderTotal(data.length)
        const filterSales = data.filter(({ isPaid }) => isPaid === true)
        const totalPrice = filterSales.reduce((acc, curr) => {
          return acc + curr.total
        }, 0)
        setTotalSales(totalPrice)
      }
      getOrder()
    }

  }, [token])


  return (
    <div>
      <div className='content-header'>
        <h2>Statistics</h2>
      </div>
      <div className="content-wrapper">
        <div className='chart grid-3'>
          <div className='card-total'>
            <div className='chart-item row'>
              <div>
                <span className='icon-bg primary-bg'>$</span>
              </div>
              <div className='card-content'>
                <h3>Total sales</h3>
                <span>${totalSales}</span>
              </div>
            </div>
          </div>
          <div className='card-total'>
            <div className='chart-item row'>
              <div>
                <span className='icon-bg success-bg'><FaBoxOpen style={{ color: '#0f5132' }} /></span>
              </div>
              <div className='card-content'>
                <h3>Total ordered</h3>
                <span>{orderTotal}</span>
              </div>
            </div>
          </div>
          <div className='card-total'>
            <div className='chart-item row'>
              <div>
                <span className='icon-bg warning-bg'><IoShirt style={{ color: '#664d03' }} /></span>
              </div>
              <div className='card-content'>
                <h3>Total products</h3>
                <span>{products.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='chart grid-2'>
          <div className='card-chart'>
            <div className='card-chart-body'>
              <h3 className='cart-title'>Sales statistics</h3>
              <div>
                <Iframe
                  url="https://charts.mongodb.com/charts-mern-stack-app-wfaew/embed/charts?id=6361ee03-562c-4025-840e-a46d79c93297&maxDataAge=3600&theme=light&autoRefresh=true"
                  width="100%"
                  height="380px"
                  style={{ background: '#FFFFFF', border: 'none', borderRadius: '2px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)' }}
                  id=""
                  className=""
                  display="block"
                  position="relative"
                />
              </div>

            </div>
          </div>
          <div className='card-chart'>
            <div className='card-chart-body'>
              <h3 className='cart-title'>Order statistics</h3>
              <div>
                <Iframe
                  url="https://charts.mongodb.com/charts-mern-stack-app-wfaew/embed/charts?id=63569dfb-302a-46a7-8bae-4bad081df989&maxDataAge=3600&theme=light&autoRefresh=true"
                  width="100%"
                  height="380px"
                  style={{ background: '#FFFFFF', border: 'none', borderRadius: '2px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)' }}
                  id=""
                  className=""
                  display="block"
                  position="relative"
                />
              </div>

            </div>
          </div>
          <div className='card-chart'>
            <div className='card-chart-body'>
              <h3 className='cart-title'>Products statistics</h3>
              <div>
                <Iframe
                  url="https://charts.mongodb.com/charts-mern-stack-app-wfaew/embed/charts?id=63569915-8631-4ca8-8623-69c997d6ade6&maxDataAge=3600&theme=light&autoRefresh=true"
                  width="100%"
                  height="380px"
                  style={{ background: '#FFFFFF', border: 'none', borderRadius: '2px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)' }}
                  id=""
                  className=""
                  display="block"
                  position="relative"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chart