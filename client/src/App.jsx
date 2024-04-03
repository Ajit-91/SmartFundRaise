import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { Sidebar, Navbar, Loader } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile } from './pages';
import { useStateContext } from './context';

const App = () => {
  const { isLoading } = useStateContext();
  return (
    <div className="relative sm:-8 p-4 bg-[#f0f2f5] dark:bg-[#13131a] min-h-screen flex flex-row">
      {isLoading && <Loader />}
      <Toaster swipeDirection="up" />
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
        </Routes>
      </div>
    </div>
  )
}

export default App