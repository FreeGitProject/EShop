import { useState } from "react";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
export default function Carousel({ slides }) {
  let [current, setCurrent] = useState(0);

  let previousSlide = () => {
    if (current === 0) setCurrent(slides.length - 1);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === slides.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  return (
    <div className="overflow-hidden relative">
      <div
        className={`flex transition ease-out duration-40`}
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((s) => {
          return <img src={s} />;
        })}
      </div>
      {/* Hero body Content */}
      <div
        className={`absolute top-0 left-0 h-full w-full flex items-center ${styles.section}`}
      >
        <div
          className={`${styles.section} w-full sm:w-[90%] md:w-[80%] lg:w-[90%] xl:w-[80%] 2xl:w-[70%] min-w-[350px] mx-auto`}
        >
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl text-[#3d3a3a] font-semibold capitalize leading-tight">
            Best Collection for <br /> home Decoration
          </h1>
          <p className="pt-5 text-sm sm:text-base md:text-sm lg:text-lg xl:text-xl font-[Poppins] font-normal text-[#000000ba] leading-relaxed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
            assumenda? Quisquam itaque <br /> exercitationem labore vel, dolore
            quidem asperiores, laudantium temporibus soluta optio consequatur{" "}
            <br /> aliquam deserunt officia. Dolorum saepe nulla provident.
          </p>
          <Link to="/products" className="inline-block">
            <div
              className={`${styles.button} mt-5 lg:w-[150px] lg:h-[50px] md:w-[120px] md:h-[40px] sm:w-[100px] sm:h-[30px]`}
            >
              <span
                className="text-white font-[Poppins] text-base md:text-base lg:text-lg xl:text-xl"
                style={{ zIndex: 1 }}
              >
                Shop Now
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl">
        <button onClick={previousSlide}>
          <BsFillArrowLeftCircleFill />
        </button>
        <button onClick={nextSlide}>
          <BsFillArrowRightCircleFill />
        </button>
      </div>

      <div className="absolute bottom-0 py-4 flex justify-center gap-3 w-full">
        {slides.map((s, i) => {
          return (
            <div
              onClick={() => {
                setCurrent(i);
              }}
              key={"circle" + i}
              className={`rounded-full w-5 h-5 cursor-pointer  ${
                i == current ? "bg-white" : "bg-gray-500"
              }`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
