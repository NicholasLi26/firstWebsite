import React, {useEffect, useState, useRef} from 'react'
import '../css/Home.css';
import Project from '../components/Project.js'
import AboutMe from '../components/AboutMe.js'

const Home = ({parentRef, page}) => {


    if(page === "main"){
        
        return(
            <div className="main">
                <div className='name-container'>
                    <h1>Nicholas Li</h1>
                </div>
            </div>
        )
    }

    else if (page === "project"){
        return(
            <div className="main">
                <Project />
            </div>

        )
    }

    else if (page === "aboutMe"){
        return(
            <div className="main">
                <AboutMe/>
            </div>
        )
    }
};
export default Home;