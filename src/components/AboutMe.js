import React, {useState} from 'react'
import '../css/AboutMe.css';
import me from "../images/random/me1.jpg"; 
import me2 from "../images/random/me2.jpg";
import me3 from "../images/random/me3.jpg";

const images = [me2, me3, me];


const AboutMe = () => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return(
        <div className="main-container-AboutMe">
            <div className="main-container-header">
                <h1>About Me</h1>
            </div>
            <div className="AboutMe">
                <div className="image-container-AboutMe">
                    <div className="image-subcontainer-AboutMe">
                        <div
                            className="carousel-wrapper"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                            }}
                        >
                            {images.map((imgSrc, index) => (
                                <img key={index} src={imgSrc} alt={`Slide ${index}`} />
                            ))}
                        </div>
                        <button className="side-button leftB" onClick={handlePrev}><i class="arrow-2 leftArrow"></i></button>
                        <button className="side-button rightB" onClick={handleNext}><i class="arrow-2 rightArrow"></i></button>
                    </div>
                    
                </div>
                <div className="text-container-AboutMe">
                    <div className="aboutMe-text-outer">
                        <div className="aboutMe-text">
                            <h2> Hello! I'm Nicholas Li. Welcome to my website!</h2>
                            <p> I made this not only to showcase my projects, but also to give 
                                some insight into me! I believe that you can only learn so much from 
                                an interview or a resume. 
                            </p>
                            <br/>
                            <p>
                                I'm a 3rd year computer science student at Queens Univerity, currently on summer break. As seen
                                with my website, I like to put a little whimsy into my work, with a bit of
                                overcomplication for fun. This website is both a side project as well as a way to 
                                showcase my work and code. I'll be regularly updating it both with my projects as well as 
                                new features to the website itself.
                            </p>
                            <br/>
                            <p>
                                In terms of programming, I'm more of a Java and python person (Other languages I know can be found on resume). Java is usually my 
                                go to language , but I use python for ease of use with most AI libraries. I recently have been tending towards
                                more AI and machine learning projects, but I also have a passion for game development on the side. I'm currently
                                working on a way to combine the two.
                            </p>
                            <br/>
                            <p>
                                If i didn't get into coding, I think I would've enjoyed being a geologist.
                                I love being outdoors, and I've always wanted to be an astronaut, so I figured geology would be 
                                a good way into both. I also enjoy art, and although I'm mediocre, I do like to encorperate it into
                                the games I develop. Aside from that, I enjoy video games (I'm in CS),
                                rock climbing (I'm in CS), as well as reading and classical guitar (Not very CS). I'm big into music,
                                if you have any playlists or song recomendations let me know. I'm Emerald 4 if anyone
                                is wondering.
                            </p>
                            <br/>
                            <p>
                                Thanks for reading! Feel free to reach out to me if you have any questions or want to chat! 
                            </p>

                        </div>
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