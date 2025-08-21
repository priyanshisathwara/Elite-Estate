import React from "react";
import "./Experience.css";

const experiences = [
  {
    id: 1,
    title: "Legacy Lives On ",
    description: "Where history lives through ancient walls.",
    location: "Junagadh Fort, Gujarat",
    image: "/src/assets/historical.jpg",
  },
  {
    id: 2,
    title: "Mountain Hiking Adventure",
    description: "Explore scenic trails and witness breathtaking views.",
    location: "Girnar, Gujarat",
    image: "/src/assets/hik.jpeg",
  },
  {
    id: 3,
    title: "Endless Journey",
    description: "Freedom rides along every curve and turn.",
    location: "Saputara Hills, Gujarat",
    image: "/src/assets/Road-trip.jpg",
  },
  {
    id: 4,
    title: "Backwater Boat Tour",
    description: "Relax and cruise through the tranquil backwaters.",
    location: "Alleppey, India",
    image: "/src/assets/forest.jpg",
  },
];

const Experience = () => {
  return (
    <div className="experience-page">
      <h2 className="experience-title">Unique Experiences</h2>
      <p className="experience-subtitle">
        Discover memorable activities hosted by local experts.
      </p>

      <div className="experience-grid">
        {experiences.map((exp) => (
          <div key={exp.id} className="experience-card">
            <img src={exp.image} alt={exp.title} className="experience-image" />
            <div className="experience-content">
              <h3>{exp.title}</h3>
              <p>{exp.description}</p>
              <span className="experience-location">{exp.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
