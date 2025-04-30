import React, {useEffect, useState, iseRef} from 'react'
import '../css/Home.css';
import Project from '../components/Project.js'

const Home = ({parentRef}) => {

    const scrollRef = React.useRef(0);

    const [page, setPage] = useState("Project");

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

    if(page === "Name"){
        
        return(
            <div className="main">
                <h1>Nicholas Li</h1>
                <div className="content">
                    {/* Content or elements you want to show on the page */}
                    <p>dsfsdfs</p>
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
};
export default Home;