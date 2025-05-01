import React from 'react'
import '../css/AboutMe.css';
import me from "../images/random/me1.jpg"; 

const AboutMe = (props = []) => {
    return(
        <div className="main-container-AboutMe">
            <div className="AboutMe">
                <div className="image-container-AboutMe">
                    <div className="image-subcontainer-AboutMe">
                        <img src={me} alt="Project" />
                    </div>
                    
                </div>
                <div className="text-container-AboutMe">
                    <div className="aboutMe-text">
                        sdfsdf
                    </div>
                </div>
            </div>
        </div>
    )
};
{/* props.projTitle
                props.details
                props.img */}
export default AboutMe;