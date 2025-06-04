import { Link, Outlet } from "react-router-dom";

const Settings = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen w-screen">
      <div className="bg-white flex flex-col h-[75%] w-[75%] rounded-lg shadow-md">
        <div className="text-4xl font-semibold p-4">Settings</div>
        {/* Divider */}
        <div className="w-full h-px bg-black"></div>
        {/* Content */}
        <div className="flex h-full">
          <div className="w-1/4">
            <div className="flex flex-col gap-2 p-4">
              <Link to="/settings/profile">
                <button className="text-lg w-full font-semibold hover:bg-amber-200 rounded-md cursor-pointer p-2 hover:scale-105 transition-all duration-300">
                  Profile
                </button>
              </Link>
              <Link to="/settings/data">
                <button className="text-lg w-full font-semibold hover:bg-amber-200 rounded-md cursor-pointer p-2 hover:scale-105 transition-all duration-300">
                  Data
                </button>
              </Link>
              <Link to="/settings/security">
                <button className="text-lg w-full font-semibold hover:bg-amber-200 rounded-md cursor-pointer p-2 hover:scale-105 transition-all duration-300">
                  Security
                </button>
              </Link>
              <Link to="/settings/integrations">
                <button className="text-lg w-full font-semibold hover:bg-amber-200 rounded-md cursor-pointer p-2 hover:scale-105 transition-all duration-300">
                  Integrations
                </button>
              </Link>
            </div>
          </div>
          {/* Divider */}
          <div className="w-px h-full bg-black"></div>
          {/* Right */}
          <div className="w-3/4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
