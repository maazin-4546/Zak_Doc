import React from 'react'
import FileUpload from './components/FileUpload'
import Table_Data from './components/TableData'
import Navbar from './components/Navbar'
import InvoiceExtractor from './components/Extraction_API'

const App = () => {
  return (
    <div className='bg-gradient-to-br from-blue-50 to-blue-100'>
      <Navbar />
      {/* <FileUpload /> */}
      <InvoiceExtractor/>

      <Table_Data />
    </div>
  )
}

export default App