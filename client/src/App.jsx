import Navbar from './components/Navbar'
import InvoiceExtractor from './components/FileUpload'
import Table_DB from './components/TableData'

const App = () => {
  return (
    <div className='bg-gradient-to-br from-blue-50 to-blue-100'>
      <Navbar />
      <InvoiceExtractor />
      <Table_DB />
    </div>
  )
}

export default App