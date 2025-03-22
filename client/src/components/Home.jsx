import InvoiceExtractor from './FileUpload'
import Navbar from './Navbar2'
import Sidebar from './Sidebar2'
// import Sidebar from './Sidebar'
import Table_DB from './InvoiceTable'

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main Content Wrapper (Full Width) */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Main Page Content Centered */}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-4xl text-center p-8 rounded-lg">
            {/* <InvoiceExtractor />
            <Table_DB /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;



