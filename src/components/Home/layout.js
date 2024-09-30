import React, { useCallback } from 'react';;
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  
  return (
    <React.Fragment>
        <Navbar />
      <main
        sx={{
          variant: 'layout.main',
        }}
      >
        {children}
      </main>
      <Footer />
    </React.Fragment>
  );
}
