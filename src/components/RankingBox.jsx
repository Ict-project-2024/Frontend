import React from 'react'
import "../assets/css/RankingBox.css"

const RankingBox = ({ userPosition, userName, entriesCount, selfBox }) => {
    return (
        <div className='ranking-box'>
            <div className={`position-ball ${selfBox && 'true'}`}>
                {userPosition}
            </div>
            <span className='user-name'>
                {userName}
            </span>
            <span className='entries-count'>
                {entriesCount.toLocaleString()}
            </span>
        </div>
    )
}

export default RankingBox