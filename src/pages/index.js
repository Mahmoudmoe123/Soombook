import Head from "next/head";
import Banner from "../components/Banner";
import prisma from "../lib/prisma";
import Header from "../components/Header";
import CarouselProductFeed from "../components/CarouselProductFeed";
import SearchFilters from "../components/SearchFilters";
import { useState, useMemo } from "react";

export default function Home({ orders }) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    origin: '',
    priceRange: ''
  });

  const originCountries = useMemo(() => {
    return [...new Set(orders.map(order => order.originCountry))].sort();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const titleMatch = order.title?.toLowerCase().includes(searchTerm);
        const descMatch = order.description?.toLowerCase().includes(searchTerm);
        if (!titleMatch && !descMatch) return false;
      }

      if (filters.category && order.category !== filters.category) {
        return false;
      }

      if (filters.origin && order.originCountry !== filters.origin) {
        return false;
      }

      if (filters.priceRange) {
        const price = Number(order.price);
        if (filters.priceRange === '501+') {
          if (price <= 500) return false;
        } else {
          const [min, max] = filters.priceRange.split('-').map(Number);
          if (price < min || price > max) return false;
        }
      }

      return true;
    });
  }, [orders, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Alsombook</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <Banner />
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold">
              Browse Orders ({filteredOrders.length})
            </h1>
          </div>
          
          <SearchFilters 
            onFilterChange={handleFilterChange}
            originCountries={originCountries}
          />

          {/* Active Filters */}
          {Object.values(filters).some(filter => filter) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <div 
                    key={key}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <span>{`${key}: ${value}`}</span>
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="ml-2 focus:outline-none"
                    >
                      <span className="text-blue-600">×</span>
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => setFilters({
                  search: '',
                  category: '',
                  origin: '',
                  priceRange: ''
                })}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results */}
          <div className="mb-10">
            {filteredOrders.length > 0 ? (
              <CarouselProductFeed orders={filteredOrders} />
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No orders match your search criteria.</p>
                <button 
                  onClick={() => setFilters({
                    search: '',
                    category: '',
                    origin: '',
                    priceRange: ''
                  })}
                  className="mt-4 text-blue-500 hover:text-blue-600"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const orders = await prisma.order.findMany();
    
    const ordersWithoutArrivalDate = orders.map(
      ({ arrivalDate, ...rest }) => rest
    );

    return {
      props: {
        orders: ordersWithoutArrivalDate,
      },
    };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return {
      props: {
        orders: [],
      },
    };
  }
}