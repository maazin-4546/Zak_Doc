
const DashboardCard = ({ title, description, icon }) => {

    return (
        <div className="flex items-center p-6 h-48 w-76 bg-white border border-gray-300 rounded-xl shadow-sm mt-8">
            <div className="mr-4 flex-shrink-0">{icon}</div>
            <div className="space-y-4 ml-4">
                <p className="text-lg font-bold text-gray-500">{description}</p>
                <h5 className=" text-3xl font-bold text-gray-900">{title}</h5>
            </div>
        </div>
    );
};

export default DashboardCard;
