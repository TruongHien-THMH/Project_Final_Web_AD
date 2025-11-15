

import React from 'react';
import HeroSection from '../components/HeroSection';
import NowDisplay from '../components/NowDisplay';
import Display from '../components/Display';
import BEDisplay from '../components/BEDisplay';
function HomePage() {
  return (
    <>
      <HeroSection />
      {/* <NowDisplay /> */} 
      <Display/> 
      <span className='text-xl font-bold'>Demo BE API</span>
      <BEDisplay/>
    </>
  );
}

export default HomePage;