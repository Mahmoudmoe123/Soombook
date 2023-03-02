import Image from "next/image";
import Header from "../components/Header";

function Checkout() {
  return (
    <div className="bg-gray-100">
      <Header />

      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/*Left Side  */}

        <div>
    <Image src={'https://links.papareact.com/ikj'} height={250} width={1020} style={{objectFit: 'contain'}} />


    <div>


<h1>Shopping Basket</h1>


    </div>

        </div>

        {/* Right Side */}
        <div></div>
      </main>
    </div>
  );
}

export default Checkout;
