import React from 'react'
import Rating from '../Rating/Rating'
import SoldOut from '../../../../images/sold-out-1.png'
import { Link } from 'react-router-dom'

function ProductItem({ product, isAdmin, deleteProduct, handleCheck, setCurrentProduct, handleViewDetail }) {

  if (!product.isPublished) return null;
  return (
    <div className="col l-3 m-4 c-6">
      <div className="product_card">
        {
          isAdmin && <input type="checkbox" checked={product.checked}
            onChange={() => handleCheck(product._id)} />
        }
        <div className="product_img">
          <img className="product_img-1" src={product.images[0].url} alt="" />
          <img className="product_img-2" src={product.images[1]?.url} alt="" />
          {product.countInStock <= 0 && <img className="product_img-sold-out" src={SoldOut} alt="" />}
          <div className="quick-view" onClick={() => handleViewDetail(product)}>
            Xem nhanh
          </div>
        </div>

        <div className="product_box">
          <h3 title={product.title}>
            <Link to={`/detail/${product._id}`}>
              {product.title}
            </Link>
          </h3>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
          <span className="product_price">${product.price}</span>
        </div>

      </div>
    </div>
  )
}

export default ProductItem