import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import * as FaIcons from 'react-icons/fa'
import * as BsIcons from 'react-icons/bs'
import moment from 'moment'
function OrderHistory() {

    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [data, setData] = useState([])
    const [token] = state.token
    const [sort, setSort] = useState('')
    const [status, setStatus] = useState('')
    const [searchPhrase, setSearchPhrase] = useState('')
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 6;
    // const [search, setSearch] = useState('')

    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                const res = await axios.get(`/user/history?${status}&${sort}`, {
                    headers: { Authorization: token }
                })
                setHistory(res.data);
                setData(res.data)          
            }
            getHistory()
        }
    }, [token, setHistory, sort, status]);

    const search = (e) => {
        const matchedUsers = data.filter((order) => {
            return order._id.toString().toLowerCase().includes(e.target.value.toLowerCase())||
            ((order.name || order.address.recipient_name).toLowerCase().includes(e.target.value.toLowerCase())) ||
            order.email?.toLowerCase().includes(e.target.value.toLowerCase()) || order.phone?.includes(e.target.value.toLowerCase())
        })

        setHistory(matchedUsers)
        setSearchPhrase(e.target.value)
    }

    const handleStatus = (e) => {
        setStatus(e.target.value)
        setSearchPhrase('')
    }

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(history.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(history.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, history])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % history.length;
        setItemOffset(newOffset);
    };

    return (
        <div className="history-page">
            <h2>Lịch sử mua hàng</h2>
            <h4>Bạn đã đặt {history.length} đơn hàng</h4>
            <div className="order-filter-client-wrapper">
                <div className='order-search-client'>
                    <input className="search-order-input" value={searchPhrase} type="text" placeholder="Tìm kiếm bằng mã đơn/tên/email/Sđt"
                    onChange={search}/>
                </div>

                <div className="order-status-client">
                    <span>Trạng thái: </span>
                    <select name="status" value={status} onChange={handleStatus}>
                        <option value="">Tất cả đơn hàng</option>
                    
                        <option value="status=Pending">
                            Đang chờ
                        </option>
                        
                        <option value="status=Processing">
                            Đang xử lý
                        </option>

                        <option value="status=Shipping">
                            Đang giao hàng
                        </option>

                        <option value="status=Delivered">
                            Đã giao hàng
                        </option>

                        <option value="status=Cancel">
                            Đơn bị hủy
                        </option>
                        
                    </select>
                </div>

                <div className="order-sortdate-client">
                    <span>Sắp xếp: </span>
                    <select value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="">Mới nhất</option>
                        <option value="sort=oldest">Cũ nhất</option>
                    </select>
                </div>
            </div>       
            <table>
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Phương thức thanh toán</th>
                        <th>Tổng cộng</th>
                        <th>Ngày đặt</th>
                        <th>Trạng thái</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentItems.map(item => (
                            <tr key={item._id}>
                                <td style={{textTransform: 'uppercase'}}>{item._id}</td>
                                { item.method === 'Paypal' ? 
                                <td className="method-payment"><BsIcons.BsPaypal style={{marginRight: 5, color: '#1111a9'}}/>{item.method}</td>
                                :<td className="method-payment"><FaIcons.FaTruck style={{marginRight: 5, color: 'coral'}}/>{item.method}</td>
                            }
                                
                                {/* <td>{new Date(item.createdAt).toLocaleDateString()}</td> */}
                                <td>${item.total}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString()}  {moment(item.createdAt).format('LT')}</td>
                                <td>
                                    <span className={item.status ? item.status.toLowerCase() : "non-status"}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/history/${item._id}`}>
                                        <FontAwesomeIcon icon={faEye} /> View
                                    </Link>
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
        
    )
}

export default OrderHistory