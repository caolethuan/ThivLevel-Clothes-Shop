import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import useLocationForm from './useLocationForm'
import './locationForm.css'

function LocationForm({ element, onSave, initAddress }) {

    const customStyle = {
        container: (prodived) => ({
            ...prodived,
            marginBottom: 20
        })
    }

    const { detailAddress } = initAddress ? initAddress : ''



    const [detail, setDetail] = useState(detailAddress)

    useEffect(() => {
        setDetail(detailAddress)
    }, [detailAddress])

    const {
        state,
        onCitySelect,
        onDistrictSelect,
        onWardSelect,
        onClick,
        onCancel
    } = useLocationForm(true, initAddress)
    
    const {
        cityOptions,
        districtOptions,
        wardOptions,
        selectedCity,
        selectedDistrict,
        selectedWard
    } = state


    const handleCancel = (e) => {
        e.preventDefault()

        setDetail(detailAddress)
        onCancel()
        const addressFormElement = document.getElementsByClassName(element)[0]
        addressFormElement.classList.remove('active')
    }

    return (
        <div className="address-modal">
            <div className="address-select-container">
                <div className="address-select-item">
                    <Select
                        name="cityId"
                        key={`cityId_${selectedCity?.value}`}
                        isDisabled={cityOptions.length === 0}
                        options={cityOptions}
                        onChange={(option) => onCitySelect(option)}
                        placeholder="Tỉnh/Thành"
                        defaultValue={selectedCity}
                        styles={customStyle}
                    />

                    <Select
                        name="districtId"
                        key={`districtId_${selectedDistrict?.value}`}
                        isDisabled={districtOptions.length === 0}
                        options={districtOptions}
                        onChange={(option) => onDistrictSelect(option)}
                        placeholder="Quận/Huyện"
                        defaultValue={selectedDistrict}
                        styles={customStyle}
                    />

                    <Select
                        name="wardId"
                        key={`wardId_${selectedWard?.value}`}
                        isDisabled={wardOptions.length === 0}
                        options={wardOptions}
                        placeholder="Phường/Xã"
                        onChange={(option) => onWardSelect(option)}
                        defaultValue={selectedWard}
                        styles={customStyle}
                    />
                </div>

                <input type="text" placeholder="Detail address ..."
                    value={detail || ''}
                    onChange={e => setDetail(e.target.value)}
                    className="address-detail-input" />

                <div className="btn-wrapper">
                    <button className="address-cancel-btn" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="address-save-btn" onClick={(e) => onClick(e, detail, onSave, element)}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LocationForm