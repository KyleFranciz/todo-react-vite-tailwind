//Creating a navabar

import { useState } from "react";

//import Framer motion div for the animations on the page
import { motion } from "framer-motion";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { LoginUser } from "../functions/login";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
//!import { useGoDestination } from "../functions/login"; (work on this hook the it causes glitches when redirection on login/logout)

export const Navbar: React.FC = () => {
  //Create a function that displays a menu
  const [isClicked, setIsClicked] = useState<boolean>(false);

  //create useState to change
  const [motionNumber, setMotionNumber] = useState<number>(-300);

  //Create a useState that keeps track of if the sidebar is open:
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  //create useNavigate to be able to route to the desired link
  const navigate = useNavigate();

  //? useEffect(() => {
  //?   localStorage.setItem("sidebarState", "false"); //create Json object to store the sidebarState as false by default oppon initial load
  //? }, []);

  //Create a function to check the local storage to check to for if the sidebar is open
  //? useEffect(() => {
  //?   const storedState = localStorage.getItem("sidebarState"); // tries to find if there is a saved state for the sidebarState , gets set to null if there is none
  //?   if (storedState !== null) {
  //?     //if the storedState is not null then:
  //?     setSidebarOpen(JSON.parse(storedState)); // search local storage for for the state and sets the stored state to the saved false state by default
  //?   }
  //? }, []);

  //Create another function to save the sidebar state to the local storage when it changes, whenever the sidebarOpen is triggerd using the use effect
  //? useEffect(() => {
  //?   localStorage.setItem("sidebarState", JSON.stringify(sidebarOpen));
  //? }, [sidebarOpen]);

  //Imported Login function i made from login.ts file
  //Made a function that gives access to the user
  const RouteAccess = async () => {
    //make the async await function
    await LoginUser(); // wait for the user to login
    navigate("/todo"); //then redirect to do app
  };

  //Made function that logs out the user
  const logoutUserNow = async () => {
    await signOut(auth);
    navigate("/");
  };

  const [user] = useAuthState(auth);

  //create an object that stores the data for the sidebar
  const SidebarText = [
    { id: 1, icons: "", text: "Home", link: "/" },
    { id: 2, icons: "", text: "Tasks", link: "/todo" },
    { id: 3, icons: "", text: "Completed", link: "/completed" },
    { id: 4, icons: "", text: "About", link: "" },
  ];

  //create a funciton that switches the state of is clicked to true
  const ToggleSidebar = () => {
    setIsClicked(!isClicked);
    if (isClicked) {
      setMotionNumber(0); //changes the number of the motion.div to slide if it is true
      setSidebarOpen(!sidebarOpen); //sets the isSidebarOpen variable to true so that i can log it
      //console.log(sidebarOpen); //logged for debugging
    } else {
      setMotionNumber(-300); //changes the number of the motion.div to slide if it is true
      setSidebarOpen(!sidebarOpen); //sets the isSidebarOpen variable to false so that i can log it
      //console.log(sidebarOpen); //logged for debugging
    }
  };

  return (
    <div className="flex  w-full items-center justify-between top-0 left-0 right-0 fixed h-14 z-[20]">
      <div className="">
        {/*Menu Icon for Sidebar Trigger */}
        {/*CHANGE MENU ICON TO SVG !!! */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          initial={{ y: -100, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{
            duration: 4,
            damping: 15,
            type: "spring",
            stiffness: 100,
          }}
        >
          <img
            src="/src/images/icons/Icon.png"
            alt=""
            className="h-6 translate-x-[10px] space-x-4 hover:cursor-pointer relative z-10"
            onClick={ToggleSidebar}
          />
        </motion.div>

        {/*Sidebar animations and components */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: motionNumber }}
          transition={{ duration: 0.4, bounce: 0, type: "spring" }}
          className="flex absolute h-[100vh] w-[300px] bg-[#3D3D3D] z-[-10] top-0"
        >
          <ul className="flex mt-[100px] flex-col h-fit w-full bg-[#3D3D3D] ">
            {SidebarText.map((menuItems) => (
              <li className="w-full pt-[20px] pb-[20px] list-none  hover:bg-[#292929] cursor-pointer">
                <a
                  className="text-white font-[inter] font-medium  text-[1.1rem]"
                  href={menuItems.link}
                >
                  {menuItems.text}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
        {/*Add Settings and Logout */}
      </div>
      {/*Main Logo for the website */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 hover:cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.91 }}
        initial={{ y: -100, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{
          bounce: 1,
          duration: 4,
          damping: 15,
          type: "spring",
          stiffness: 100,
        }}
      >
        <img
          src="/src/images/logo/FOCUS CENTER..png"
          alt=""
          className="h-10 "
        />
      </motion.div>

      {/*WORK ON THE POSITIONING OF LOGIN/LOGOUT BUTTON UPPON SIGN IN & SIGN OUT*/}
      <div className=" flex justify-between items-center space-x-4 translate-x-[-8px] ">
        {user ? (
          <>
            <motion.div
              initial={{ scale: 0.35, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                bounce: 0.22,
                stiffness: 200,
                damping: 25,
                type: "spring",
              }}
              whileHover={{ scale: 1.1 }}
            >
              {/*Icon for the user */}
              <img
                className="w-[38px] h-[38px] rounded-[30px] translate-x-[10px] inline-block hover:cursor-pointer"
                src={user?.photoURL || ""}
                alt=""
                //add an onClick button that takes makes a div pop up that displays all the completed tasks when clicked
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              initial={{ y: -100, scale: 0.8, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{
                duration: 4,
                damping: 15,
                type: "spring",
                stiffness: 100,
              }}
              className="h-[35px] w-[100px] font-inter font-bold rounded-[5px] bg-black text-white"
              onClick={logoutUserNow}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            initial={{ y: -100, scale: 0.8, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{
              duration: 4,
              damping: 15,
              type: "spring",
              stiffness: 100,
            }}
            className="h-[35px] w-[100px] font-inter font-bold rounded-[5px] bg-black text-white"
            onClick={RouteAccess}
          >
            Login
          </motion.button>
        )}
      </div>
    </div>
  );
};
