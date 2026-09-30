import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

// Import images directly
import topwearImg from '../assets/top.jpg';
import bottomwearImg from '../assets/boy.jpg';
import accessoriesImg from '../assets/shirt.jpg';
import jewelleriesImg from '../assets/bag.jpg';
import FootwearImg from '../assets/footwear.jpg';

const categories = [
  { name: 'Gentswear', imgSrc: bottomwearImg, link: '/dashboard' },
  { name: 'Officewear', imgSrc: accessoriesImg, link: '/dashboard' },
  { name: 'Topwear', imgSrc: topwearImg, link: '/dashboard' },
  { name: 'Accessories', imgSrc: jewelleriesImg, link: '/dashboard' },
  { name: 'Footwear', imgSrc: FootwearImg, link: '/dashboard' },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar showLogin={true} showStoreLogin={true} />
      <section className="relative h-[500px]"> 
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2.5,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          className="h-full"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.name} className="relative">
              <div
                className="bg-cover bg-center h-full"
                style={{ backgroundImage: `url(${category.imgSrc})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h4 className="text-white text-3xl font-bold">   
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold">Welcome to Walmart</h2>
            <p className="mt-4 text-lg">Discover the best products at unbeatable prices</p>
            <Link to="/auth" className="mt-6 inline-block bg-yellow-500 px-4 py-2 rounded text-lg hover:bg-yellow-600 transition">Login to Shop Now</Link>
          </div>
        </div>
                  </h4>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold">Welcome to Walmart</h2>
            <p className="mt-4 text-lg">Discover the best products at unbeatable prices</p>
            <Link to="/store-dashboard" className="mt-6 inline-block bg-yellow-500 px-4 py-2 rounded text-lg hover:bg-yellow-600 transition">Shop Now</Link>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-8 overflow-hidden">
        <h3 className="text-3xl font-semibold mb-10">Shop by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              to={category.link}
              key={category.name}
              className="group block bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform"
            >
              <img
                src={category.imgSrc}
                alt={category.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
