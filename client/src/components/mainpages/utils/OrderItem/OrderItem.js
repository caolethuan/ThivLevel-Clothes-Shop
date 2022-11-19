import React, { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import * as FaIcons from 'react-icons/fa'
import * as BsIcons from 'react-icons/bs'

export default function OrderItem(props) {
    const { data } = props;
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 6;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(data.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(data.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, data])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % data.length;
        setItemOffset(newOffset);
    };
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Payment</th>
                        <th>Total</th>
                        <th>Date order</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentItems.map(item => (
                            <tr key={item._id}>
                                <td>{item._id}</td>
                                { item.method === 'Paypal' ? 
                                <td className="method-payment"><BsIcons.BsPaypal style={{marginRight: 5, color: '#1111a9'}}/>{item.method}</td>
                                :<td className="method-payment"><FaIcons.FaTruck style={{marginRight: 5, color: 'coral'}}/>{item.method}</td>
                            }
                                
                                {/* <td>{new Date(item.createdAt).toLocaleDateString()}</td> */}
                                <td>${item.total}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={item.status ? "delivered" : "notDelivered"}>
                                        {item.status ? "Delivered" : "Not Delivered"}
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

        </>
    );
}