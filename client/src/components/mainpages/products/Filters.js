import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import * as GoIcons from 'react-icons/go'

function Filters({ setItemOffset }) {

    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [category, setCategory] = state.productsAPI.category
    const [sort, setSort] = state.productsAPI.sort
    const [search, setSearch] = state.productsAPI.search
    const [searchItem] = state.productsAPI.searchItem
    const [suggestions, setSuggestions] = state.productsAPI.suggestions

    const [open, setOpen] = useState(false)

    useEffect(() => {
        setSearch('')
        setSort('')
        setCategory('')
    }, [])

    const handleCategory = (e) => {
        setCategory(e.target.value)
        setSearch('')
        setItemOffset(0)
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setSearch(e.target.value.toLowerCase())
            setItemOffset(0)
            setOpen(false)
        }
    }

    const handleSearchBtn = (value) => {
        setSearch(value.toLowerCase())
        setItemOffset(0)
        setOpen(false)
    }

    const handleSuggest = e => {
        setSuggestions(e.target.value.toLowerCase())
    }
    return (
        <div className="filter_menu product res-row">

            <div className="col l-6 m-12 c-12 search" >
                <input type="text" placeholder="Nhập sản phẩm bạn muốn tìm kiếm ..."
                    value={suggestions}
                    onKeyPress={handleSearch}
                    onChange={handleSuggest}
                    onFocus={() => setOpen(true)}
                    onBlur={e => {
                        e.relatedTarget?.classList.contains('result-link') ?
                            e.preventDefault() :
                            setOpen(false)
                    }}
                />
                <button className="search-btn" onClick={() => handleSearchBtn(suggestions)}>
                    <GoIcons.GoSearch />
                </button>
                {
                    open && searchItem.length > 0 ?
                        <ul className="result-list">
                            {
                                searchItem.map((item, index) => {
                                    return index > 4 ? null :
                                        <li key={item._id} className="result-item">
                                            <a href="#!" className="result-link" onClick={(e) => {
                                                setSearch(e.target.innerText.toLowerCase())
                                                setSuggestions(e.target.innerText.toLowerCase())
                                                setItemOffset(0)
                                                setOpen(false)
                                            }}>
                                                {item.title}
                                            </a>
                                        </li>
                                })
                            }
                        </ul>
                        : null
                }
            </div>
            <div className="col l-6 m-12 c-12 tool-wrapper">
                <div className="filter">
                    <span>Lọc</span>
                    <select name="category" value={category} onChange={handleCategory}>
                        <option value="">Tất cả sản phẩm</option>
                        {
                            categories.map(category => (
                                <option value={"category=" + category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="sort">
                    <span>Sắp xếp</span>
                    <select value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="">Mới nhất</option>
                        <option value="sort=oldest">Cũ nhất</option>
                        <option value="sort=-sold">Best sales</option>
                        <option value="sort=-price">Giá: Cao -&gt; Thấp</option>
                        <option value="sort=price">Giá: Thấp -&gt; Cao</option>
                    </select>
                </div>
            </div>

        </div >
    )
}

export default Filters