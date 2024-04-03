import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { useStateContext } from '../context';
import { metamask } from '../assets';
import { navlinks } from '../constants';
import { Flower, Menu, Moon, Sun, } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address, theme, toggleTheme } = useStateContext();

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className=' w-full flex justify-between' >
        <div className='sm:flex hidden' >
          <h1 className="text-[24px] font-bold text-custom-primary text-left">SmartFundRaise</h1>
        </div>
        <div className="sm:flex hidden flex-row justify-end gap-4">

          <Button
            className={"bg-custom-primary hover:bg-custom-primary-dark text-white"}
            onClick={() => navigate('create-campaign')}
          >
            Create Campaign
          </Button>

          <Button
            onClick={() => {
              if (!address) connect()
            }}
            variant="outlined"
            className="bg-white dark:bg-[#2c2f32] text-custom-primary dark:text-white border-custom-primary dark:border-custom-primary"
          >
            <img
              src={metamask}
              alt="user"
              className="w-[24px] h-[24px] object-contain mr-4"
            />
            {address ?
              <span>{address.slice(0, 5) + "..." + address.slice(-3)}</span>
              : <span>Connect</span>
            }
          </Button>
        </div>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] dark:bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <Flower className="text-custom-primary" size={45} />
        </div>
        <h1 className="text-[24px] font-bold text-custom-primary">SmartFundRaise</h1>

        <Menu
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div className={`absolute top-[60px] right-0 left-0 bg-white dark:bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex cursor-pointer p-4 ${isActive === link.name && 'bg-[#f0f2f5] dark:bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <link.ImgUrl
                  className={`w-[24px] h-[24px] text-custom-primary object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                />
                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-custom-primary' : 'text-[#808191]'}`}>
                  {link.name}
                </p>
              </li>
            ))}
            <li
              className={`flex cursor-pointer p-4`}
              onClick={toggleTheme}
            >
              {theme === 'light' ?
                <>
                  <Moon className={`grayscale w-[24px] h-[24px]`} />
                  <p className='ml-[20px] font-epilogue font-semibold text-[14px] text-[#808191]'>Toggle Theme</p>
                </>
                :
                <>
                  <Sun className={`grayscale w-[24px] h-[24px]`} />
                  <p className='ml-[20px] font-epilogue font-semibold text-[14px] text-[#808191]'>Toggle Theme</p>
                </>
              }
            </li>
          </ul>

          <div className="flex mx-4">
            <Button
              onClick={() => {
                if (!address) connect()
              }}
              variant="outlined"
              className=" dark:bg-[#2c2f32] bg-secondary text-custom-primary dark:text-white border-custom-primary dark:border-custom-primary"
            >
              <img
                src={metamask}
                alt="user"
                className="w-[24px] h-[24px] object-contain mr-4"
              />
              {address ?
                <span>{address.slice(0, 5) + "..." + address.slice(-3)}</span>
                : <span>Connect</span>
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar