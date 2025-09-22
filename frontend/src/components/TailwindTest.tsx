import React from 'react';

export const TailwindTest: React.FC = () => {
  return (
    <div className="p-8 bg-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-4">Tailwind CSS Test</h1>
      <p className="text-lg">If you can see blue background and white text, Tailwind is working!</p>
      <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Test Button
      </button>
    </div>
  );
};
