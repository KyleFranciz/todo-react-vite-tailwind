import React from "react";
import { motion } from "framer-motion";

//create the interface to house the parameters of th prop
interface WelcomeTextFace {
  text: string | null; // make sure that if I wanted to add user.display name, that I can add it in
  delayMulti: number;
}

export const WelcomeText: React.FC<WelcomeTextFace> = ({
  text,
  delayMulti,
}) => {
  //split the text that is passed in, into separate letters
  const individualLetters = text?.split("");
  return (
    <div className="z-[-1]">
      <h1 className="h-[65px]">
        {/*Use the map function to map through split text and handle each one by one */}
        {individualLetters?.map((letter, index) => (
          <motion.span
            className="inline-block mr-[0.4px] hover:cursor-pointer"
            key={index}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: index * delayMulti,
              type: "spring",
              stiffness: 1000,
              damping: 30,
              staggerChildren: 0.1,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </h1>
    </div>
  );
};
