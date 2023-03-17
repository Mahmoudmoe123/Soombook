
// export async function getServerSideProps() {
//   // Create a user with products and purchases
//   const user1 = await prisma.user.create({
//     data: {
//       name: 'John Doe',
//       email: 'johndoe@example.com',
//       password: 'secret',
//       products: {
//         create: [
//           {
//             name: 'Product 1',
//             description: 'Description of Product 1',
//             price: 9.99,
//             image: 'https://picsum.photos/200',
//             purchases: {
//               create: [
//                 {
//                   quantity: 2,
//                 },
//               ],
//             },
//           },
//           {
//             name: 'Product 2',
//             description: 'Description of Product 2',
//             price: 19.99,
//             image: 'https://picsum.photos/200',
//             purchases: {
//               create: [
//                 {
//                   quantity: 1,
//                 },
//               ],
//             },
//           },
//         ],
//       },
//     },
//     include: {
//       products: true,
//     },
//   });

//   // Create another user with products and purchases
//   const user2 = await prisma.user.create({
//     data: {
//       name: 'Jane Smith',
//       email: 'janesmith@example.com',
//       password: 'secret',
//       products: {
//         create: [
//           {
//             name: 'Product 3',
//             description: 'Description of Product 3',
//             price: 29.99,
//             image: 'https://picsum.photos/200',
//             purchases: {
//               create: [
//                 {
//                   quantity: 3,
//                 },
//               ],
//             },
//           },
//           {
//             name: 'Product 4',
//             description: 'Description of Product 4',
//             price: 39.99,
//             image: 'https://picsum.photos/200',
//             purchases: {
//               create: [
//                 {
//                   quantity: 2,
//                 },
//               ],
//             },
//           },
//         ],
//       },
//     },
//     include: {
//       products: true,
//     },
//   });

//   return {
//     props: {
//       users: [user1, user2].map((user) => ({
//         ...user,
//         products: user.products.map((product) => ({
//           ...product,
//           totalQuantity: product.purchases.reduce((acc, purchase) => acc + purchase.quantity, 0),
//         })),
//       })),
//     },
//   };
// }

// export default function HomePage({ users }) {
//   const handleAddUser = async () => {
//     // TODO: Implement add user functionality
//   };

//   const handleGetUsers = async () => {
//     // TODO: Implement get users functionality
//   };

//   return (
//     <div>
//       <button onClick={handleAddUser}>Add User with Products and Purchases</button>
//       <button onClick={handleGetUsers}>Get Users with Products and Purchases</button>
//       {users.map((user) => (
//         <div key={user.id}>
//           <h2>{user.name}</h2>
//           <ul>
//             {user.products.map((product) => (
//               <li key={product.id}>
//                 {product.name} ({product.totalQuantity} purchased)
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// }

// import prisma from "../lib/prisma";

// export default function Index({ users }) {
//   return (
//     <div>
//       <h1>Users</h1>
//       <ul>
//         {users.map((user) => (
//           <li key={user.id}>
//             <h2>{user.name}</h2>
//             <p>Email: {user.email}</p>
//             <h3>Products</h3>
//             <ul>
//               {user.products.map((product) => (
//                 <li key={product.id}>
//                   <h4>{product.name}</h4>
//                   <p>Description: {product.description}</p>
//                   <p>Price: ${product.price}</p>
//                   <h5>Purchases</h5>
//                   <ul>
//                     {product.purchases.map((purchase) => (
//                       <li key={purchase.id}>
//                         <p>Quantity: {purchase.quantity}</p>
//                       </li>
//                     ))}
//                   </ul>
//                 </li>
//               ))}
//             </ul>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export async function getServerSideProps() {
//   const users = await prisma.user.findMany({
//     include: {
//       products: {
//         include: {
//           purchases: true,
//         },
//       },
//       purchases: true,
//     },
//   });

//   return {
//     props: { users },
//   };
// }

// async function main() {
//   // Create some sample users
//   const alice = await prisma.user.create({
//     data: {
//       name: "Alice",
//       email: "alice@example.com",
//       password: "password1",
//       products: {
//         create: [
//           {
//             name: "Product A",
//             description: "Description of Product A",
//             price: 9.99,
//             image: "https://example.com/product-a.png",
//             purchases: {
//               create: [
//                 {
//                   quantity: 2,
//                 },
//                 {
//                   quantity: 1,
//                 },
//               ],
//             },
//           },
//           {
//             name: "Product B",
//             description: "Description of Product B",
//             price: 14.99,
//             image: "https://example.com/product-b.png",
//             purchases: {
//               create: [
//                 {
//                   quantity: 3,
//                 },
//               ],
//             },
//           },
//         ],
//       },
//     },
//     include: {
//       products: {
//         include: {
//           purchases: true,
//         },
//       },
//       purchases: true,
//     },
//   });

//   const bob = await prisma.user.create({
//     data: {
//       name: "Bob",
//       email: "bob@example.com",
//       password: "password2",
//       products: {
//         create: [
//           {
//             name: "Product C",
//             description: "Description of Product C",
//             price: 24.99,
//             image: "https://example.com/product-c.png",
//             purchases: {
//               create: [
//                 {
//                   quantity: 1,
//                 },
//               ],
//             },
//           },
//         ],
//       },
//     },
//     include: {
//       products: {
//         include: {
//           purchases: true,
//         },
//       },
//       purchases: true,
//     },
//   });

//   console.log({ alice, bob });}



import { PrismaClient } from '@prisma/client'

// Instantiate it
const prisma = new PrismaClient()

export async function getServerSideProps() {


const users = await prisma.user.findMany();

  return {
    props: {
      // props for the Home component

      users: JSON.parse(JSON.stringify(users)),
    },
  };
}


import React from 'react'

function indexprisma({users}) {
  return (
    <div>


<h1>{users}</h1>

    </div>
  )
}

export default indexprisma