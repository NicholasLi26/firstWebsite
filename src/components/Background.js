import React, { useState, useEffect } from 'react';
import '../css/Background.css'; // Import the CSS file for styling

function Background() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const backgroundPosition = `center ${scrollY * 0.3}px`; // Scroll slower (multiply by 0.3 for slower speed)

    return (
        <div className="animated-background" style={{ backgroundPosition: backgroundPosition }} />
    );
}

export default Background;