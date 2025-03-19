import React, { useState } from "react";
//import framer motion
import { motion } from "framer-motion";

//import toastify to help with creating pop up notifications
import { Slide, ToastContainer, toast } from "react-toastify";

//import the database so that it can be accessed through addDoc
import { db } from "../config/firebase";

//import addDoc function to add the completed tasks to the collection in the database
import { addDoc, collection } from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../config/firebase";

//? Create an interface for the tasks added to the list
interface Tasks {
  index: number;
  text: string;
  complete: boolean; //! Made optional so, add back later to help with compiling the completed task into a list
  userId?: string | null;
  DocId?: string | undefined; //should just be a string so to make sure that each task has their own unique ID
  //postID is added on after the task is added getting added to the database
}

//Create a reference to store the connection to the database
const todoRef = collection(db, "completed-collection");

//! pass a prop inside that i can use to add into one of the functions to add the task to the database
export const CenterBox = () => {
  //Create useAuthState to manage the user information on this page
  const [user] = useAuthState(auth);

  //store the documents that I grab from the server:

  //create a useState to store the value from the input bar
  const [getTask, setGetTask] = useState<string>("");

  //create another useState to place the inputs in an array to be displayed one by one
  const [storedTasks, setStoredTask] = useState<Tasks[]>([]); // The interface is set as the parameter of the array that will be stored
  //useState<Tasks[]>([]) reminds it as an interface array and stores an empty array

  //create a counter to keep track of the index
  const [indexNumber, setIndexNumber] = useState<number>(1);

  //Task interface has the tasks and completed that are stored in each iteration, since they have the same parameters

  //create a variable to handle the maximum 7 of tasks
  const MaxTasks: number = 7;

  //create a function that stores the data from the input into the state
  const retrieveTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGetTask(event.target.value);
  };

  //Create a delete tasks button
  const deleteTasks = (index?: number) => {
    setStoredTask(storedTasks.filter((tasks) => tasks.index !== index));
  };

  //create function to store the getTask in:
  const storeAllTasks = () => {
    // (This is placed at the top as the first thing to check off the checklist after that the rest of the code can run)

    // If the length of the list is greater than 7, then prevent the user from continuing
    if (storedTasks.length >= MaxTasks) {
      //clear the task first:
      setGetTask("");
      //alert the user to finish the rest of what they have to do first before adding more
      alert("Finish the tasks that you have started first before continuing");
      return;
    }
    //activate the function when the button is clicked
    //make an if statement that tracks if the input field is not empty, if not, then we add it to the array
    if (getTask.trim() !== "") {
      //? Create the object that houses all the parameters for the data that I'll use
      const newTask: Tasks = {
        // The Task interface is passed to the object so that errors will be raised if the required fields aren't met
        index: indexNumber, //pass a usedState that will increment when a new task is created
        text: getTask, // pass the text from the useState to be stored in the text parameter
        complete: false, // set to false by default within the object will be changed individually later on
        userId: user?.uid,
      };

      //add the task object to the empty array
      setStoredTask([...storedTasks, newTask]);

      //clear the input state so that the input field is cleared:
      setGetTask("");

      //increase the count on the indexU
      setIndexNumber(indexNumber + 1);
    } else {
      //alert the user that the input is empty if they want to add
      alert("Please enter a task...");
    }
  };

  //Create a function to handle if the enter key is pressed
  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //This is placed at the top as the first thing to check off the checklist after so the rest of the code can run
    if (storedTasks.length >= MaxTasks) {
      //clear the input
      setGetTask("");
      //alert the user to finish the first few tasks that they assigned themselves to do:
      alert("Finish the tasks that you have started first before continuing");
      return;
    }
    //if the enter key is pressed and the input is not empty, add the item to the list
    if (event.key === "Enter" && getTask.trim() !== "") {
      //? Create the object that houses all the parameters for the data that I'll use
      const newTask: Tasks = {
        // The Task interface is passed to the object so that errors will be raised if the required fields aren't met
        index: indexNumber, //pass a usedState that will increment when a new task is created
        text: getTask, // pass the text from the useState to be stored in the text parameter
        complete: false, // set to false by default within the object will be changed individually later on
        userId: user?.uid,
      };

      //add the object to the empty array
      setStoredTask([...storedTasks, newTask]);

      //reset the input of the task:
      setGetTask("");

      //increase the count on the indexU
      setIndexNumber(indexNumber + 1);
    }

    if (event.key === "Enter" && getTask.trim() === "") {
      alert("Please enter a task before we can continue");
    }
  };

  //add a counter to keep track of the indexes that are added to the complete list to display how many tasks were completed (might use a database instead)

  // Create a function to add completed tasks an array
  const addCompleteTask = async (taskId: number) => {
    //try to execute adding the data to the collection on firebase:
    try {
      // The taskID is essential when it comes to comparing one id from another list to the completed list
      const taskIndex = storedTasks.findIndex((task) => task.index === taskId); //use the object in findIndex, searches through the array to see if each task index matches the taskId

      //if the index of the task is found, then execute this function:
      if (taskIndex !== -1) {
        //if the task id is found in the array then
        const taskToComplete = storedTasks[taskIndex]; //search the stored tasks using the index that is found in the
        //stores the object inside the variable

        //update the list by filtering based on all the tasks that's id wasn't equal to the index:
        const updatedTodoList = storedTasks.filter(
          (task) => task.index !== taskId
        ); //stores all the items from this list into the new updated list
        //removes the task that ID matches the index from the list

        setStoredTask(updatedTodoList); // store all the items from the updated list into the stored tasks list so that it can be displayed
        //refreshes the task list once the list has been filtered

        //update complete to true so that it saves in the database
        taskToComplete.complete = true; //set the index of the task to complete to true

        //when a new task is added, make sure that postID of the task is also saved as part of the doc.

        console.log("The completed task is : ", taskToComplete); // test to see the elements of the task being added

        //create an auto generated document for each task

        // pass the taskToComplete object pieces into the addDoc function to be passed into the database:
        await addDoc(todoRef, {
          //pass the document ID to the database
          ...taskToComplete,

          //add a new attribute to the task being sent to the database, make postId able to help w tracking each post differently
          //passes all the parts of the object inside the task to complete into the add document function
        }); // connects to the todo reference I made using the collection method

        //increment the completed task by one so that the index is increased each time it's added to the database

        //Make the notification pop up at the top of the page after a task is completed
        toast.success("You Completed A Task", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });

        //console.log what was added to the list:
        console.log(
          "The tasks that was added to the completed list are : ",
          taskToComplete
        );
      }
      //catch the error that happened if the data can't be added:
    } catch (error) {
      //log the error that was found
      console.log("The error in the code is : ", error);

      //send the notification to toastify when an error occurs adding the object in the array to the database
      toast.error(
        "Unfortunately, there was an error adding the task to the database",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  //create a function to delete the completed tasks from the completed list :

  //create a function to delete the tasks from the database on firebase :
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <motion.div
        initial={{ scale: 0.9, y: 100, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{
          stiffness: 45,
          damping: 9.5,
          type: "spring",
          bounce: 0.78,
          duration: 0.04,
        }}
        className="flex flex-col z-[-2]"
      >
        <div className="flex flex-col justify-center items-center bg-[#3D3D3D] w-[550px] h-auto pt-[15px] rounded-[25px] pb-[5px]">
          <div className="flex justify-center items-center mb-[-10px]">
            <input
              className="bg-[#a2a2a2] text-black rounded-4xl w-[450px] h-10 text-center font-black mr-[10px] font-[inter] focus:outline-none "
              type="text"
              placeholder="Add task..."
              onChange={retrieveTask}
              onKeyDown={handleEnter}
              //set value to the useState that stores the input that is entered, that way i can clear it later:
              value={getTask}
            />
            <motion.button
              initial={false}
              transition={{ damping: 20, type: "spring", duration: 0.4 }}
              whileTap={{ scale: 0.85 }}
              className="h-10 rounded-4xl flex justify-center items-center font-bold w-10 focus:outline-none text-white bg-[#2F2F2F] text-[1.4rem] "
              onClick={storeAllTasks}
            >
              +
            </motion.button>
          </div>

          <div className="text-white mt-[24px]">
            {storedTasks.map((tasks) => (
              <div className="">
                <li
                  className="flex justify-center items-center list-none h-[40px] w-[500px] bg-[#252525] mt-[5px] rounded-[18px] font-bold mb-[8px] relative"
                  key={tasks.index}
                >
                  {tasks.text}
                  <button
                    className="absolute right-1 w-[30px] h-[30px] flex justify-center items-center rounded-[30px] bg-[#131313] hover:bg-[#1c1b1b]"
                    onClick={() => deleteTasks(tasks.index)} // pass the index that
                  >
                    x
                  </button>
                  <button
                    onClick={() => addCompleteTask(tasks.index)}
                    className="flex justify-center items-center rounded-[30px] absolute right-10 w-[30px] h-[30px] bg-[#131313] hover:bg-[#1c1b1b]"
                  >
                    ✓
                  </button>
                </li>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
