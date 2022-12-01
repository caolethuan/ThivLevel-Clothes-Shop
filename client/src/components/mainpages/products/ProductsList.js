import React, { useState, useContext, useEffect, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import * as FaIcons from 'react-icons/fa'
import * as BsIcons from 'react-icons/bs'
import * as MdIcons from 'react-icons/md'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { GlobalState } from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import Filters from './Filters'
import DetailProductAdmin from '../detailProduct/DetailProductAdmin'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

function ProductsList() {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    const [categories] = state.categoriesAPI.categories
    const [token] = state.token
    const [callback, setCallback] = state.productsAPI.callback
    const [loading, setLoading] = useState({ id: '', loading: false })
    const [currentProduct, setCurrentProduct] = useState(false)

    const uploadRef = useRef()

    const deleteProduct = async (id, public_id) => {
        if (window.confirm('Are you sure to delete this product?')) {
            try {


                setLoading({
                    ...loading,
                    id,
                    loading: true
                })

                const destroyImg = axios.post('/api/destroy', { public_id }, {
                    headers: { Authorization: token }
                })
                const deleteProduct = axios.delete(`/api/products/${id}`, {
                    headers: { Authorization: token }
                })

                await destroyImg
                await deleteProduct
                setCallback(!callback)
                setLoading({
                    ...loading,
                    id,
                    loading: false
                })
                toast.success(`Deleted successfully!`, {
                    position: "top-center",
                    autoClose: 3000
                });
            } catch (err) {
                alert(err.response.data.msg)
            }
        }
    }

    const handlePublish = async (product) => {

        product.isPublished = !product.isPublished
        try {
            await axios.patch(`/api/products/${product._id}/changepublish`, { isPublished: product.isPublished }, {
                headers: { Authorization: token }
            })
            if (product.isPublished)
                toast.success('Product show successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                });
            else
                toast.success('Product hide successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                });
            setProducts([...products])
        } catch (error) {
            console.log(error.response.data.msg);
        }

    }

    // Paginate
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(products.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(products.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, products])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % products.length;
        setItemOffset(newOffset);
    };

    const handleViewDetail = (product) => {
        const viewbox = document.querySelector('.product-view-detail-box')
        viewbox.classList.toggle('active')
        setCurrentProduct(product)
    }

    return (
        <div>
            <div className='content-header'>
                <h2>Danh sách sản phẩm</h2>
            </div>
            <div className="products-list-container">
                <div className="products-list-filter">
                    <Filters setItemOffset={setItemOffset}></Filters>
                </div>
                <div className="products-list-actions">
                    <div className="create__product">
                        <Link to='/create_product'>+ Thêm sản phẩm</Link>
                    </div>
                    <div className="file-wrapper">
                        <div className="file__upload">
                            <input type="file" accept="text/csv, .csv, application/vnd.ms-excel" style={{ display: 'none' }} ref={uploadRef} />
                            <div className="" onClick={() => uploadRef.current.click()}>Drop CSV file</div>
                        </div>
                        <div className="btn__item">
                            <button className="btn__item-upload">Upload</button>
                            <button className="btn__item-download">Download</button>
                        </div>
                    </div>
                </div>
                <div className="products-list">
                    <table className="products-list-table">
                        <thead className="table-header">
                            <tr>
                                <th>ID</th>
                                <th>TÊN</th>
                                <th>DANH MỤC</th>
                                <th>GIÁ</th>
                                <th>TRONG KHO</th>
                                <th>TRẠNG THÁI</th>
                                <th>CHI TIẾT</th>
                                <th>ẨN/HIỆN</th>
                                <th>SỬA/XÓA</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {
                                currentItems.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <div className="product-id">
                                                {product.product_id}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="product-name">
                                                <img src={product.images[0].url} alt="" />
                                                <span>{product.title}</span>
                                            </div>
                                        </td>
                                        <td>{categories.find(c => c._id === product.category).name}</td>
                                        <td>
                                            <div className="product-price">
                                                ${product.price}
                                            </div>
                                        </td>
                                        <td>{product.countInStock}</td>
                                        <td>{
                                            product.countInStock > 0 ?
                                                <span className="selling">Đang bán</span> :
                                                <span className="sold-out">Bán hết</span>
                                        }</td>
                                        <td>
                                            <div className="product-view-detail">
                                                <a href="#!" onClick={() => handleViewDetail(product)}>
                                                    <FaIcons.FaEye style={{ color: '#9e9e9e' }} />
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="product-publish-toggle"
                                                onClick={() => handlePublish(product)}>
                                                {
                                                    product.isPublished ?
                                                        <BsIcons.BsToggleOn style={{ color: '#0e9f6e' }} /> :
                                                        <BsIcons.BsToggleOff style={{ color: '#ff5a1f' }} />
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            <div className="product-actions">
                                                <div className="edit-product">
                                                    <Link to={`/edit_product/${product._id}`} >
                                                        <FaIcons.FaEdit style={{ color: '#9e9e9e' }} />
                                                    </Link>
                                                </div>
                                                <div className="delete-product">
                                                    <Link to="#!" onClick={() => deleteProduct(product._id, product.images[0].public_id)}>
                                                        {product._id === loading.id && loading.loading === true ?
                                                            <FontAwesomeIcon icon={faSpinner} className="fa-spin" style={{ color: '#9e9e9e' }} /> :
                                                            <MdIcons.MdDelete style={{ color: '#9e9e9e' }} />
                                                        }
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="product-view-detail-box">
                        {currentProduct && <DetailProductAdmin detailProduct={currentProduct} />}
                    </div>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={2}
                        pageCount={pageCount}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        containerClassName="pagination"
                        pageLinkClassName="page-num"
                        previousLinkClassName="page-num"
                        activeClassName="active"
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductsList