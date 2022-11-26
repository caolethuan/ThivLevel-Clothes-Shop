import React, { useState, useEffect, useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import * as FaIcons from 'react-icons/fa'
import * as BsIcons from 'react-icons/bs'
import { RiLockPasswordLine } from 'react-icons/ri'
import { toast } from 'react-toastify'
import DetailUserModal from '../utils/modal/DetailUserModal'

function Users() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [users, setUsers] = state.userAPI.allUser
    const [usersCopy] = state.userAPI.allUserCopy

    const [searchPhrase, setSearchPhrase] = useState('')

    const [currentUser, setCurrentUser] = useState(false)

    const handleStatus = async (user) => {
        user.status = !user.status
        try {
            await axios.patch(`/user/changestatus/${user._id}/`, { status: user.status }, {
                headers: { Authorization: token }
            })
            if (user.status)
                toast.success('This user is actived', {
                    position: "top-center",
                    autoClose: 3000,
                });
            else
                toast.success('This user is locked', {
                    position: "top-center",
                    autoClose: 3000,
                });
            setUsers([...users])
        } catch (error) {
            console.log(error.response.data.msg);
        }
    }

    const search = (e) => {
        const matchedUser = usersCopy.filter((user) => {
            return user._id.toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
                user.username.toLowerCase().includes(e.target.value.toLowerCase()) ||
                user.email.toLowerCase().includes(e.target.value.toLowerCase()) || user.phone?.includes(e.target.value.toLowerCase())

        })

        setUsers(matchedUser)
        setSearchPhrase(e.target.value)
    }
    // Paginate
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(users.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(users.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, users])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % users.length;
        setItemOffset(newOffset);
    };

    const handleViewDetail = (user) => {
        const viewbox = document.querySelector('.user-view-detail-box')
        viewbox.classList.toggle('active')
        setCurrentUser(user)
    }

    return (
        <div>
            <div className='content-header'>
                <h2>Tài khoản người dùng</h2>
            </div>

            <div className="content-wrapper">
                <div className="search-user">
                    <input className="search-user-input" value={searchPhrase} type="text" placeholder="Tìm kiếm bằng tên/ emai/ sđt"
                        onChange={search} />
                </div>
                <div className="users-list">
                    <table className="users-list-table">
                        <thead className="table-header">
                            <tr>
                                <th>ID</th>
                                <th>HỌ TÊN</th>
                                <th>EMAIL</th>
                                <th>SĐT</th>
                                <th>NGÀY TẠO</th>
                                <th>VAI TRÒ</th>
                                <th>TRẠNG THÁI</th>
                                <th>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {
                                currentItems.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="user-id">
                                                <span style={{ textTransform: 'uppercase' }}
                                                    title={user._id}>...{user._id.slice(-5)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-name">
                                                <span>{user.username}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-name">
                                                <span>{user.email ? user.email : ''}</span>
                                            </div>
                                        </td>
                                        <td>{user.phone ? user.phone : ''}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>{user.role === 1 ? 'Admin' : 'Customer'}</td>
                                        <td>
                                            <div className="user-publish-toggle" onClick={() => handleStatus(user)}>
                                                {
                                                    user.status ?
                                                        <BsIcons.BsToggleOn style={{ color: '#0e9f6e' }} /> :
                                                        <BsIcons.BsToggleOff style={{ color: '#ff5a1f' }} />
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-actions">
                                                <div className="edit-user">
                                                    <a href="#!" onClick={() => handleViewDetail(user)}>
                                                        <FaIcons.FaEye style={{ color: '#9e9e9e' }} />
                                                    </a>
                                                </div>
                                                <div className="delete-user">
                                                    <Link to="#!" >
                                                        <RiLockPasswordLine style={{ color: '#9e9e9e' }} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="user-view-detail-box">
                        {currentUser && <DetailUserModal detailUser={currentUser} />}
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

export default Users