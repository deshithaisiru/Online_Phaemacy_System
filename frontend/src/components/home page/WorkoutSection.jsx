import React from "react";

const workouts = [
  {
    name: "Running",
    description: "Boost cardiovascular health and burn calories.",
    img: "https://images.pexels.com/photos/5961849/pexels-photo-5961849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Replace with real URLs or local images
  },
  {
    name: "Strength Training",
    description: "Build lean muscle and everyday strength.",
    img: "https://via.placeholder.com/300x200",
  },
  {
    name: "Yoga",
    description: "Increase flexibility, balance, and focus.",
    img: "https://via.placeholder.com/300x200",
  },
  {
    name: "Stretching",
    description: "Improve mobility and prevent injury.",
    img: "https://via.placeholder.com/300x200",
  },
  {
    name: "Pilates",
    description: "Tone your core and improve posture.",
    img: "https://via.placeholder.com/300x200",
  },
  {
    name: "Bodyweight Exercises",
    description: "Strengthen your body without equipment.",
    img: "https://via.placeholder.com/300x200",
  },
];

const WorkoutSection = () => {
  return (
    <div className="py-12 px-4 lg:px-20 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-center mb-8">
        Discover the Benefits of Different Workouts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {workouts.map((workout, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
          >
            <img
              src={workout.img}
              alt={workout.name}
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
            <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
            <p className="text-gray-300">{workout.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutSection;
