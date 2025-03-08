import { useState } from "react";
//import framer motion
import { motion } from "framer-motion";

//? Create an interface for the tasks added to the list
interface Tasks {
  index: number;
  text: string;
  complete?: boolean; //! Made optional so, add back later to help with compiling the completed task into a list
}

export const CenterBox = () => {
  //^create a useState to store the value from the input bar
  const [getTask, setGetTask] = useState<string>("");

  //^create another useState to place the inputs in an array to be displayed one by one
  const [storedTasks, setStoredTask] = useState<Tasks[]>([]); // The interface is set as the parameter of the array that will be stored
  //useState<Tasks[]>([]) reminds it as an interface array and stores an empty array

  //^create a counter to keep track of the index
  const [indexNumber, setIndexNumber] = useState<number>(1);

  //^create a state to keep track of the if the length of the task list so it can adjust the padding top:

  //^create a useState to update the boolean of the when a task is set to true
  //^const [complete, setComplete] = useState<boolean>(false); //set to false by default

  //^create a variable to handle the maximum amount of tasks
  const MaxTasks: number = 7;

  //^create a funciton that stores the data from the input into the state
  const retrieveTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGetTask(event.target.value);
  };

  //^Create a delete tasks button
  const deleteTasks = (index: number) => {
    setStoredTask(storedTasks.filter((tasks) => tasks.index !== index));
  };

  //^create function to store the getTask in:
  const storeAllTasks = () => {
    //^This is placed at the top as the first thing to check off the checklist after that the rest of the code can run
    if (storedTasks.length >= MaxTasks) {
      alert("Finish the tasks that you have started first before continuing");
      return;
    }
    //^activate the function when the button is clicked
    //^make an if statement that tracks if the input field is not empty, if not then we add it to the array
    if (getTask.trim() !== "") {
      //? Create the object that houses all the parameters for the data that i'll use
      const newTask: Tasks = {
        //^ Task interface is passed to the object so that errors will be raised if the required fields aren't met
        index: indexNumber, //pass a usedState that will icrement when the a new task is created
        text: getTask, // pass the text from the useState to be stored in the text parameter
        //!complete: complete, // useState that changes for when the tasks are completed
      };

      //^add the object to the empty array
      setStoredTask([...storedTasks, newTask]);

      //^increase the count on the indexU
      setIndexNumber(indexNumber + 1);
    } else {
      //^alert the user that the input is empty if they want to add
      alert("Please enter a task...");
    }
    //^reset the input field
    setGetTask("");
  };

  //^Create a function to handle if a specific key is pressed and add an item to the list
  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //This is placed at the top as the first thing to check off the checklist after that the rest of the code can run
    if (storedTasks.length >= MaxTasks) {
      alert("Finish the tasks that you have started first before continuing");
      return;
    }
    //^if the enter key is pressedand the input is not empty then add the item to the list
    if (event.key === "Enter" && getTask.trim() !== "") {
      //? Create the object that houses all the parameters for the data that i'll use
      const newTask: Tasks = {
        //^ Task interface is passed to the object so that errors will be raised if the required fields aren't met
        index: indexNumber, //pass a usedState that will icrement when the a new task is created
        text: getTask, // pass the text from the useState to be stored in the text parameter
        //!complete: complete, // useState that changes for when the tasks are completed
      };

      //^add the object to the empty array
      setStoredTask([...storedTasks, newTask]);

      //^increase the count on the indexU
      setIndexNumber(indexNumber + 1);
    }

    if (event.key === "Enter" && getTask.trim() === "") {
      alert("Please enter a task before we can continue");
    }
    //^reset the input field
    setGetTask("");
  };

  //? const paddingStyle = {
  //?   paddingTop: paddingChange ? "50px" : "20px",
  //? };

  return (
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
      className="flex flex-col"
    >
      <div className="flex flex-col justify-center items-center bg-[#3D3D3D] w-[550px] h-auto pt-[15px] rounded-[25px] pb-[5px]">
        <div className="flex justify-center items-center mb-[-10px]">
          <input
            className="bg-[#a2a2a2] text-black rounded-4xl w-[450px] h-10 text-center font-black mr-[10px] font-[inter] focus:outline-none "
            type="text"
            placeholder="Add task..."
            onChange={retrieveTask}
            onKeyDown={handleEnter}
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
                <button className="flex justify-center items-center rounded-[30px] absolute right-10 w-[30px] h-[30px] bg-[#131313] hover:bg-[#1c1b1b]">
                  ✓
                </button>
              </li>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
