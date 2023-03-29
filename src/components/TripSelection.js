// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/client';
// import prisma from '../lib/prisma';

// function TripsList({trips}) {
//   const [trips, setTrips] = useState([]);
//   const [selectedTrip, setSelectedTrip] = useState(null);
//   const [session, loading] = useSession();

//   useEffect(() => {
//     async function fetchTrips() {
//       if (!loading && session) {
//         const userTrips = await prisma.trip.findMany({
//           where: { userId: session.user.id },
//           include: { orders: true },
//         });
//         setTrips(userTrips);
//       }
//     }
//     fetchTrips();
//   }, [loading, session]);

//   function handleTripSelect(tripId) {
//     const selected = trips.find((trip) => trip.id === tripId);
//     setSelectedTrip(selected);
//   }

//   return (
//     <>
//       <h1>Your Trips</h1>
//       <ul>
//         {trips.map((trip) => (
//           <li key={trip.id}>
//             <button onClick={() => handleTripSelect(trip.id)}>
//               {trip.originCountry} to {trip.destinationCountry}
//             </button>
//           </li>
//         ))}
//       </ul>
//       {selectedTrip && (
//         <div>
//           <h2>{selectedTrip.originCountry} to {selectedTrip.destinationCountry}</h2>
//           <p>Departure Date: {selectedTrip.departureDate}</p>
//           <p>Arrival Date: {selectedTrip.arrivalDate}</p>
//           <p>Orders: {selectedTrip.orders.length}</p>
//         </div>
//       )}
//     </>
//   );
// }

// export default TripsList;
