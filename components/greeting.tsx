import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const name = 'FenglinGPT';
const proposition = `${name}`;

const greeting: Array<{
  first: string;
  second: string;
}> = [
  { first: 'Forgot the OSI Model again?', second: `Ask ${proposition}` },
  {
    first: 'Cramming for your assignments?',
    second: `Let ${proposition} help`,
  },
  {
    first: 'Struggling with that weird quantisation graph?',
    second: `Ask ${proposition}`,
  },
  {
    first: 'Crying over polynomial division?',
    second: `Let ${proposition} soak up your tears`,
  },
  { first: 'How does multi-casting work again?', second: `Ask ${proposition}` },
  {
    first: 'Forgot to study for your quiz?',
    second: `Let ${proposition} help`,
  },
  {
    first: "Don't understand CRC?",
    second: `Ask ${proposition}`,
  },
  {
    first: 'Regret not attending the workshops?',
    second: `Let ${proposition} help`,
  },
  {
    first: "Didn't pay attention during the lecture?",
    second: `Let ${proposition} help`,
  },
];

export const Greeting = () => {
  const [selectedGreeting, setSelectedGreeting] = useState<
    (typeof greeting)[number]
  >(greeting[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greeting.length);
    setSelectedGreeting(greeting[randomIndex]);
  }, []);

  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-semibold"
      >
        {selectedGreeting.first}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-zinc-500"
      >
        {selectedGreeting.second}
      </motion.div>
    </div>
  );
};
