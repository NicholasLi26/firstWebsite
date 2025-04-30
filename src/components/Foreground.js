import React, { useState, useEffect, useRef } from 'react';
import '../css/Foreground.css'; // Import the CSS file for styling
import forest from '../images/sprites/forest2.png'; // Import the image
import Canvas from './Canvas.js'; // Import the Canvas component
import sky from '../images/sprites/sky3.png'; // Import the image
import trees from '../images/sprites/backgroundTest/trees.png'; // Import the image
import bt1 from '../images/sprites/backgroundTest/bt1.png'; // Import the image
import bt2 from '../images/sprites/backgroundTest/bt2.png'; // Import the image
import bt3 from '../images/sprites/backgroundTest/bt3.png'; // Import the image


function Foreground( {parentRef} ) {
    const scrollRef = useRef(0);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [shiftLeft, setShiftLeft] = useState(0);
    const imageRef = React.useRef(null);

    const frameWidth = 2560;
    const frameHeight = 2560;
    const totalFrames = 9; 
    const bottomHeight = 3;
    const zoomHeight = 2;

    const [imageLoaded, setImageLoaded] = useState(false);
    
    const [images, setImages] = useState([]);

    const zoom = true; // Turn on off zoom
    const speed = 5; // Speed of the animation

    const [tallThin, setTallThin] = useState(false);

    const imageMeta = [
        { id: 'bt1', src: bt1, top: (0 - 2 * Math.floor(((frameHeight/3) - scrollRef.current*1.1)/15))},
        { id: 'bt2', src: bt2,  top: 2*(0 - 2 * Math.floor(((frameHeight/3) - scrollRef.current*1.1)/15))},
        { id: 'bt3', src: bt3, top: 3*(0 - 2 * Math.floor(((frameHeight/3) - scrollRef.current*1.1)/15))},
        { id: 'trees', src: trees, top: 4*(0 - 2 * Math.floor(((frameHeight/3) - scrollRef.current*1.1)/15))},
    ]
    const imageRefs = useRef([]);

    useEffect(() => {   // Preload images
        const imagePaths = importImages(
            require.context(
                '../images/sprites/backgroundTest', 
                false, 
                /\.(png)$/)
        );

        preloadImages(imagePaths)
            .then((loadedImages) => {
                setImages(loadedImages);
            })
            .catch((err) => {
                console.error('Failed to preload images', err);
        });
    }, []);

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
                var style = document.getElementById("foreground").style;
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
                var style = document.getElementById("foreground").style;
                style.setProperty("left", `${-sL}px`);
            }
            else{
                w = window.innerWidth
                var style = document.getElementById("foreground").style;
                style.left = `${0}px`;
            }
            const width = w;
            const height = w;
            setCanvasSize({ width, height });
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const draw2 = (ctx, count) => {
        if (!imageLoaded || !imageRef.current) return;

        const backgroundOffsetY = Math.floor(scrollRef.current * 1.1);
        setTallThin (window.innerHeight > window.innerWidth+Math.floor(-window.innerWidth/bottomHeight))
        
        //console.log(ctx.canvas.height, ctx.canvas.width, window.innerHeight, window.innerWidth, tallThin)
        //console.log(window.innerheight > window.innerWidth+Math.floor(-ctx.canvas.height/bottomHeight), window.innerWidth, ctx.canvas.width)

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


        //console.log(backgroundOffsetY*ratio, window.innerWidth/3,ratio)

        //backgroundOffsetY < ctx.canvas.height/bott
        if ( backgroundOffsetY < ctx.canvas.height/bottomHeight) {
            
            let y = 0;
            let x = 0.9
            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    0, 0,
                    frameWidth, frameHeight,
                    0, Math.floor(-backgroundOffsetY -y ),
                    ctx.canvas.width, ctx.canvas.height 
                );
                
                y = y - 2 * Math.floor(x * ((ctx.canvas.height/bottomHeight) - backgroundOffsetY)/15);
                x = x + 0.5;
            });
            
        }

        
        else if (zoom && backgroundOffsetY < ctx.canvas.height/zoomHeight) {
            let y = 0;
            let x = 0;
            let zoom = Math.floor((ctx.canvas.height/bottomHeight - backgroundOffsetY)^2 / 20);
            
            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    -Math.floor((zoom*x)/2), -Math.floor((zoom*x)/1.5),
                    frameWidth + zoom*x, frameWidth + zoom*x,
                    0, Math.floor(-ctx.canvas.height/bottomHeight),
                    ctx.canvas.width, ctx.canvas.height 
                );
                x += 0.5;
            });
        }


        else if (zoom){
            const zoom = Math.floor((ctx.canvas.height/bottomHeight - ctx.canvas.height/zoomHeight)^2 / 20);
            
            let x = 0;
            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    -Math.floor((zoom*x)/2), -Math.floor((zoom*x)/1.5),
                    frameWidth +zoom*x, frameHeight + zoom*x,
                    0, Math.floor(-ctx.canvas.height/bottomHeight),
                    ctx.canvas.width, ctx.canvas.height
                );
                x+= 0.5;
            });
        }

        else {
            
            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    0, 0,
                    frameWidth, frameHeight,
                    0, Math.floor(-ctx.canvas.height/bottomHeight),
                    ctx.canvas.width, ctx.canvas.height 
                );
            });
        }
    }

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
        <div className = "foreground-container">

        <Canvas
            draw={draw2}
            width={canvasSize.width}
            height={canvasSize.height}
            id = "foreground"
            style = {{ zIndex: 5}}
            />
           
        </div>
        
        
        // <div className="animated-background" >
        //     <img id = "background" src = {forest} />
        // </div>
    );
}

export default Foreground;