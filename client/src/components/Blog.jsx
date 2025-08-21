import React from 'react'
import './Blog.css';

const Blog = () => {
    return (
        <>
            <div className="blog-container">
                <div className="blog-row-container">
                    <div className="blog-column-container">
                        <div className="places-to-vistied">
                            <div className="blog-left-container">
                                <img src="/src/assets/historical.jpg" alt="img1" />
                            </div>
                            <div className="blog-right-container">
                                <h3>Best Historical places to Vistied</h3>
                                <p>Visiting historical places is like stepping into a time machine that takes you back to the soul of civilization.</p>
                                <p>Why read about history when you can walk through it?</p>
                                <p>Explore the best historical monuments!</p>

                            </div>
                        </div>
                    </div>
                    <div className="blog-column-container">
                        <div className="blog-beach">
                        <img src="/src/assets/beach-side.jpg" alt="img1" />
                        <div className="bolg-card-content">
                             <h3>Escape to where the ocean meets the sky—adventure awaits!</h3>
                            <p>Exploring the beach is one of the most refreshing and exciting experiences you can have. The sound of the waves, the feeling of soft sand under your feet, and the fresh ocean breeze instantly bring a sense of peace and relaxation. Whether you want to take a calming walk along the shore, watch the breathtaking sunset, or dive into the refreshing water, the beach offers something for everyone.</p>
                        </div>
                        </div>
                   
                        <div className="blog-beach">
                        <img src="/src/assets/mountain.jpg" alt="img1" />
                        <div className="bolg-card-content">
                             <h3>Escape to the mountains, where adventure meets tranquility and every summit brings a new perspective.</h3>
                             <p>Visiting mountain destinations offers a unique experience that blends adventure, tranquility, and natural beauty. The majestic peaks, crisp air, and scenic views are not just refreshing but also provide a sense of awe. Mountains give you the opportunity to disconnect from the everyday hustle and immerse yourself in nature. Whether you're an avid hiker, skier, or simply someone looking to relax in a peaceful environment, mountains offer something for everyone.</p>

                        </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Blog;
