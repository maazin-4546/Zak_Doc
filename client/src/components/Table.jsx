import React from 'react';

const ProductTable = () => {

    const products = [
        {
            name: 'Apple MacBook Pro 17"',
            color: 'Silver',
            category: 'Laptop',
            price: '$2999'
        },
        {
            name: 'Microsoft Surface Pro',
            color: 'White',
            category: 'Laptop PC',
            price: '$1999'
        },
        {
            name: 'Magic Mouse 2',
            color: 'Black',
            category: 'Accessories',
            price: '$99'
        }
    ];

    return (
        <div className="container relative mx-auto overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr>
                        <th scope="col" className="px-6 py-3">Product name</th>
                        <th scope="col" className="px-6 py-3">Color</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr
                            key={index}
                            className={
                                index % 2 === 0
                                    ? "bg-white border-b hover:bg-gray-100"
                                    : "bg-gray-50 border-b hover:bg-gray-100"
                            }
                        >
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                                {product.name}
                            </th>
                            <td className="px-6 py-4">{product.color}</td>
                            <td className="px-6 py-4">{product.category}</td>
                            <td className="px-6 py-4">{product.price}</td>
                            <td className="px-6 py-4 text-right">
                                <a
                                    href="#"
                                    className="font-medium text-blue-500 hover:underline"
                                >
                                    Edit
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
