import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navlinks } from '../constants';
import { useStateContext } from '../context';
import { Flower, Moon , Sun, } from 'lucide-react';

const Icon = ({ styles, name, ImgUrl, isActive, disabled, handleClick }) => (
  <div 
    className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && 'bg-[#f0f2f5] dark:bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} 
    onClick={handleClick}
  >
    <ImgUrl className={`text-custom-primary w-1/2 h-1/2' ${isActive !== name && 'grayscale'}`} />
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const { toggleTheme, theme } = useStateContext();

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        {/* <Icon styles="w-[52px] h-[52px] bg-[#f0f2f5] dark:bg-[#2c2f32]" imgUrl={logo} /> */}
        <Flower className='text-custom-primary' size={45} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#ffffff] dark:bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon 
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if(!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        <Icon 
          handleClick={() => toggleTheme()}
          ImgUrl={theme === "light" ? Moon : Sun} 
        />
      </div>
    </div>
  )
}

export default Sidebar