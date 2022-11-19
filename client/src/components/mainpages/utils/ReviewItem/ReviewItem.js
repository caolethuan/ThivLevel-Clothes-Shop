import React, { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate'
import moment from 'moment'
import Rating from "../Rating/Rating";
import Unknow from "../../../../images/unknow.jpg"

export default function ReviewItem(props) {
    const { data } = props;
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 3;

    useEffect(() =>{
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
             {
                currentItems.map(review => (
                    <div className='review' key={review._id}>
                        <div className="review-wrapper">
                            <img src={review?.imageUser?.url || Unknow} alt="avt-reviewer"/>
                            <div className="">
                                <strong>{review.name}</strong>
                                <Rating value={review.rating} text={''} />
                                <span>{moment(review.createdAt).calendar()}</span>
                                <p>{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            
            containerClassName="review-pagination"
            pageLinkClassName="review-page-num"
            previousLinkClassName="review-page-num"
            activeClassName="review-page-active"
          />
      
        </>
      );   
}