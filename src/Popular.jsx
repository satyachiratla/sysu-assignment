import React from 'react'

export default function Popular({ onChildValue }) {

  function ListItem({ value }) {

    const handleClick = () => {
      onChildValue(value)
    }
    
    return <li onClick={handleClick}>{value}</li>
  }

  return (
    <div className='popular'>
      <h1>What’s popular right now?</h1>

      <div className='list'>
        <ul className='list-items'>
            <ListItem value="ENGINEERING DAYS" />
            <ListItem value="BANGALORE STORIES" />
            <ListItem value="GOA DIARIES" />
            <ListItem value="NITK STUFFS" />
            <ListItem value="IIM THINGS" />
            <ListItem value="IIMB FACTS" />
            <ListItem value="SHAYARI" />
            <ListItem value="VIKAS MEENA" />
        </ul>
      </div>
    </div>
  )
}
