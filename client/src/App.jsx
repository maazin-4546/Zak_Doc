// import FileUpload from './components/FileUpload'
import Table_Data from './components/TableData'
import Navbar from './components/Navbar'
import InvoiceExtractor from './components/Extraction_API'
import Table_DB from './components/Table_DB'

const App = () => {
  return (
    <div className='bg-gradient-to-br from-blue-50 to-blue-100'>
      <Navbar />
      <InvoiceExtractor/>
      <Table_DB/>

      {/* <FileUpload /> */}
      {/* <Table_Data /> */}
    </div>
  )
}

export default App