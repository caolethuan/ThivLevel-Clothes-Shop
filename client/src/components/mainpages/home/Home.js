import React, { useState, useContext, useEffect } from 'react'
import MySlider from '../slider/MySlider'
import * as FiIcons from 'react-icons/fi'
import * as RiIcons from 'react-icons/ri'
import * as SlIcons from 'react-icons/sl'
import * as GiIcons from 'react-icons/gi'
import * as HiIcons from 'react-icons/hi'
import * as MdIcons from 'react-icons/md'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import QuickViewProduct from './QuickViewProduct'
import { Link } from 'react-router-dom'

const iconStyle = {
    color: '#246184',
    fontSize: '26px'
}

function Home() {
    const state = useContext(GlobalState)
    const [recommended] = state.productsAPI.recommended
    const [bestSeller] = state.productsAPI.bestSeller
    const [newArrival] = state.productsAPI.newArrival
    const [currentProduct, setCurrentProduct] = useState(false)
    const [callback, setCallback] = state.userAPI.callback

    useEffect(() => {
        setCallback(!callback)
    }, [])
    
    const handleViewDetail = (product) => {
        const viewbox = document.querySelector('.product-view-detail-box')
        viewbox.classList.toggle('active')
        setCurrentProduct(product)
    }
    return (
        <>
            <MySlider></MySlider>
            <div className="res-row service-container">
                <div className="col l-3 m-3 c-12">
                    <div className="service-item">
                        <div className="service-icon"><FiIcons.FiShoppingBag style={iconStyle} /></div>
                        <div className="service-content">
                            <h4 className="service-heading">Miễn phí giao hàng</h4>
                            <p className="service-des">Miễn phí ship với đơn hàng &gt; 300k</p>
                        </div>
                    </div>
                </div>
                <div className="col l-3 m-3 c-12">
                    <div className="service-item">
                        <div className="service-icon"><SlIcons.SlPaypal style={iconStyle} /></div>
                        <div className="service-content">
                            <h4 className="service-heading">Thanh toán Paypal</h4>
                            <p className="service-des">Thanh toán trực tuyến với Paypal</p>
                        </div>
                    </div>
                </div>
                <div className="col l-3 m-3 c-12">
                    <div className="service-item">
                        <div className="service-icon"><SlIcons.SlDiamond style={iconStyle} /></div>
                        <div className="service-content">
                            <h4 className="service-heading">Khách hàng VIP</h4>
                            <p className="service-des">Ưu đãi cho khách hàng VIP</p>
                        </div>
                    </div>
                </div>
                <div className="col l-3 m-3 c-12">
                    <div className="service-item">
                        <div className="service-icon"><RiIcons.RiHandHeartLine style={iconStyle} /></div>
                        <div className="service-content">
                            <h4 className="service-heading">Hỗ trợ bảo hành</h4>
                            <p className="service-des">Đổi, sửa đồ tại tất cả store</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col l-10 l-o-1">
                <div className="res-row best-seller-container">
                    <h1 className="best-seller__heading">
                        <MdIcons.MdOutlineRecommend style={{ margin: 10 }} />
                        Recommended For You
                        <MdIcons.MdOutlineRecommend style={{ margin: 10 }} />
                    </h1>
                    <div className="col l-12 m-12 c-12">
                        <div className="res-row products">
                            {
                                recommended.map(product => {
                                    return <ProductItem key={product._id} product={product}
                                        setCurrentProduct={setCurrentProduct} handleViewDetail={handleViewDetail}
                                    />
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="res-row best-seller-container">
                    <h1 className="best-seller__heading">
                        <GiIcons.GiCutDiamond style={{ margin: 10 }} />
                        Best seller
                        <GiIcons.GiCutDiamond style={{ margin: 10 }} />
                    </h1>
                    <div className="col l-12 m-12 c-12">
                        <div className="res-row products">
                            {
                                bestSeller.map(product => {
                                    return <ProductItem key={product._id} product={product}
                                        setCurrentProduct={setCurrentProduct} handleViewDetail={handleViewDetail}
                                    />
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="res-row best-seller-container">
                    <h1 className="best-seller__heading">
                        <HiIcons.HiOutlineSparkles style={{ margin: 10 }} />
                        New arrival
                        <HiIcons.HiOutlineSparkles style={{ margin: 10 }} />
                    </h1>
                    <div className="col l-12 m-12 c-12">
                        <div className="res-row products">
                            {
                                newArrival.map(product => {
                                    return <ProductItem key={product._id} product={product}
                                        setCurrentProduct={setCurrentProduct} handleViewDetail={handleViewDetail}
                                    />
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="res-row">
                    <div className="l-12 m-12 c-12">
                        <div className="watch-more-products-wrapper">
                            <Link to="/products" className="watch-more-products">
                                Xem thêm
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="product-view-detail-box">
                    {currentProduct && <QuickViewProduct detailProduct={currentProduct} />}
                </div>
            </div>
        </>
    )
}

export default Home