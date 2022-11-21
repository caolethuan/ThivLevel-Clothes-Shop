import React, { useContext, useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import Payment from './Payment'
import { toast } from 'react-toastify';
import * as RiIcons from 'react-icons/ri'


function Cart() {
  const state = useContext(GlobalState)
  const [cart, setCart] = state.userAPI.cart
  const [products] = state.productsAPI.products
  const [callback, setCallback] = state.productsAPI.callback

  const [user] = state.userAPI.user
  const [token] = state.token
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [canBuy, setCanBuy] = useState(false)
  const [checkButton, setCheckButton] = useState(false)
  const paymentRef = useRef()
  const [isInStock, setIsInStock] = useState(true)

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((result, item) => {
        return item.isPublished && item.countInStock > 0 ? result + (item.price * item.quantity) : result
      }, 0)
      setTotal(total.toFixed(2))
    }
    getTotal()

  }, [cart])

  useEffect(() => {

    if (cart.length > 0) {
      const checkConditions = () => {
        cart.forEach(item => checkProduct(item))
        let countItemCanBuy = cart.reduce((amount, item) => {
          return item.isPublished && item.countInStock > 0 ? amount + 1 : amount
        }, 0)
        if (countItemCanBuy === 0) {
          toast.warning('Giỏ hàng không hợp lệ!', {
            position: "top-center",
            autoClose: 3000
          });
          return false;
        }
        cart.forEach(item => {
          products.find(p => {
            if (p.product_id === item.product_id) {
              const totalQuantity = cart.reduce((acc, curr) => {
                return (curr.product_id === p.product_id) ? acc + curr.quantity : acc
              }, 0)
              if (p.countInStock < totalQuantity) {

                toast.warning(`Sản phẩm ${p.title} không đủ số lượng!`, {
                  position: "top-center",
                  autoClose: 3000
                });
                return setIsInStock(false)
              }
            }
          }
          )
        })
        if (!isInStock) return false

        return true
      }
      if (checkButton) {
        if (checkConditions()) setCanBuy(true)
        else
          setCanBuy(false)
      } else
        checkConditions()
    }
  }, [products])

  const addToCart = async (cart) => {
    await axios.patch('/user/addcart', { cart }, {
      headers: { Authorization: token }
    })
  }

  const increment = (id) => {
    cart.forEach(item => {
      products.find(p => {
        if (p.product_id === item.product_id) {
          const totalQuantity = cart.reduce((acc, curr) => {
            return (curr.product_id === p.product_id) ? acc + curr.quantity : acc
          }, 0)
          if (item._id === id) {
            return p.countInStock <= totalQuantity ? item.quantity : item.quantity += 1
          }
        }
      })
    })

    setCart([...cart])
    addToCart(cart)
  }

  const decrement = (id) => {
    cart.forEach(item => {
      if (item._id === id) {
        item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1
      }
    })

    setCart([...cart])
    addToCart(cart)
  }

  const removeProduct = (id) => {
    if (window.confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          item.quantity = 0
          cart.splice(index, 1)
        }
      })
      console.log(cart);
      setCart([...cart])
      addToCart(cart)
    }

  }

  const tranSuccess = async (payment) => {
    console.log('payment: ', payment);

    const { id, purchase_units } = payment
    const paymentID = id
    const address = purchase_units[0].shipping.address
    address.recipient_name = purchase_units[0].shipping.name.full_name
    const name = purchase_units[0].shipping.name.full_name
    console.log('address: ', address);
    const phone = user.phone
    const method = 'Paypal'
    const isPaid = true
    const total = purchase_units[0].amount.value

    await axios.post('/api/payment', { cart: cart.filter(item => item.isPublished === true && item.countInStock > 0), paymentID, name, phone, address, total, method, isPaid }, {
      headers: { Authorization: token }
    })

    setCart([])
    addToCart([])
    toast.success('Đặt hàng thành công!', {
      position: "top-center",
      autoClose: 3000
    });
  }

  const codSuccess = async (payment, address) => {

    console.log('payment: ', payment)
    const { name, phone } = payment
    const method = 'COD'
    const isPaid = false
    const total1 = total

    await axios.post('/api/paymentCOD', { cart: cart.filter(item => item.isPublished === true && item.countInStock > 0), name, phone, address, total: total1, method, isPaid }, {
      headers: { Authorization: token }
    })

    setCart([])
    addToCart([])
    toast.success('Đặt hàng thành công!', {
      position: "top-center",
      autoClose: 3000
    });
  }

  const CartItem = ({ item }) => {
    return (
      <div className="detail cart" key={item._id}>
        <div className='product-images'>
          <img src={item.images[0].url} alt="" />
        </div>
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
          <div className='product-in-stock'>
            <span>SL trong kho:{item.countInStock}</span>
          </div>
          <div className="amount">
            <span>Tổng cộng: ${item.price * item.quantity}</span>
            <button onClick={() => decrement(item._id)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => increment(item._id)}>+</button>
          </div>

        </div>
        {item.isPublished ||
          <div className="unvailible-layer">
            <span>Không có sẵn</span>
          </div>
        }
        {
          item.countInStock > 0 ||
          <div className="unvailible-layer">
            <span>Đã hết hàng</span>
          </div>
        }
        <div className="delete" onClick={() => removeProduct(item._id)}><RiIcons.RiDeleteBinFill /></div>
      </div>
    )
  }

  const updateCartItem = (id, prop, newValue) => {
    cart.forEach((item, index) => {
      if (item._id === id) {
        cart[index][prop] = newValue;
      }
    })
    setCart([...cart])
    addToCart(cart)
  }

  const checkProduct = (product) => {
    const checkItem = products.find(p => {
      if (p.product_id === product.product_id) {
        if (p.countInStock <= 0) {
          updateCartItem(product._id, "countInStock", p.countInStock)
          if (product.countInStock <= 0)
            toast.warning(`Sản phẩm ${p.title} đã hết hàng!`, {
              position: "top-center",
              autoClose: 3000
            });
        }
        if (p.countInStock > 0) {
          updateCartItem(product._id, "countInStock", p.countInStock)
        }
        if (product.price !== p.price) {
          updateCartItem(product._id, "price", p.price)
          toast.warning('Giỏ hàng đã có sự thay đổi về giá!', {
            position: "top-center",
            autoClose: 3000
          });
        }
        if ((product.isPublished !== p.isPublished)) {
          updateCartItem(product._id, "isPublished", p.isPublished)
          if (!product.isPublished)
            toast.warning(`Sản phẩm ${p.title} không tồn tại!`, {
              position: "top-center",
              autoClose: 3000
            });
        }
      }
      return p.product_id === product.product_id
    })
    if (typeof checkItem === 'undefined') {
      updateCartItem(product._id, "isPublished", false)
      toast.warning(`Sản phẩm ${product.title} không tồn tại!`, {
        position: "top-center",
        autoClose: 3000
      });
    }
  }

  const handleBuyClick = (e) => {
    e.preventDefault()

    setLoading(true)

    setCallback(!callback)
    setCheckButton(true)

    setLoading(false)

  }

  const closePayment = () => {
    setCanBuy(false)
    setCheckButton(false)
  }


  if (cart.length === 0) {
    return (
      <div style={{ width: "100%", textAlign: 'center' }} >
        <img draggable={false} style={{ width: "fit-content" }}
          src="https://rtworkspace.com/wp-content/plugins/rtworkspace-ecommerce-wp-plugin/assets/img/empty-cart.png" alt="" />
      </div>
    )
  }

  return (
    <div className="res-row">
      <h2 className="cart-heading col l-12 m-12 c-12">
        <FontAwesomeIcon icon={faCartShopping} style={{ paddingRight: 10 }} />
        Giỏ hàng
      </h2>
      <div className='cart-wrapper col l-12 m-12 c-12'>
        <div className="res-row">
          <div className='list-cart col l-8 m-8 c-12 '>
            {
              cart.map(item =>
                <CartItem item={item} key={item._id} />
              )
            }
          </div>
          <div className='payment col l-4 m-4 c-12 '>
            <div className="total divider">
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

            <button
              className="payment-buy-btn" onClick={handleBuyClick} >
              {
                loading ?
                  <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> :
                  "Tiếp tục thanh toán"
              }
            </button>
          </div>
        </div>
      </div>
      <div className={`payment-modal-container ${canBuy ? 'active' : ''}`} ref={paymentRef}>
        <Payment
          total={total}
          tranSuccess={tranSuccess}
          cart={cart}
          codSuccess={codSuccess}
          user={user}
          closePayment={closePayment}
        />
      </div>
    </div>
  )
}

export default Cart