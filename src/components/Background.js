import React, { useState, useEffect, useRef } from 'react';
import '../css/Background.css'; // Import the CSS file for styling
import Canvas from './Canvas.js'; // Import the Canvas component
import sky from '../images/sprites/sky3.png'; // Import the image


function Background( {parentRef} ) {
    const scrollRef = useRef(0);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [shiftLeft, setShiftLeft] = useState(0);
    const imageRef = React.useRef(null);

    const frameWidth = 2560;
    const frameHeight = 2560;
    const totalFrames = 9; 
    const bottomHeight = 3;

    const [imageLoaded, setImageLoaded] = useState(false);
    

    const speed = 15; //fps

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
    
    useEffect(() => {
        const img = new Image();
        img.src = sky;
        img.onload = () => {
            imageRef.current = img;
            setImageLoaded(true);
            let w;
            if (window.innerHeight > window.innerWidth+Math.floor(-window.innerWidth/bottomHeight)){
                w = window.innerHeight *2;
                const sL = Math.floor((w-window.innerWidth)/2)
                setShiftLeft(Math.floor(sL))
                var style = document.getElementById("background").style;
                style.left = `${-sL}px`;
            }
            else{
                w = window.innerWidth

            }
            const width = w;
            const  height = w;
            
            setCanvasSize({ width, height });
            
            console.log("Image loaded and canvas size set:", canvasSize.width, canvasSize.height);
        };

        const handleResize = () => {
            if (!imageRef.current) return;
            const tallThin = window.innerHeight > window.innerWidth+Math.floor(-window.innerWidth/bottomHeight)
            let w;
            if (tallThin){
                w = window.innerHeight *2;
                const sL = Math.floor((w-window.innerWidth)/2)
                setShiftLeft(sL);
                console.log(shiftLeft, sL, w-window.innerWidth)
                var style = document.getElementById("background").style;
                style.setProperty("left", `${-sL}px`);
            }
            else{
                w = window.innerWidth
                var style = document.getElementById("background").style;
                style.left = `${0}px`;
            }
            const width = w;
            const height = w;
            setCanvasSize({ width, height });
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const draw = (ctx, count) => {
        if (!imageLoaded || !imageRef.current) return;

        const frameIndex = Math.floor(count / speed) % totalFrames;
        const backgroundOffsetY = Math.floor(scrollRef.current * 1.1);        
        //console.log(ctx.canvas.height, ctx.canvas.width, window.innerHeight, window.innerWidth, tallThin)
        //console.log(window.innerheight > window.innerWidth+Math.floor(-ctx.canvas.height/bottomHeight), window.innerWidth, ctx.canvas.width)

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


        //console.log(backgroundOffsetY*ratio, window.innerWidth/3,ratio)

        //backgroundOffsetY < ctx.canvas.height/bott
        if ( backgroundOffsetY < ctx.canvas.height/bottomHeight) {
            ctx.drawImage(
                imageRef.current,
                frameIndex * frameWidth, 0,// x, y of image top right
                frameWidth, frameHeight,//pixels shown in image
                0, Math.floor(-backgroundOffsetY), //x, y but inverted?
                ctx.canvas.width, ctx.canvas.height 
            );
        }

        else{
            ctx.drawImage(
                imageRef.current,
                frameIndex * frameWidth, 0,
                frameWidth, frameHeight,
                0, Math.floor(-ctx.canvas.height/bottomHeight),
                ctx.canvas.width, ctx.canvas.height 
            );
        }

        
    };

    return (
        <div className = "background-container">

            <Canvas
            draw={draw}
            width={canvasSize.width}
            height={canvasSize.height}
            id = "background"
            />
           
        </div>
    );
}

export default Background;