import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Banner() {
  return (
    <div className="relative">
        <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20"/>
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={4000}
        transitionTime={500}
        swipeable={true}
      >
        <div className="h-64 md:h-80 flex items-center justify-center p-4">
          <img loading="lazy" src="/banners/sombook1.png" alt="Banner 1" className="max-h-full max-w-full object-contain rounded-lg shadow-lg" />
        </div>
        <div className="h-64 md:h-80 flex items-center justify-center p-4">
          <img loading="lazy" src="/banners/sombook2.png" alt="Banner 2" className="max-h-full max-w-full object-contain rounded-lg shadow-lg" />
        </div>
        <div className="h-64 md:h-80 flex items-center justify-center p-4">
          <img loading="lazy" src="/banners/sombook3.png" alt="Banner 3" className="max-h-full max-w-full object-contain rounded-lg shadow-lg" />
        </div>
      </Carousel>
    </div>
  );
}

export default Banner;
