import axios from 'axios'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import { toast } from 'react-toastify'
import LocationForm from '../utils/address/LocationForm'
import { FaEdit } from 'react-icons/fa'
import ChangePhoneModal from '../utils/modal/ChangePhoneModal'
import moment from 'moment'

function DetailOrderAdmin() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [orders] = state.ordersAPI.orders
    const [token] = state.token
    const [detailOrder, setDetailOrder] = useState([])
    const [statusOrder, setStatusOrder] = useState('')
    const [callback, setCallback] = state.ordersAPI.callback
    const [address, setAddress] = useState('')
    const addressRef = useRef()
    const [currentPhone, setCurrentPhone] = useState(false)

    useEffect(() => {
        if (params.id) {
            orders.forEach(order => {
                if (order._id === params.id) {
                    setDetailOrder(order)
                    setStatusOrder(order.status)
                    setAddress(order.address || '')
                }
            })
        }
    }, [params.id, orders])

    const handleChangeSatus = (e) => {
        setStatusOrder(e.target.value)
    }

    const HandleSubmitChangeStatus = async () => {
        try {
            if (!detailOrder.isPaid && statusOrder === 'Delivered') {
                await axios.put(`/api/payment/changestatus/${detailOrder._id}/`, { isPaid: true, status: statusOrder }, {
                    headers: { Authorization: token }
                })
                toast.success('Order is delivered successfully')
                setCallback(!callback)
                return;
            }
            await axios.patch(`/api/payment/changestatus/${detailOrder._id}/`, { status: statusOrder }, {
                headers: { Authorization: token }
            })

            toast.success('Order status is changed')

            setCallback(!callback)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangeAddress = () => {
        addressRef.current.classList.add('active')
    }

    const HandleSubmitAddress = async (address) => {
        try {
            await axios.patch(`/api/payment/changeaddress/${detailOrder._id}`, { address }, {
                headers: { Authorization: token }
            })

            toast.success('Order address is changed')

            setCallback(!callback)
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }

    const handleChangePhone = (phone) => {
        const viewbox = document.querySelector('.order-phone-change-box')
        viewbox.classList.toggle('active')
        setCurrentPhone(phone)
    }

    return (
        <div>
            <div className='content-header'>
                <h2>Order detail</h2>
            </div>
            <div className='content-body'>
                <div className='order-detail-wrapper'>
                    <div className='order-detail-header'>
                        <div className='order-id-status'>
                            <h1>ORDER</h1>
                            <p>STATUS: <span>{detailOrder.status}</span></p>
                            <p>PAID: <span>{detailOrder.isPaid ? 'Paid' : 'Unpaid'}</span></p>                           
                        </div>
                        <div className='change-order-status'>
                            <span>Change Status: </span>
                            <select name="status" value={statusOrder} onChange={handleChangeSatus}>

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Processing">
                                    Processing
                                </option>

                                <option value="Shipping">
                                    Shipping
                                </option>

                                <option value="Delivered">
                                    Delivered
                                </option>

                                <option value="Cancel">
                                    Cancel
                                </option>

                            </select>

                            <button className='save-status' onClick={HandleSubmitChangeStatus}>Save</button>
                        </div>
                        <div className='order-name-address'>
                            <h1>{detailOrder.name}</h1>
                            <p>{detailOrder.address?.address_line_1 ? ` ${detailOrder.address?.address_line_1}, ${detailOrder.address?.admin_area_2}` :
                                ` ${(detailOrder.address?.detailAddress || '')} ${detailOrder.address?.ward?.label}, 
                            ${detailOrder.address?.district?.label}, ${detailOrder.address?.city?.label}`}
                            </p>
                            <a href="#!"
                                onClick={handleChangeAddress}>
                                <FaEdit style={{ color: '#9e9e9e', cursor: 'pointer' }} />
                            </a>
                            <div className="address-form text-start" ref={addressRef}>
                                <LocationForm element={"address-form"} onSave={(address) => HandleSubmitAddress(address)} initAddress={detailOrder.address?.city ? detailOrder.address : ''} />
                            </div>
                        </div>
                    </div>
                    <div className='order-detail-body'>
                        <div className='date-order'>
                            <label>CREATE DATE</label>
                            <p>{new Date(detailOrder.createdAt).toLocaleDateString()}</p>
                            <span>{moment(detailOrder.createdAt).format('LT')}</span>
                        </div>
                        <div className='date-order'>
                            <label>LAST UPDATED AT:</label>
                            <p>{new Date(detailOrder.updatedAt).toLocaleDateString()}</p>
                            <span>{moment(detailOrder.updatedAt).format('LT')}</span>
                        </div>
                        <div className='id-order'>
                            <label>ORDER ID</label>
                            <p style={{ textTransform: 'uppercase' }}>{detailOrder._id}</p>
                        </div>
                        <div className='phone-number-order'>
                            <label>PHONE NUMBER</label>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p>+84 {detailOrder.phone ? detailOrder.phone : 'NO'}</p>
                                <a href="#!" onClick={() => handleChangePhone(detailOrder)}>
                                    <FaEdit style={{ color: '#9e9e9e', cursor: 'pointer' }} />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='list-product-order'>
                        <table className="oder-product-list-table">
                            <thead className="table-header">
                                <tr>
                                    <th>SR.</th>
                                    <th>PRODUCT</th>
                                    <th>TYPE</th>
                                    <th>QUANTITY</th>
                                    <th>ITEM PRICE</th>
                                    <th>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {
                                    detailOrder.cart?.map((item, index) => {
                                        if (item.quantity > 0) {
                                            return (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className='table-product-column'>
                                                            <img className='table-thumbnail-product' src={item.images[0].url} alt='hinh'></img>
                                                            <span>{item.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className='table-product-column'>
                                                        <span>{item.size} - </span>
                                                        <div style={{ backgroundColor: `${item.color}`, width: '15px', height: '15px', border: '1px solid #ccc' }}></div>
                                                    </td>
                                                    <td className='table-quantity'>{item.quantity}</td>
                                                    <td className='table-item-price'>${item.price}</td>
                                                    <td className='table-amount'>${item.quantity * item.price}</td>
                                                </tr>
                                            )
                                        } else return null
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='payment-detail-order'>
                        <div className='method'>
                            <label>PAYMENT METHOD</label>
                            <p>{detailOrder.method}</p>
                            {detailOrder.paymentID ? <p>PAYMENT ID: {detailOrder.paymentID}</p> : ''}
                        </div>
                        <div className='shipping-cost'>
                            <label>SHIPPING COST</label>
                            <p>$ 0</p>
                        </div>
                        <div className='discount'>
                            <label>DISCOUNT</label>
                            <p>$ 0</p>
                        </div>
                        <div className='total-amount'>
                            <label>TOTAL AMOUNT</label>
                            <p>${detailOrder.total}</p>
                        </div>
                    </div>
                </div>
                <div className="order-phone-change-box">
                    {currentPhone && <ChangePhoneModal phoneOrder={currentPhone} callback={callback} setCallback={setCallback} token={token} />}
                </div>
            </div>
        </div>
    )
}

export default DetailOrderAdmin
