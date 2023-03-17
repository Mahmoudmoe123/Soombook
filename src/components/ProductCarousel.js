import { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


function ProductCarousel({ products }) {


    
const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  }; 
  
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Products</h2>
      <Carousel responsive={responsive} infinite={true}>
        {products.map((product) => (
          <div key={product.productName} className="px-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={product.productUrl} alt={product.productName} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="mb-2 text-lg font-medium text-gray-900">{product.productName}</h3>
                <p className="text-gray-700">{`$${product.sellingPrice}`}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ProductCarousel