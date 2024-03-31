 //export const server = "https://e-shop-xi-vert.vercel.app/api/v2";
// export const backend_url = "https://e-shop-phi-plum.vercel.app/";
// export const soketEndPoint = "https://socket-server-e-shop-bso6.onrender.com/";

//  export const server = "http://localhost:8000/api/v2";
//  export const backend_url = "http://localhost:8000/";
 //export const soketEndPoint = "http://localhost:4000/";



export const server = process.env.REACT_APP_SERVER;
export const backend_url = process.env.REACT_APP_BACKEND_URL;
export const soketEndPoint = process.env.REACT_APP_SOCKET_ENDPOINT;
export const pageSize = process.env.REACT_APP_PAGE_SIZE;



// const path = require("path");
// // config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require("dotenv").config({
//       path: "config/.env",
//     });
//   }

// const server = process.env.SERVER;
// const backendUrl = process.env.BACKEND_URL;
// const socketEndPoint = process.env.SOCKET_ENDPOINT;
// console.log('Server:', server);
// console.log('Backend URL:', backend_url);
// console.log('Socket Endpoint:', soketEndPoint);