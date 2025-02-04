import React from 'react'
import FileUpload from './components/FileUpload'
import Table_Data from './components/TableData'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className='bg-gray-100'>
      <Navbar />
      <FileUpload />
      <Table_Data />
    </div>
  )
}

export default App