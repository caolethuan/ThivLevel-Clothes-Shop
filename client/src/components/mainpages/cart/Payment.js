import React from 'react'
import Paypal from './Paypal'
import CodModal from '../utils/modal/codModal'
import * as FaIcons from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Payment({ tranSuccess, cart, codSuccess, user, total, closePayment }) {

    const ValidItem = ({ item }) => {
        return (
            <div className="detail cart" key={item._id}>
                <div className="box-detail">
                    <h2>{item.title}</h2>
                    <h3>$ {item.price}</h3>
                    {
                        item.color ?
                            <div className="product-color">
                                Màu sắc: <button style={{ background: item.color, width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc' }}
                                ></button>
                            </div> : <div>Color: No Available</div>
                    }
                    {
                        item.size ?
                            <strong>Size: {item.size}</strong> : <strong>Size: No Available</strong>
                    }
                    <div className="item-amount">
                        <span>Tổng cộng: ${item.price * item.quantity}</span>
                        <span>Số lượng: x{item.quantity}</span>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="payment-modal">
            <div className="wrapper">
                <h2 className="payment-header">Đơn hàng</h2>
                <div className="payment-detail">
                    <div className='list-cart'>
                        {
                            cart.map(product => (
                                product.isPublished && product.countInStock > 0 ?
                                    <ValidItem item={product} key={product._id} /> :
                                    null
                            ))
                        }
                    </div>
                    <div>
                        <div className='payment-total-wrapper'>
                            <div className="payment-total divider">
                                <p>Đơn hàng:</p>
                                <span>$ {total}</span>
                            </div>
                            <div className='divider'>
                                <div className='discount-cost'>
                                    <p>Giảm giá:</p>
                                    <span>$0</span>
                                </div>
                                <div className='ship-cost'>
                                    <p>Phí vận chuyển:</p>
                                    <span>$0</span>
                                </div>
                            </div>
                            <div className='grand-total divider'>
                                <p>Tổng cộng:</p>
                                <span style={{ color: 'crimson' }}>$ {total}</span>
                            </div>
                        </div>
                        <div className="payment-method">
                            <p style={{ color: '#555' }}>Choose payment methods: </p>
                            {
                                user.phone && user.isVerifyPhone ? 
                                <Paypal
                                    tranSuccess={tranSuccess}
                                    cart={cart}
                                /> : <span 
                                    style={{lineHeight: '50px',
                                    fontStyle: 'italic',
                                    color: '#444'}}><Link to={'/user/'}>Xác thực số điện thoại</Link> để thanh toán qua Paypal</span>
                            }
                            
                            <span style={{ display: 'block', width: '100%', textAlign: 'center' }}>Or</span>
                            <CodModal
                                codSuccess={codSuccess}
                                user={user}
                            />
                        </div>
                    </div>
                </div>
                <div className="payment-close" onClick={closePayment}>
                    <FaIcons.FaRegTimesCircle style={{ color: 'crimson' }} />
                </div>
            </div>
        </div >

    )
}

export default Payment