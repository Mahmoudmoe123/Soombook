import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import "swiper/css";
import "swiper/css/navigation";
import Product from "./Supaproduct";

// Register Navigation as a Swiper plugin
SwiperCore.use([Navigation]);

const CarouselProductFeed = ({ orders }) => {
  const groupedOrders = orders.reduce((acc, order) => {
    const key = order.originCountry;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(order);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(groupedOrders).map(([originCountry, orders]) => (
        <div key={originCountry} className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">{originCountry}</h2>
          <Swiper
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
            }}
            className="swiper-container relative"
          >
            {orders.map((order) => (
              <SwiperSlide key={order.id}>
                <Product
                  id={order.id}
                  title={order.title}
                  url={order.productUrl}
                  price={order.price}
                  description={order.description}
                  category={order.category}
                  origin={order.originCountry}
                  destination={order.destinationCountry}
                  userId={order.userId}
                  imageUrl={order.imageUrl}
                />
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev absolute top-1/2 left-0 bg-white bg-opacity-50 p-2 rounded-r-md text-gray-600 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="swiper-button-next absolute top-1/2 right-0 bg-white bg-opacity-50 p-2 rounded-l-md text-gray-600 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Swiper>
        </div>
      ))}
    </div>
  );
};

export default CarouselProductFeed;
