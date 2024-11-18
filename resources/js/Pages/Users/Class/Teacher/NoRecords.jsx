import React from 'react';
import { Avatar } from '@nextui-org/react';
import { motion } from 'framer-motion';

const NoRecords = () => {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-200 to-pink-300">
      <div className="text-center px-4 py-12 md:py-24">
        <motion.div
          className="mt-6 mx-auto"
          animate={{ scale: 1.1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <Avatar
            src="/images/img3.png"
            alt="No tasks assigned"
            size="lg"
            style={{
              width: '15vw',
              height: '15vw',
              boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.2)',
            }}
          />
        </motion.div>
        <h2 className="mt-8 text-3xl font-semibold text-gray-800">No projects assigned yet</h2>
        <p className="text-lg mt-4 text-gray-600">Ready to take on a challenge? Create your first project and start your journey!</p>
        <div className="mt-8">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition duration-300"
            onClick={() => window.location.href = '/create-project'} // Replace with actual URL for creating project
          >
            Create First Project
          </button>
        </div>
      </div>
    </section>
  );
};

export default NoRecords;
