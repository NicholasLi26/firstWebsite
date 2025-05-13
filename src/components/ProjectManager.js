import React, { useState } from 'react';
import Project from './Project.js';
import '../css/ProjectManager.css';

const palander = {
    title: "Palander",
    languages: "Python",
    libraries: "OpenCV, Streamlit, Numpy, ask_gemini ",
    outcomes: "Averaged around a 10 second execution time per week for each image uploaded for schedule parsing. This includes the calls to gemeni API and final output in google calander. ",
    description: "Palander was made as a hackathon project for the 2025 QHacks hackathon. It automatically took an uploaded schedule, and along with inputted user data like sleep times and study hours, customized your schedule with study times and automatically uploaded it to google calander. "+
    "It was designed to allow users to uploade their schedule as a .png or .jpg file. This file was parsed into days using OpenCV, " +
    "which was then sent to Google gemini's LLM for data extraction. Said data was then managed within python, which handled it to an hourly basis. " +
    "Because of this, it was able to manage schedules down to the day number and hour, and allowed for up to a whole year of cusomized schedule tracking. " +
    "Other features were added, such as allowing users to set undisturbed wake up hours, special activities, sleep-in times and daily sleep hours, "+
    "all of which are taken into account when generating the schedule. This project, being extremely ambitious, wasn't finished in it's entirety during "+
    "the hackathon, but was finished afterwards. Even so, it was a new challange and a practical solution to a real-world problem that I often face. " 
};

const quSolver = {
    title: "Queens Solver",
    languages: "Java",
    libraries: "Swing",
    outcomes:"Regular solve times anywhere between 5ms to 20ms per board, with up to a 10x10 board size. ",
    description:"Created a graphical puzzle solver for the logic game 'Queens' that can be found on LinkedIn. It was made as a passion project "+
    "to help me get the fastest possible solve times, in the process helping me get better at the game itself. It turned out extremely well, with solve times "
    +"being under 30ms on all cases run. It uses basic constraint satisfaction algorithms with no backtracking, with board modification as it progresses. "+
    "Though missing a few checks for the more extreme boards, it is extremely modular and supports adding additional checks."
}

const project = {
    title: "Project",
    languages: "Languages",
    libraries: "Libraries",
    outcomes: "Outcomes",
    description: "Description",
}

const projects = [palander, quSolver];



const ProjectManager = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const numOfProj = projects.length; // Number of projects
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? numOfProj - 1 : prevIndex - 1
        );
    };
    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === numOfProj - 1 ? 0 : prevIndex + 1
        );
    };
    

    return (
        <div className='main-container-manager'>
            <Project {...projects[currentIndex]} />
            <button className="side-button-PM leftB2" onClick={handlePrev}><i class="arrow-3 leftArrow"></i></button>
            <button className="side-button-PM rightB2" onClick={handleNext}><i class="arrow-3 rightArrow"></i></button>
        </div>
    );
}

export default ProjectManager;