import React, {useEffect, useState} from 'react'
import '../css/Project.css';
import me from "../images/random/me1.jpg"; 

const Project = (props = []) => {
    return(
        <div className="main-container-project">
            <div className="project">
                <div className="image-container">
                    <div className="image-subcontainer">
                        <img src={me} alt="Project" />
                    </div>
                    
                </div>
                <div className="text-container">
                    sadfds
                </div>
            </div>
        </div>
    )
};
{/* props.projTitle
                props.details
                props.img */}
export default Project;