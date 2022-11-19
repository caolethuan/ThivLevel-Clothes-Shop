import React from 'react'
import * as FaIcons from 'react-icons/fa'
import Unknow from '../../../../images/unknow.jpg'

function DetailUserModal({ detailUser }) {

    const handleCloseView = (e) => {
        e.preventDefault()
        const viewbox = document.querySelector('.user-view-detail-box')
        viewbox.classList.remove('active')
    }

    return (
    <div className="view-detail-user-modal">
         <section className="user-details">
            <div className='user-details-wrapper'>
                <div className='grid-2'>
                    <div className='user-profile-img'>
                        <img
                        src={      
                            detailUser.imageProfile ? detailUser.imageProfile.url : Unknow
                        }
                        alt="" />
                    </div>
                    <div className='user-about-profile'>
                        <div>
                            <p>{detailUser.username}</p>
                        </div>
                        <span>{detailUser.role === 1 ? 'Admin' : 'Customer'}</span>
                    </div>
                </div>
                <div className='user-details-card'>
                    <div className="user-details-field">
                        <div className='user-name-field'>
                            <label>User ID: </label>
                        </div>
                        <div className='user-text-field' id="user-id">{detailUser._id}</div>
                    </div>

                    <div className="user-details-field">
                        <div className='user-name-field'>
                            <label>Name: </label>
                        </div>
                        <div className='user-text-field'>{detailUser.username}</div>
                    </div>

                    <div className="user-details-field">
                        <div className='user-name-field'>
                            <label>Date of birth: </label>
                        </div>
                        <div className='user-text-field'>{new Date(detailUser.dateOfbirth).toLocaleDateString()}</div>
                    </div>

                    <div className="user-details-field">
                        <div className='user-name-field'>
                            <label>Gender: </label>
                        </div>
                        <div className='user-text-field'>{detailUser.gender}</div>
                    </div>

                    <div className="user-details-field">
                        <div className='user-name-field'>
                            <label>Email: </label>
                        </div>
                        <div className='user-text-field' id="user-email">{detailUser.email}</div>
                    </div>

                    <div className="user-details-field">
                        <div className='user-name-field'>
                            <label>Phone: </label>
                        </div>
                        <div className='user-text-field'>{detailUser.phone}</div>
                    </div>

                    <div className="user-details-field">
                        <div className='user-name-field'>
                            <label>Address: </label>
                        </div>
                        <div className='user-text-field' id="user-address">
            
                            {detailUser?.address?.city?.label ? `${detailUser.address.detailAddress || ''} ${detailUser.address.ward?.label}, ${detailUser.address.district?.label}, ${detailUser.address.city?.label}` : ''}
                            
                        </div>

                    </div>

                    <div className="user-details-field">
                        <div className='user-name-field'>
                            <label>Joining date: </label>
                        </div>
                        <div className='user-text-field'>{new Date(detailUser.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="user-details-field">
                        <div className='user-name-field'>
                            <label>Status: </label>
                        </div>
                        <div className='user-text-field'>{detailUser.status ? <span style={{backgroundColor: '#def7ec', color: '#0e9f6e', padding: '2px 5px', borderRadius: '9999px'}}>active</span> : <span style={{backgroundColor: '#fdf6b2', color: '#c27803', padding: '2px 5px', borderRadius: '9999px'}}>locked</span>}</div>
                    </div>

                </div>
            </div>
            <div className="user-view-close" onClick={handleCloseView}>
                    <FaIcons.FaRegTimesCircle style={{ color: 'crimson' }} />
            </div>
         </section>
    </div>
  )
}

export default DetailUserModal
