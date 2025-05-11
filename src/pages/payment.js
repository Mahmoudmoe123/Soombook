import { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import { useSession } from "next-auth/react";

function PaymentForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const { data: session } = useSession();

  // Fetch payment methods when component mounts or session changes
  useEffect(() => {
    if (session?.user?.email) {
      fetchPaymentMethods();
    }
  }, [session]);

  // Function to fetch existing payment methods
  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`/api/paymentsapi?currentUserEmail=${session.user.email}`);
      setPaymentMethods(response.data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const addPaymentMethod = async (e) => {
    e.preventDefault(); // Prevent form submission
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      // Convert string values to integers for fields that need to be numbers
      const numericAccountNumber = parseInt(accountNumber, 10);
      const numericCardNumber = parseInt(cardNumber, 10);
      
      // Validate inputs
      if (!firstName || !lastName || !accountNumber || !cardNumber) {
        setMessage({ text: "All fields are required", type: "error" });
        setIsLoading(false);
        return;
      }
      
      if (isNaN(numericAccountNumber) || isNaN(numericCardNumber)) {
        setMessage({ text: "Account number and card number must be numeric", type: "error" });
        setIsLoading(false);
        return;
      }
      
      const data = { 
        firstName, 
        lastName, 
        accountNumber: numericAccountNumber, 
        cardNumber: numericCardNumber, 
        currentUserEmail: session.user.email
      };
  
      console.log("Sending payment data:", data);
  
      const response = await axios.post("/api/paymentsapi", data);
      
      if (response.status === 200) {
        console.log("Payment method created successfully");
        setMessage({ text: "Payment method added successfully!", type: "success" });
        
        // Clear form
        setFirstName("");
        setLastName("");
        setAccountNumber("");
        setCardNumber("");
        
        // Refresh payment methods list
        fetchPaymentMethods();
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      setMessage({ 
        text: error.response?.data?.error || "Failed to add payment method", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <form className="max-w-md mx-auto mt-8">
        <img
          className="md:col-span-full mb-6 mx-auto max-h-32"
          src="https://is2-ssl.mzstatic.com/image/thumb/Purple126/v4/c6/52/2b/c6522b13-7640-e3b0-fce9-e6793302386b/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png"
          alt="Payment System Logo"
        />
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Payment Method</h2>
        
        {message.text && (
          <div className={`p-3 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}
        
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
            required
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
            required
          />
        </div>
        
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
            required
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
            required
          />
        </div>
        
        <button
          onClick={addPaymentMethod}
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Saving...' : 'Save Payment Method'}
        </button>
      </form>

      <div className="mt-12 max-w-md mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Payment Methods On File</h2>
        {paymentMethods.length > 0 ? (
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
                {paymentMethods.map((method) => (
                  <tr key={method.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{method.cardNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{method.accountNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${method.firstName} ${method.lastName}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No payment methods found.</p>
        )}
      </div>
    </div>
  );
}

export default PaymentForm;