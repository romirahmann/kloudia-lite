/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../store/ThemeContext";
import { MdOutlineDarkMode, MdOutlineWbSunny } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "../store/AuthContext";
export function Topbar({ userData }) {
  const [profilIsOpen, setProfilIsOpen] = useState(false);
  const { theme, toggleTheme } = useDarkMode();
  const useRefProfil = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        useRefProfil.current &&
        !useRefProfil.current.contains(event.target)
      ) {
        setProfilIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <div className="max-w-full bg-[#3674B5] dark:bg-gray-900 py-2 px-4 ">
        <div className="contentTopBar flex justify-between">
          <div className="brand flex gap-2 items-center">
            <img src="/icons/folder.png" className="w-[3em]" alt="" />
            <div>
              <h1 className="text-2xl font-bold text-[#FADA7A]">
                KLOUDIA LITE
              </h1>
              <h3 className="text-sm text-[#F5F0CD]">
                Document Accounting & Finance
              </h3>
            </div>
          </div>
          <div className="profilIcon ms-auto flex items-center">
            <button
              onClick={toggleTheme}
              className="darkMode px-2 py-2 border border-white text-white dark:text-[#FADA7A] dark:border-[#FADA7A] rounded-md mx-5 text-xl"
            >
              {theme === "dark" ? <MdOutlineDarkMode /> : <MdOutlineWbSunny />}
            </button>
            <button
              onClick={() => setProfilIsOpen(!profilIsOpen)}
              className="text-3xl lg:text-4xl text-white dark:text-[#FADA7A]"
            >
              <FaRegUserCircle />
            </button>
          </div>

          {profilIsOpen && (
            <div
              ref={useRefProfil}
              className={`absolute cardProfil top-12 right-12 px-6 py-2 rounded-md shadow-xl bg-gray-50 dark:bg-gray-100 z-20`}
            >
              <div className="detail-profil my-5">
                <h1 className="text-md font-bold uppercase ">
                  {userData?.username}
                </h1>
                <h3 className="text-sm uppercase">{userData?.roleName}</h3>
              </div>
              <hr className="my-2" />
              <button
                onClick={() => handleLogout()}
                className="flex text-center items-center gap-1 rounded-md "
              >
                <HiOutlineLogout />
                <span className="">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
