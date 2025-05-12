import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper/core";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Product from "./Supaproduct";

SwiperCore.use([Navigation, Pagination]);

const CarouselProductFeed = ({ orders }) => {
  const groupedOrders = orders.reduce((acc, order) => {
    const key = order.originCountry;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(order);
    return acc;
  }, {});

  const nonEmptyGroups = Object.entries(groupedOrders)
    .filter(([_, orders]) => orders.length > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-8">
      {nonEmptyGroups.map(([originCountry, countryOrders]) => (
        <div key={originCountry} className="bg-white rounded-lg">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {originCountry}
            </h2>
            <span className="text-sm text-gray-500">
              {countryOrders.length} {countryOrders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>
          
          <Swiper
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className="relative px-4 py-2"
          >
            {countryOrders.map((order) => (
              <SwiperSlide key={order.id} className="pb-8">
                <div className="h-full">
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
                </div>
              </SwiperSlide>
            ))}

            <div className="hidden sm:block">
              <button className="swiper-button-prev !w-10 !h-10 !bg-white !shadow-md !rounded-full !text-gray-800 after:!text-lg">
                <span className="sr-only">Previous</span>
              </button>
              <button className="swiper-button-next !w-10 !h-10 !bg-white !shadow-md !rounded-full !text-gray-800 after:!text-lg">
                <span className="sr-only">Next</span>
              </button>
            </div>
          </Swiper>
        </div>
      ))}

      {nonEmptyGroups.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No orders available for display.</p>
        </div>
      )}
    </div>
  );
};

export default CarouselProductFeed;