import React, { useState, useEffect, useRef, useContext } from 'react'
import Rating from '../utils/Rating/Rating'
import SoldIcon from './images/sold.png'
import Instock from '../../../images/in-stock.png'
import './quickViewProduct.css'
import * as FaIcons from 'react-icons/fa'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function QuickViewProduct({ detailProduct }) {
    const state = useContext(GlobalState)
    const addCart = state.userAPI.addCart
    const [categories] = state.categoriesAPI.categories
    
    const [slideIndex, setSlideIndex] = useState(1)
    const [width, setWidth] = useState(0)
    const [start, setStart] = useState(0)
    const [change, setChange] = useState(0)

    const [selectedColor, setSelectedColor] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [color, setColor] = useState(false)
    const [size, setSize] = useState(false)
    const slideRef = useRef()

    useEffect(() => {
        if (!slideRef.current) return;
        const scrollWidth = slideRef.current.scrollWidth
        const childrenElementCount = slideRef.current.childElementCount
        const width = scrollWidth / childrenElementCount
        setWidth(width)
    }, [])

    useEffect(() => {
        setColor(detailProduct.colors[0])
    }, [detailProduct.colors])

    // Slide images
    const plusSlides = (n) => {
        setSlideIndex(prev => prev + n)
        slideShow(slideIndex + n)
    }

    const slideShow = (n) => {
        if (n > detailProduct.images.length) setSlideIndex(1)
        if (n < 1) setSlideIndex(detailProduct.images.length)
    }

    // Drag
    function dragStart(e) {
        setStart(e.clientX)
    }

    function dragOver(e) {
        let touch = e.clientX
        setChange(start - touch)
    }

    function dragEnd(e) {
        if (change > 0)
            slideRef.current.scrollLeft += width
        else
            slideRef.current.scrollLeft -= width
    }

    useEffect(() => {
        if (!slideRef.current || !width) return;
        let numOfThumb = Math.round(slideRef.current.offsetWidth / width)
        slideRef.current.scrollLeft = slideIndex > numOfThumb ? (slideIndex - 1) * width : 0
    }, [width, slideIndex])

    const handleCloseView = (e) => {
        const viewbox = document.querySelector('.product-view-detail-box')
        viewbox.classList.remove('active')
        setQuantity(1)
        setColor('')
        setSize(false)
        setSelectedColor(0)
        setSlideIndex(1)
    }

    function handleBuyClick(color, index) {
        setColor(color)
        setSelectedColor(index)
    }

    function handleAddCart(product, productColor, productSize, productQuantity) {
        if (!color)
            return toast.info('Hãy chọn màu!', {
                position: "top-center",
                autoClose: 3000
            })
        if (!size)
            return toast.info('Hãy chọn size!', {
                position: "top-center",
                autoClose: 3000
            })
        addCart(product, productColor, productSize, productQuantity)
    }
    return (
        <div className="view-detail-product-modal quickview">
            <section className="product-details">
                <div className="product-page-img">
                    {
                        detailProduct.images.map((image, index) => (
                            <div key={image.public_id} className="mySlides"
                                style={{ display: (index + 1) === slideIndex ? "block" : "none" }}>
                                <div className="numbertext">{index + 1} / {detailProduct.images.length}</div>
                                <img src={image.url} alt="" />
                            </div>
                        ))
                    }
                    <a href="#!" className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
                    <a href="#!" className="next" onClick={() => plusSlides(+1)}>&#10095;</a>

                    <div className="slider-img" draggable={true} ref={slideRef}
                        onDragStart={dragStart}
                        onDragOver={dragOver}
                        onDragEnd={dragEnd}
                    >
                        {
                            detailProduct.images.map((image, index) => (
                                <div key={image.public_id}
                                    className={`slider-box ${index + 1 === slideIndex ? 'active' : ''}`}
                                    onClick={() => setSlideIndex(index + 1)}
                                >
                                    <img src={image.url} alt="" />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="product-page-details">
                    <strong>{detailProduct.title}</strong>

                    <p className="product-category">
                        #{detailProduct.product_id}
                        <label>/ Phân loại: </label> <span>{categories.find(c => c._id === detailProduct.category).name}</span>
                    </p>
                    <Rating value={detailProduct.rating} text={''} />
                    <p className="product-price">
                        ${detailProduct.price}
                    </p>

                    <p className="small-desc">{detailProduct.description}</p>

                    <div className="product-options">
                        <span>Màu sắc: </span>
                        {
                            detailProduct.colors.map((color, index) => (
                                <div key={color}>
                                    <button style={{ background: color }}
                                        className={index === selectedColor ? 'active' : ''}
                                        onClick={() => handleBuyClick(color, index)}
                                    ></button>
                                </div>
                            ))
                        }
                    </div>
                    <div className='size-select'>
                        <span>Sizes: </span>
                        {
                            detailProduct.size.map(sz => {
                                return <div className='size' key={sz}>
                                    <input type='radio' name='size' key={sz} value={sz} id={sz}
                                        onChange={() => setSize(sz)}
                                        checked={size === sz}
                                    />
                                    <label htmlFor={sz}>{sz}</label>
                                </div>
                            })
                        }
                    </div>

                    <div className="product-page-offer">
                        <i className="fa-solid fa-tag" />20% Discount
                    </div>
                    <div className="product-sold">
                        <img src={Instock} alt="SoldIcon" />
                        <strong>{detailProduct.countInStock} <span>in stock.</span></strong>
                    </div>
                    <div className="product-sold">
                        <img src={SoldIcon} alt="SoldIcon" />
                        <strong>{detailProduct.sold} <span>Products sold.</span></strong>
                    </div>
                    <div className="quantity-btn">
                        <span>Số lượng: </span>
                        <button onClick={() => quantity === 1 ? setQuantity(1) : setQuantity(quantity - 1)}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>

                    <div className="cart-btns">
                        {
                            detailProduct.countInStock > 0 ?
                                <Link to="#!" className="add-cart"
                                    onClick={() => handleAddCart(detailProduct, color, size, quantity)}
                                >Thêm vào giỏ hàng</Link> : <span>Hết hàng</span>
                        }
                        <Link className="view-detail" to={`/detail/${detailProduct._id}`} onClick={handleCloseView}>
                            Xem chi tiết
                        </Link>
                    </div>
                </div>
                <div className="view-close" onClick={handleCloseView}>
                    <FaIcons.FaRegTimesCircle style={{ color: 'crimson' }} />
                </div>
            </section>
        </div>
    )
}

export default QuickViewProduct