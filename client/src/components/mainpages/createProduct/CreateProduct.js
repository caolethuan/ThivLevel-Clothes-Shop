import React, { useState, useContext, useEffect, useRef } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import FileList from '../utils/FileList/FileList'
import { toast } from 'react-toastify'

const initialState = {
    product_id: '',
    title: '',
    price: 0,
    countInStock: 0,
    description: 'This is default description',
    content: 'And this is the default content',
    category: '',
    id: ''
}

function CreateProduct() {
    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [categories] = state.categoriesAPI.categories
    const [images, setImages] = useState([])

    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [size, setSize] = useState([])
    const [colors, setColors] = useState([])
    // const history = useHistory()
    const param = useParams()

    const [products] = state.productsAPI.products
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback

    const ref = useRef(null)
    const fileUpRef = useRef()

    useEffect(() => {
        if (param.id) {
            setOnEdit(true)
            products.forEach(product => {
                if (product._id === param.id) {
                    setProduct(product)
                    setImages([...product.images])

                    setSize([...product.size])

                    setColors([...product.colors])
                }
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages([])
            setSize([])
            setColors([])
        }
    }, [param.id, products])

    const handleUpload = async (e) => {
        e.preventDefault()
        try {
            if (!isAdmin) return alert('You are not an Admin.')
            const file = e.target.files[0]


            if (!file) return alert('File not exist.')


            if (file.size > 1024 * 1024) //1mb
                return alert('Size too large.')

            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return alert('File format is incorrect.')


            file.isUploading = true;


            setImages([...images, file]);

            let formData = new FormData()
            formData.append('file', file)


            const res = await axios.post('/api/upload', formData, {
                headers: { 'context-type': 'multipart/form-data', Authorization: token }
            })

            file.isUploading = false;

            setImages([...images, res.data]);

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const removeFile = (public_id) => {
        setImages(images.filter(image => image.public_id !== public_id))
    }

    const handleChangeInput = e => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    const handleSizeCheckbox = e => {
        const { name, checked } = e.target
        if (checked) {
            setSize([...size, name])
        } else {
            setSize(size.filter((e) => e !== name))
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            if (!isAdmin) return alert("You are not an admin.")

            if (!images || images.length === 0) return alert("No image Upload.")

            const colorsList = document.getElementsByClassName('item-color')
            const color = []
            for (let i = 0; i < colorsList.length; i++) {
                if (colorsList[i].attributes.style) {
                    color.push(colorsList[i].style.backgroundColor)
                }
            }


            if (onEdit) {
                await axios.put(`/api/products/${product._id}`, { ...product, images, color, size }, {
                    headers: { Authorization: token }
                })
            } else {
                await axios.post('/api/products', { ...product, images, color, size }, {
                    headers: { Authorization: token }
                })
            }

            setCallback(!callback)
            // history.push("/")
            setProduct(initialState)
            setImages([])

            if (onEdit) {
                toast.success("Update Successfully!", {
                    position: "top-center",
                    autoClose: 3000
                })
            } else {
                toast.success("Create product Successfully!", {
                    position: "top-center",
                    autoClose: 3000
                })
            }
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const isChecked = (sizeX) => {
        return size.includes(sizeX)
    }

    const handleToggleClasslistRef = (ref) => {
        if (!ref.current) {
            return;
        }
        if (!ref.current.classList.contains('big-border')) {
            ref.current.classList.add('big-border');
        } else {
            ref.current.classList.remove('big-border');
            ref.current = null;
        }
    }

    const removeColor = (item) => {
        setColors(colors.filter(color => color !== item))
    }


    // useEffect(() => {
    //     const handleOutsideClick = (e) => {
    //         handleToggleClasslistRef(ref)
    //     }
    //     const element = document.getElementById('wrapper')
    //     element.addEventListener('click',handleOutsideClick)
    //     return () => {
    //        element.removeEventListener('click',handleOutsideClick)
    //     }
    // }, [])


    return (
        <div>
            <div className='content-header'>
                <h2>{onEdit ? 'Update product' : 'Create Product'}</h2>
            </div>

            <div className="content-wrapper">
                <div className="create_product">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <label htmlFor="product_id">Product ID</label>
                            <input type="text" name="product_id" id="product_id" required
                                value={product.product_id} onChange={handleChangeInput} disabled={onEdit} />
                        </div>

                        <div className="row">
                            <label htmlFor="title">Title</label>
                            <input type="text" name="title" id="title" required
                                value={product.title} onChange={handleChangeInput} />
                        </div>

                        <div className="row">
                            <label htmlFor="price">Price</label>
                            <input type="number" name="price" id="price" required
                                value={product.price} onChange={handleChangeInput} />
                        </div>

                        <div className="row">
                            <label>Color</label>
                            <div id="wrapper">
                                {
                                    colors.map(item => {
                                        return (
                                            <div className='item-color-wrapper' key={item}>
                                                <div className='item-color'
                                                    onClick={(e) => {
                                                        handleToggleClasslistRef(ref);
                                                        e.stopPropagation();
                                                        ref.current = e.target;
                                                        handleToggleClasslistRef(ref);
                                                    }}
                                                    style={{ backgroundColor: item }}>
                                                    <div className='remove-color-btn' onClick={() => removeColor(item)} >x</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div className='item-color-wrapper'>
                                    <div className='item-color'
                                        onClick={() => {
                                            setColors((oldValue) => [...oldValue, oldValue.length])

                                        }}>
                                        +
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className='color-picker-wrapper'>
                            <label htmlFor="head"> Choose color here:</label>
                            <input
                                type='color'
                                id='head'
                                name='head'
                                onChange={(e) => {
                                    e.stopPropagation()
                                    if (ref.current) {
                                        ref.current.style.backgroundColor = e.target.value
                                    }

                                }
                                }
                            />

                        </div>

                        <div className="row">
                            <label>Size</label>
                            <div className="size-select-wrapper">
                                <div className="size-check">
                                    <input type="checkbox" name="XS" onChange={handleSizeCheckbox} checked={isChecked('XS')} />
                                    <label htmlFor="">XS</label>
                                </div>
                                <div className="size-check">
                                    <input type="checkbox" name="S" onChange={handleSizeCheckbox} checked={isChecked('S')} />
                                    <label htmlFor="">S</label>
                                </div>
                                <div className="size-check">
                                    <input type="checkbox" name="M" onChange={handleSizeCheckbox} checked={isChecked('M')} />
                                    <label htmlFor="">M</label>
                                </div>
                                <div className="size-check">
                                    <input type="checkbox" name="L" onChange={handleSizeCheckbox} checked={isChecked('L')} />
                                    <label htmlFor="">L</label>
                                </div>
                                <div className="size-check">
                                    <input type="checkbox" name="XL" onChange={handleSizeCheckbox} checked={isChecked('XL')} />
                                    <label htmlFor="">XL</label>
                                </div>
                                <div className="size-check">
                                    <input type="checkbox" name="XXL" onChange={handleSizeCheckbox} checked={isChecked('XXL')} />
                                    <label htmlFor="">XXL</label>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <label htmlFor="countInStock">In Stock</label>
                            <input type="number" name="countInStock" id="countInStock" required
                                value={product.countInStock} onChange={handleChangeInput} />
                        </div>

                        <div className="row">
                            <label htmlFor="description">Description</label>
                            <textarea type="text" name="description" id="description" required
                                value={product.description} rows="4" onChange={handleChangeInput} />
                        </div>

                        <div className="row">
                            <label htmlFor="content">Content</label>
                            <textarea type="text" name="content" id="content" required
                                value={product.content} rows="4" onChange={handleChangeInput} />
                        </div>

                        <div className="row">
                            <label htmlFor="categories">Categories</label>
                            <select name="category" value={product.category} onChange={handleChangeInput}>
                                <option value="">Please select a category</option>
                                {
                                    categories.map((category) => (
                                        <option value={category._id} key={category._id}>
                                            {category.name}
                                        </option>
                                    ))

                                }
                            </select>
                        </div>

                        <button type="submit">{onEdit ? "Update" : "Create"}</button>
                    </form>
                    <div className="divider"></div>
                    <div className="upload">
                        <label htmlFor="">Product images</label>
                        <input type="file" name="file" id="file_up" ref={fileUpRef}
                            onChange={handleUpload} style={{ display: 'none' }} />
                        <button
                            className="upload-product-images-btn"
                            onClick={() => fileUpRef.current.click()}
                        >
                            <FontAwesomeIcon icon={faDownload} style={{ marginRight: 5 }} />
                            Upload Images
                        </button>
                        <FileList files={images} removeFile={removeFile} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateProduct