import React, { useEffect, useState } from 'react'
import '../css/Project.css';
import me from "../images/random/me1.jpg";

const Project = (props = {}) => {
    

    return (
        <div className="main-container-project">
            <div className="main-container-header">
                <h1>Projects</h1>
            </div>
            <div className="project">
                
                <div className="text-container">
                    <div className="details">
                        <div className="proj-title">
                            <h2>{props.title}</h2>
                        </div>
                        <p3>Languages used: </p3> <br/>
                        <p1>{props.languages}</p1>                        
                        <br/><br/>
                        <p3>Libraries used:</p3>   <br/>                     
                        <p1>{props.libraries}</p1>                        
                    </div>
                    <div className="outcomes">
                        <p3> Final outcomes: </p3><br/>
                        <p1>{props.outcomes}</p1>
                    </div>
                    <div className="description">
                        <p3>About:</p3><br/>
                        <p1>{props.description}</p1>
                    </div>
                </div>
            </div>
        </div>
    )
};
{/* props.projTitle
                props.details
                props.img */}
export default Project;