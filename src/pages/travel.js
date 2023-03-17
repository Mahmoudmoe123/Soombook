import { useState } from "react";
import Header from "../components/Header";
import ProductCarousel from "../components/ProductCarousel";
import TravelAddProduct from "../components/TravelAddProduct";
import TravelForm from "../components/TravelForm";
// import prisma from "../lib/prisma";
// import axios from "axios";

// const addTrip = data => axios.post('/api/trip',data);







// export async function getServerSideProps() {
//   return {
//     props: {
//       // props for the Home component
//     },
//   };
// }


function travel() {
  // const [products, setProducts] = useState([]);
  // const handleAddProduct = (product) => {
  //   setProducts([...products, product]);
  // };

  return (
    <div>
      <Header />
      <TravelForm />

      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="mt-8 mb-4 text-3xl font-bold text-gray-900">
          List Product For Sale?{" "}
        </h1>

        {/* <TravelAddProduct onAddProduct={handleAddProduct} /> */}
        {/* <ProductCarousel products={products} /> */}
      </div>
    </div>
  );
}

export default travel;
