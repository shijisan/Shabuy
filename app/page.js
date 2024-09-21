"use client"

import CustomCarousel from "@/components/Carousel";

export default function Home(){
  const images = [
    'https://via.placeholder.com/800x100.png?text=Slide+1',
    'https://via.placeholder.com/800x100.png?text=Slide+2',
    'https://via.placeholder.com/800x100.png?text=Slide+3',
  ];
  return(
    <>
      <header>
        <CustomCarousel images={images}/>
      </header>
    </>
  );
}