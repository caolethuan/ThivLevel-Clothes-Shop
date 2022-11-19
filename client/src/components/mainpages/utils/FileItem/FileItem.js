import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'



const FileItem = ({ file, deleteFile }) => {
    return (
        <>
            <img src={file.url} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            <div className="actions">

                {file.isUploading &&
                    <div className="loading-image">
                        <FontAwesomeIcon
                            icon={faSpinner} className="fa-spin"
                            onClick={() => deleteFile(file.public_id)} />
                    </div>
                }

                {!file.isUploading &&
                    <div className="delete-image">
                        <FontAwesomeIcon icon={faTrash}
                            onClick={() => deleteFile(file.public_id)} />
                    </div>
                }
            </div>
        </>
    )
}

export default FileItem