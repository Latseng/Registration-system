// import {useState,useEffect} from 'react'

// const useRWD = () => {
//   const [device, setDevice] = useState('mobile')

//   const handleRWD = () => {
//     if(window.innerWidth > 576)
//       setDevice('desktop')
//   }

//   useEffect(() => {
//     window.addEventListener('resize', handleRWD);
//     handleRWD()
//     return (() => {
//       window.removeEventListener('resize', handleRWD);
//     })
//   },[]);

//   return device
// }

// export default useRWD

import { useState, useEffect } from "react";

const useRWD = () => {
  
  const [isDesktop, setIsDesktop] = useState(() => {
    return window.innerWidth > 576 
  });

  const handleRWD = () => {
    setIsDesktop(window.innerWidth > 576);
  };

  useEffect(() => {
    window.addEventListener("resize", handleRWD);
    return () => {
      window.removeEventListener("resize", handleRWD);
    };
  }, [handleRWD]);

  return isDesktop;
};

export default useRWD;