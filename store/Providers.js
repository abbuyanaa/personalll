// 'use client';

// import React, { useRef } from 'react';
// import { Provider } from 'react-redux';
// import { CookiesProvider } from 'react-cookie';
// import createStore from './configureStore';

// export default function Providers({ children, preloadedState }) {
//   const storeRef = useRef();

//   if (!storeRef.current) {
//     storeRef.current = createStore(preloadedState);
//   }

//   return (
//     <Provider store={storeRef.current}>
//       <CookiesProvider defaultSetOptions={{ path: '/', sameSite: 'lax' }}>
//         {children}
//       </CookiesProvider>
//     </Provider>
//   );
// }
