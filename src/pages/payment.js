import { useState } from "react";
import Header from "../components/Header";
import axios from "axios";

function PaymentForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);

  const addPaymentMethod = () => {
    const data = { firstName, lastName, accountNumber, cardNumber };
    axios.post("/api/paymentsapi", data);
  };

  //   const handleSubmit = (event) => {
  //     event.preventDefault();
  //     // TODO: Submit payment profile information to the database
  //   };

  //   useEffect(() => {
  //     axios.get('/api/payment-methods').then((response) => {
  //       setPaymentMethods(response.data);
  //     });
  //   }, []);

  return (
    <div>
      <Header />

      <form className="max-w-md mx-auto">
        <img
          className="md:col-span-full"
          src="https://is2-ssl.mzstatic.com/image/thumb/Purple126/v4/c6/52/2b/c6522b13-7640-e3b0-fce9-e6793302386b/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png"
          alt="fdgd"
        />
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block mb-2 font-bold">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(event) => setCardNumber(event.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="accountNumber" className="block mb-2 font-bold">
            Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="firstName" className="block mb-2 font-bold">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block mb-2 font-bold">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={addPaymentMethod}
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Payment Method
        </button>
      </form>

      <div className="mt-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment Methods On File</h2>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentMethods.map((paymentMethod) => (
                <tr key={paymentMethod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paymentMethod.cardNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paymentMethod.accountNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${paymentMethod.firstName} ${paymentMethod.lastName}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default PaymentForm;
