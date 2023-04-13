import { useState } from "react";
import Header from "../components/Header";
import ProductCarousel from "../components/ProductCarousel";
import TravelAddProduct from "../components/TravelAddProduct";
import TravelForm from "../components/TravelForm";
import { useRouter } from "next/router";

// import prisma from "../lib/prisma";
// import axios from "axios";

// const addTrip = data => axios.post('/api/trip',data);

// import NotificationPermissionModal from "../components/getNotificationModal";







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

  const router = useRouter();



  const specialTravelFormBehaviour = (event) => {
    // event.preventDefault();
    // Handle form submission logic here
  
    router.push("/userTripsPage");
  
  
  };

  return (
    <div>
      <Header />
      <TravelForm specialSubmitBehavior={specialTravelFormBehaviour} />
      {/* <NotificationPermissionModal /> */}

      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="mt-8 mb-4 text-3xl font-bold text-gray-900">
        </h1>

        {/* <TravelAddProduct onAddProduct={handleAddProduct} /> */}
        {/* <ProductCarousel products={products} /> */}
      </div>
    </div>
  );
}

export default travel;
