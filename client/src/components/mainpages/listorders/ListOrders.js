import React, { useState, useEffect, useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import * as FaIcons from 'react-icons/fa'
import { BsTruck, BsPaypal } from 'react-icons/bs'
import moment from 'moment'

function ListOrders() {

    const state = useContext(GlobalState)
    const [orders, setOrders] = state.ordersAPI.orders
    const [data] = state.ordersAPI.dataFilter
    const [sort, setSort] = state.ordersAPI.sort
    const [status, setStatus] = state.ordersAPI.status
    const [searchPhrase, setSearchPhrase] = useState('')



    const search = (e) => {
        const matchedOrder = data.filter((order) => {
            return order._id.toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
                ((order.name || order.address.recipient_name).toLowerCase().includes(e.target.value.toLowerCase())) ||
                order.email?.toLowerCase().includes(e.target.value.toLowerCase()) || order.phone?.includes(e.target.value.toLowerCase())
        })

        setOrders(matchedOrder)
        setSearchPhrase(e.target.value)
    }

    // Paginate
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(orders.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(orders.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, orders])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % orders.length;
        setItemOffset(newOffset);
    };

    const handleStatus = (e) => {
        setStatus(e.target.value)
        setSearchPhrase('')
    }
    return (
        <div>
            <div className='content-header'>
                <h2>Orders</h2>
            </div>

            <div className="content-wrapper">
                <div className="ctrl-order">
                    <div className='search-order-by'>
                        <input className="search-order-input" value={searchPhrase} type="text" placeholder="Search by order id/name/ emai/ phone"
                            onChange={search} />
                    </div>

                    <div className="filter-order-status">
                        <span>Status: </span>
                        <select name="status" value={status} onChange={handleStatus}>
                            <option value="">All orders</option>

                            <option value="status=Pending">
                                Pending
                            </option>

                            <option value="status=Processing">
                                Processing
                            </option>

                            <option value="status=Shipping">
                                Shipping
                            </option>

                            <option value="status=Delivered">
                                Delivered
                            </option>

                            <option value="status=Cancel">
                                Cancel
                            </option>

                        </select>
                    </div>

                    <div className="sort-order-by">
                        <span>Sort by: </span>
                        <select value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="">Newest</option>
                            <option value="sort=oldest">Oldest</option>
                        </select>
                    </div>
                </div>
                <div className="orders-list">
                    <table className="orders-list-table">
                        <thead className="table-header">
                            <tr>
                                <th>ID</th>
                                <th>TIME</th>
                                <th>NAME</th>
                                <th>PHONE</th>
                                <th>METHOD</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {
                                currentItems.map(order => (
                                    <tr key={order._id}>
                                        <td>
                                            <div className="order-id">
                                                <span style={{ textTransform: 'uppercase' }}
                                                    title={order._id}>...{order._id.slice(-5)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="order-name">
                                                <span>{new Date(order.createdAt).toLocaleDateString() + ' ' + moment(order.createdAt).format('LT')}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="order-name">
                                                <span>{order.name || order.address.recipient_name}</span>
                                            </div>
                                        </td>
                                        <td>{order.phone ? order.phone : ''}</td>
                                        <td>{order.method === 'Paypal' ?
                                            <span style={{ backgroundColor: '#0e2ab1' }} className="method-span">
                                                <BsPaypal style={{ color: 'coral', paddingRight: '3px' }} />
                                                Paypal
                                            </span> :
                                            <span style={{ backgroundColor: 'coral' }} className="method-span">
                                                <BsTruck style={{ color: '#fff', paddingRight: '3px' }} />
                                                COD
                                            </span>}
                                        </td>
                                        <td>${order.total}</td>
                                        <td>{order.status}</td>
                                        <td>
                                            <div className="order-actions">
                                                <div className="edit-order">
                                                    <Link to={`/listorders/${order._id}`} >
                                                        <FaIcons.FaEdit style={{ color: '#9e9e9e' }} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
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

export default ListOrders
