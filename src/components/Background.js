import React, { useState, useEffect, useRef } from 'react';
import '../css/Background.css'; // Import the CSS file for styling
import forest from '../images/sprites/forest2.png'; // Import the image
import Canvas from './Canvas.js'; // Import the Canvas component
import sky from '../images/sprites/sky3.png'; // Import the image


function Background( {parentRef} ) {
    const scrollRef = useRef(0);
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: 0 });
    const imageRef = React.useRef(null);

    const frameWidth = 2560;
    const frameHeight = 2560;
    const totalFrames = 9; 

    const [imageLoaded, setImageLoaded] = useState(false);
    
    const [images, setImages] = useState([]);

    useEffect(() => {
        const imagePaths = importImages(
            require.context(
                '../images/sprites/backgroundTest', 
                false, 
                /\.(png)$/)
        );

        preloadImages(imagePaths)
            .then((loadedImages) => {
                setImages(loadedImages);  // All images are now fully loaded
            })
            .catch((err) => {
                console.error('Failed to preload images', err);
        });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (parentRef.current) {
                scrollRef.current = parentRef.current.scrollTop;
                console.log(1);
            }
        };

        if (parentRef.current) {
            parentRef.current.addEventListener('scroll', handleScroll);
            console.log(2);
        }

        return () => {
            if (parentRef.current) {
                parentRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [parentRef]);
    
    useEffect(() => {
        const img = new Image();
        img.src = sky;
        img.onload = () => {
            imageRef.current = img;
            setImageLoaded(true);
            // Set canvas height once image loads
            const width = window.innerWidth;
            const height = window.innerWidth; // Use scrollHeight to set the height of the canvas
            setCanvasSize({ width, height });
        };

        const handleResize = () => {
            if (!imageRef.current) return;
            const width = window.innerWidth;
            const scale = width / frameWidth;
            const height = frameHeight * scale;
            setCanvasSize({ width, height });
        };
        
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    

    const draw = (ctx, count) => {
        if (!imageLoaded || !imageRef.current) return;

        const frameIndex = Math.floor(count / 3) % totalFrames;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const backgroundOffsetY = Math.floor(scrollRef.current * 1.1); 

        if (backgroundOffsetY < ctx.canvas.height/3) {
            ctx.drawImage(
                imageRef.current,
                frameIndex * frameWidth, 0,   // Source x, y
                frameWidth, frameHeight,      // Source width, height
                0, -backgroundOffsetY,                         // Destination x, y (top left of canvas)
                ctx.canvas.width, ctx.canvas.height // Destination width and height (full canvas)
            );
            let y = 0;
            let x = 0;
            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    0, 0,   // Source x, y
                    frameWidth, frameHeight,      // Source width, height
                    0, -backgroundOffsetY -y ,                         // Destination x, y (top left of canvas)
                    ctx.canvas.width, ctx.canvas.height // Destination width and height (full canvas)
                    
                );
                
                y = y - 2 * ((ctx.canvas.height/3) - backgroundOffsetY)/15;
                console.log(y);
            });
        }
        else {
            ctx.drawImage(
                imageRef.current,
                frameIndex * frameWidth, 0,   // Source x, y
                frameWidth, frameHeight,      // Source width, height
                0, -ctx.canvas.height/3,                         // Destination x, y (top left of canvas)
                ctx.canvas.width, ctx.canvas.height // Destination width and height (full canvas)
            );
            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    0, 0,   // Source x, y
                    frameWidth, frameHeight,      // Source width, height
                    0, -ctx.canvas.height/3,                         // Destination x, y (top left of canvas)
                    ctx.canvas.width, ctx.canvas.height // Destination width and height (full canvas)
                );
            });
        }
    };

    function importImages(r) {
        return r.keys().map(r);
    }
    
    function preloadImages(imagePaths) {
        return Promise.all(
            imagePaths.map((path) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = path;
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                });
            })
        );
    }

    return (
        <Canvas
            draw={draw}
            width={canvasSize.width}
            height={canvasSize.height}
        />
        
        // <div className="animated-background" >
        //     <img id = "background" src = {forest} />
        // </div>
    );
}

export default Background;