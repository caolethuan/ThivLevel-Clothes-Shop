import { useState, useEffect } from 'react'
import axios from 'axios'
import { PATHS } from './constants'
import { toast } from 'react-toastify'


const FETCH_TYPES = {
    CITIES: "FETCH_CITIES",
    DISTRICTS: "FETCH_DISTRICTS",
    WARDS: "FETCH_WARDS"
}

const stateModal = {
    cityOptions: [],
    districtOptions: [],
    wardOptions: [],
    selectedCity: null,
    selectedDistrict: null,
    selectedWard: null
}

async function fetchLocationOptions(fetchType, locationId) {
    let url
    switch (fetchType) {
        case FETCH_TYPES.CITIES:
            url = PATHS.CITIES
            break;
        case FETCH_TYPES.DISTRICTS:
            url = `${PATHS.DISTRICTS}/${locationId}.json`
            break;
        case FETCH_TYPES.WARDS:
            url = `${PATHS.WARDS}/${locationId}.json`
            break;
        default:
            return []
    }

    const locations = (await axios.get(url)).data["data"]
    return locations.map(({ id, name }) => ({ value: id, label: name }))
}

function setInitData(initAddress) {
    if (typeof initAddress === "object") {
        const { city, district, ward } = initAddress
        return {
            cityId: city?.value,
            districtId: district?.value,
            wardId: ward?.value,
        }
    } else return {
        cityId: 278,
        districtId: 617,
        wardId: 63,
    }
}

async function fetchInitialData(initAddress) {
    // (await axios.get(PATHS.LOCATION)).data
    const { cityId, districtId, wardId } = setInitData(initAddress)
    const [cities, districts, wards] = await Promise.all([
        fetchLocationOptions(FETCH_TYPES.CITIES),
        fetchLocationOptions(FETCH_TYPES.DISTRICTS, cityId),
        fetchLocationOptions(FETCH_TYPES.WARDS, districtId)
    ])

    return {
        cityOptions: cities,
        districtOptions: districts,
        wardOptions: wards,
        selectedCity: cities.find(c => c.value === cityId),
        selectedDistrict: districts.find(d => d.value === districtId),
        selectedWard: wards.find(w => w.value === wardId)
    }
}

function useLocationForm(shouldFetchInitialLocation, initData) {
    const [state, setState] = useState(stateModal)
    const { selectedCity, selectedDistrict } = state;
    const [callback, setCallback] = useState(false)


    useEffect(() => {
        let isCancelled = false;
        (async function () {
            if (shouldFetchInitialLocation && typeof initData === 'object') {
                const initialData = await fetchInitialData(initData)
                if (!isCancelled) setState(initialData)
            } else {
                const options = await fetchLocationOptions(FETCH_TYPES.CITIES)
                setState({ ...stateModal, cityOptions: options })
            }
        })()

        return () => {
            isCancelled = true;
        }
    }, [initData, callback])

    useEffect(() => {
        (async function () {
            if (!selectedCity) return;
            const options = await fetchLocationOptions(
                FETCH_TYPES.DISTRICTS,
                selectedCity.value
            )
            setState({ ...state, districtOptions: options })
        })()
    }, [selectedCity])

    useEffect(() => {
        (async function () {
            if (!selectedDistrict) return;
            const options = await fetchLocationOptions(
                FETCH_TYPES.WARDS,
                selectedDistrict.value
            )
            setState({ ...state, wardOptions: options })
        })()

    }, [selectedDistrict])

    function onCitySelect(option) {
        if (option !== selectedCity) {
            setState({
                ...state,
                districtOptions: [],
                wardOptions: [],
                selectedCity: option,
                selectedDistrict: null,
                selectedWard: null
            })
        }
    }

    function onDistrictSelect(option) {
        if (option !== selectedDistrict) {
            setState({
                ...state,
                wardOptions: [],
                selectedDistrict: option,
                selectedWard: null
            })
        }
    }

    function onWardSelect(option) {
        setState({ ...state, selectedWard: option })
    }

    function onCancel() {
        setCallback(!callback)
    }

    function onClick(e, detailAddressValue, onSave, element) {
        e.preventDefault()

        const addressObject = {
            detailAddress: detailAddressValue,
            city: state.selectedCity,
            district: state.selectedDistrict,
            ward: state.selectedWard
        }

        if (state.selectedCity === null || state.selectedDistrict === null || state.selectedWard === null) {
            return toast.warn("Please choose your address", {
                position: "top-center",
                autoClose: 3000
            })
        } else {

            onSave(addressObject)

            const addressFormElement = document.getElementsByClassName(element)[0]
            addressFormElement.classList.remove('active')
        }

        // console.group("Address")
        // console.log("City: ", state.selectedCity);
        // console.log("District: ", state.selectedDistrict);
        // console.log("Ward: ", state.selectedWard);
        // console.log("Detail address: ", detailAddressValue);
        // console.groupEnd();
    }



    return {
        state,
        onCitySelect,
        onDistrictSelect,
        onWardSelect,
        onClick,
        onCancel
    }
}

export default useLocationForm