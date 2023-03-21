import React from "react";
import Supaproduct from "./Supaproduct";

function Supaproductfeed({ products }) {
  return (
    <div className="grid grid-flow-row-dense  sm: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto">
      {products
        .slice(0, 4)
        .map(
          ({
            id,
            title,
            price,
            description,
            category,
            productUrl,
            originCountry,
            destinationCountry,
          }) => (
            <Supaproduct
              key={id}
              id={id}
              title={title}
              price={price}
              description={description}
              category={category}
              url={productUrl}
              origin={originCountry}
              destination={destinationCountry}
            />
          )
        )}
      <img
        className="md:col-span-full"
        src="https://links.papareact.com/dyz"
        alt=""
      />
      <div className="md:col-span-2">
        {products
          .slice(4, 5)
          .map(
            ({
              id,
              title,
              price,
              description,
              category,
              productUrl,
              originCountry,
              destinationCountry,
            }) => (
              <Supaproduct
                key={id}
                id={id}
                title={title}
                price={price}
                description={description}
                category={category}
                url={productUrl}
                origin={originCountry}
                destination={destinationCountry}
              />
            )
          )}
      </div>

      {products
        .slice(5, products.length)
        .map(
            ({
              id,
              title,
              price,
              description,
              category,
              productUrl,
              originCountry,
              destinationCountry,
            }) => (
              <Supaproduct
                key={id}
                id={id}
                title={title}
                price={price}
                description={description}
                category={category}
                url={productUrl}
                origin={originCountry}
                destination={destinationCountry}
              />
            )
        )}
    </div>
  );
}

export default Supaproductfeed;
