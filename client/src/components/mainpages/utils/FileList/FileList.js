import React, { useContext } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../../GlobalState'
import FileItem from './../FileItem/FileItem'

const FileList = ({ files, removeFile }) => {
    const state = useContext(GlobalState)
    const [token] = state.token
    const deleteFileHandler = async(_id) => {
        try {
     
            await axios.post('/api/destroy', { public_id: _id }, {
                headers: { Authorization: token }
            })
        
           removeFile(_id)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    return (
        <ul className="file-list">
            {
                files &&
                files.map((f, index) => (
                    <li key={index} className="file-item">
                        <FileItem
                            key={f.public_id}
                            file={f}
                            deleteFile={deleteFileHandler} 
                        />
                    </li>
                ))
            }
        </ul>
    )
}

export default FileList