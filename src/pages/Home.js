import React, {useEffect, useState, iseRef} from 'react'
import '../css/Home.css';
import Project from '../components/Project.js'
import AboutMe from '../components/AboutMe.js'

const Home = ({parentRef}) => {

    const scrollRef = React.useRef(0);

    const [page, setPage] = useState("AboutMe"); // Set the initial page to "Main"

    useEffect(() => {
            const handleScroll = () => {
                if (parentRef.current) {
                    scrollRef.current = parentRef.current.scrollTop;
                }
            };
    
            if (parentRef.current) {
                parentRef.current.addEventListener('scroll', handleScroll);
                
            }
    
            return () => {
                if (parentRef.current) {
                    parentRef.current.removeEventListener('scroll', handleScroll);
                }
            };
        }, [parentRef]);

    if(page === "Main"){
        
        return(
            <div className="main">
                <div className='name-container'>
                    <h1>Nicholas Li</h1>
                </div>
            </div>
        )
    }

    else if (page === "Project"){
        return(
            <div className="main">
                <Project/>
            </div>

        )
    }

    else if (page === "AboutMe"){
        return(
            <div className="main">
                <AboutMe/>
            </div>

        )
    }
};
export default Home;