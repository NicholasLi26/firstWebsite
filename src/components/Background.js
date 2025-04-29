import React, { useState, useEffect, useRef } from 'react';
import '../css/Background.css'; // Import the CSS file for styling
import forest from '../images/sprites/forest2.png'; // Import the image
import Canvas from './Canvas.js'; // Import the Canvas component
import sky from '../images/sprites/sky3.png'; // Import the image
import trees from '../images/sprites/backgroundTest/trees.png'; // Import the image
import bt1 from '../images/sprites/backgroundTest/bt1.png'; // Import the image
import bt2 from '../images/sprites/backgroundTest/bt2.png'; // Import the image
import bt3 from '../images/sprites/backgroundTest/bt3.png'; // Import the image


function Background( {parentRef} ) {
    const scrollRef = useRef(0);
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: 0 });
    const imageRef = React.useRef(null);

    const frameWidth = 2560;
    const frameHeight = 2560;
    const totalFrames = 9; 
    const bottomHeight = 3;
    const zoomHeight = 2;

    const [imageLoaded, setImageLoaded] = useState(false);
    
    const [images, setImages] = useState([]);

    const zoom = true;
    const speed = 5; // Speed of the animation

    const imageMeta = [
        { id: 'bt1', src: bt1, top: (0 - 2 * Math.floor(((frameHeight/3) - scrollRef.current*1.1)/15))},
        { id: 'bt2', src: bt2,  top: 2*(0 - 2 * Math.floor(((frameHeight/3) - scrollRef.current*1.1)/15))},
        { id: 'bt3', src: bt3, top: 3*(0 - 2 * Math.floor(((frameHeight/3) - scrollRef.current*1.1)/15))},
        { id: 'trees', src: trees, top: 4*(0 - 2 * Math.floor(((frameHeight/3) - scrollRef.current*1.1)/15))},
    ]
    const imageRefs = useRef([]);

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

                // const backgroundOffsetY = Math.floor(scrollRef.current * 1.1); // Adjust the speed of the parallax effect
                
                // if(backgroundOffsetY < frameHeight/3) {
                    
                //     let y = 0;
                //     imageRefs.current.forEach((img, idx) => {
                        
                //         y = y - 2 * Math.floor(((frameHeight/3) - scrollRef.current*1.1)/15); // Adjust the speed of the parallax effect
                //         img.style.transform = `translateY(${- backgroundOffsetY -y}px)`; // Adjust the speed of the parallax effect
                        
                //     });
                // }

                // else {
                //     imageRefs.current.forEach((img, idx) => {
                //         img.style.transform = `translateY(${- frameHeight/3}px)`; // Adjust the speed of the parallax effect
                //     });
                // }
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
            let x;
            if (window.innerWidth > window.innerHeight) {
                x = window.innerWidth;
            }
            else {
                x = window.innerHeight;
            }
            const width = x;
            const  height = x;
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

        const frameIndex = Math.floor(count / speed) % totalFrames;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const backgroundOffsetY = Math.floor(scrollRef.current * 1.1);
        const scrollPercentage = Math.floor((backgroundOffsetY/ ctx.canvas.height)*100); 
        console.log(scrollPercentage);

        if ( backgroundOffsetY < ctx.canvas.height/bottomHeight) {
            ctx.drawImage(
                imageRef.current,
                frameIndex * frameWidth, 0,
                frameWidth, frameHeight,
                0, Math.floor(-backgroundOffsetY),
                ctx.canvas.width, ctx.canvas.height 
            );
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
            ctx.drawImage(
                imageRef.current,
                frameIndex * frameWidth, 0,
                frameWidth, frameHeight,
                0, Math.floor(-ctx.canvas.height/bottomHeight) ,
                ctx.canvas.width, ctx.canvas.height 
            );
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
            ctx.drawImage(
                imageRef.current,
                frameIndex * frameWidth, 0,
                frameWidth, frameHeight,
                0, Math.floor(-ctx.canvas.height/bottomHeight),
                ctx.canvas.width, ctx.canvas.height 
            );
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
            ctx.drawImage(
                imageRef.current,
                frameIndex * frameWidth, 0,
                frameWidth, frameHeight,
                0, -ctx.canvas.height/bottomHeight,
                ctx.canvas.width, ctx.canvas.height 
            );
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
        <div className = "background-container">
            
            {/* {imageMeta.map((imgMeta, index) => (
                <img
                    id={imgMeta.id}
                    src={imgMeta.src}
                    ref={el => imageRefs.current[index] = el}
                    alt=""
                    style = {{ y: -imgMeta.top}}
                />
            ))} */}
            <Canvas
            draw={draw}
            width={canvasSize.width}
            height={canvasSize.height}
            />
           
        </div>
        
        
        // <div className="animated-background" >
        //     <img id = "background" src = {forest} />
        // </div>
    );
}

export default Background;