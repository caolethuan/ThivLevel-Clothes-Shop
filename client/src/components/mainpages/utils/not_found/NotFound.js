import React from 'react'
import _404Notfound from '../../../../images/404-not_found.png'

function NotFound() {
  const style = {
    display: 'block',
    width: '100%',
    height: '800px',
    margin: '-100px auto 0',
    objectFit: 'contain'
  }
  return (
    <div>
        <img src={_404Notfound} alt="" style={style} />
    </div>
  )
}

export default NotFound