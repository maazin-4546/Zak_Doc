import InvoiceExtractor from './FileUpload'
import Sidebar from './Sidebar'
import Table_DB from './TableData'

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidebar />
      <InvoiceExtractor />
      <Table_DB />
    </div>
  )
}

export default Home