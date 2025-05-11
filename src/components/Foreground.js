import React, { useState, useEffect, useRef, use } from 'react';
import '../css/Foreground.css'; // Import the CSS file for styling
import Canvas from './Canvas.js'; // Import the Canvas component
import sky from '../images/sprites/sky3.png'; // Import the image
import sign from '../images/sprites/sign.png'; // Import the imagei



function Foreground({ parentRef,  setPage }) {
    const scrollRef = useRef(0);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [signCanvasSize, setSignCanvasSize] = useState({ signWidth: 0, signHeight: 0 });
    const imageRef = React.useRef(null);

    const frameWidth = 2560;
    const frameHeight = 2560;
    const bottomHeight = 3;
    const zoomHeight = 2;

    const signWidth = 512;
    const signCenter = 2;
    const sign1End = 6;
    const sign2End = 4;
    const sign3End = 0;
    const signRef = useRef(null);
    const frameIndex = useRef(2);
    const signDivScale = 3;
    const signDivTop = useRef(0);
    const signRef2 = useRef(null);

    const fontSizeRef = useRef(0);
    const fontRef = useRef(null);

    const hoverRef = useRef(null);

    const [showButton, setShowButton] = useState(true);
    const buttonStyle = useRef(null);

    const [hovering, setHovering] = useState("none"); // Set the initial page to "Main"
    const [imageLoaded, setImageLoaded] = useState(false);
    const [images, setImages] = useState([]);

    const zoom = true; // Turn on off zoom
    const turnSpeed = 20;

    const lastDrawY = useRef(-1);

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
        const signElement = document.getElementById("sign");
        const buttonElement = document.getElementById("db");
        if (signElement) {
            signRef2.current = signElement.style;
            buttonStyle.current = buttonElement.style;
        }
    }, []);

    useEffect(() => {
        const fontElement = document.querySelectorAll(".sign-button-container h1");
        if (fontElement && fontSizeRef.current === 0) {
            const computedStyle = window.getComputedStyle(fontElement[0]);
            fontSizeRef.current = parseFloat(computedStyle.fontSize.replace("px", ""));
            fontRef.current = fontElement;
            fontElement.forEach((element) => {            
                element.style.fontSize = `${fontSizeRef.current/3}px`;
            });
        }
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

        const img2 = new Image();
        img2.src = sign;


        img.onload = () => {
            imageRef.current = img;
            signRef.current = img2;

            setImageLoaded(true);
            let w;
            if (window.innerHeight > window.innerWidth + Math.floor(-window.innerWidth / bottomHeight)) {
                w = window.innerHeight * 2;
                const sL = Math.floor((w - window.innerWidth) / 2)
                var style = document.getElementById("foreground").style;
                style.left = `${-sL}px`;
            }
            else {
                w = window.innerWidth

            }
            const signWidth = Math.floor(w / signDivScale);
            const signHeight = Math.floor(w / (signDivScale * 2));
            setSignCanvasSize({ signWidth, signHeight });

            signDivTop.current = Math.floor(w / bottomHeight) + w / 6;

            

            const width = w;
            const height = w;
            setCanvasSize({ width, height });

            
            // console.log("Image loaded and canvas size set:", canvasSize.width, canvasSize.height, signCanvasSize.widthS, signCanvasSize.heightS);
        };

        const handleResize = () => {
            if (!imageRef.current) return;
            const tallThin = window.innerHeight > window.innerWidth + Math.floor(-window.innerWidth / bottomHeight)
            let w;
            if (tallThin) {
                w = window.innerHeight * 2;
                const sL = Math.floor((w - window.innerWidth) / 2)
                //console.log(shiftLeft, sL, w - window.innerWidth)
                var style = document.getElementById("foreground").style;
                style.setProperty("left", `${-sL}px`);
            }
            else {
                w = window.innerWidth
                var style = document.getElementById("foreground").style;
                style.left = `${0}px`;
            }
            const signWidth = Math.floor(w / signDivScale);
            const signHeight = Math.floor(w / (signDivScale * 2));
            setSignCanvasSize({ signWidth, signHeight });

            signDivTop.current = Math.floor(w / bottomHeight) + w / 6;

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
        if (backgroundOffsetY === lastDrawY.current && (count % turnSpeed !== 0)) return; // No change; skip draw
        lastDrawY.current = backgroundOffsetY;

        const canvasWidth = ctx.canvas.width
        const canvasHeight = ctx.canvas.height

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        

        let targetPos;
        
        if ((count / turnSpeed) % 1 === 0) {
            let h1 = null;
            if (hovering === "main") {
                targetPos = sign1End;
                
            } else if (hovering === "project") {
                targetPos = sign3End;

            } else if (hovering === "aboutMe") {
                targetPos = sign2End;

            }
            else {
                targetPos = signCenter;
            }
            if (frameIndex.current > targetPos)
                frameIndex.current -= 1;

            else if (frameIndex.current < targetPos)
                frameIndex.current += 1;
        }

        if (backgroundOffsetY < canvasHeight / bottomHeight) {

            let y = 0;
            let x = 0.9;

            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    0, 0,
                    frameWidth, frameHeight,
                    0, Math.floor(-backgroundOffsetY - y),
                    canvasWidth, canvasHeight
                );

                if (index === images.length - 1) {
                    const move = signDivTop.current + Math.floor(-backgroundOffsetY - y);

                    //console.log(move, signDown.current, backgroundOffsetY, y)
                    signRef2.current.setProperty("top", `${move}px`);

                    ctx.drawImage(
                        signRef.current,
                        frameIndex.current * signWidth, 0,
                        signWidth, signWidth,
                        Math.floor(2 * canvasWidth / 5), Math.floor(move + canvasHeight / 15), //cetner 
                        Math.floor(canvasWidth / 5), Math.floor(canvasHeight / 5)
                    );
                }

                y = y - 2 * Math.floor(x * ((canvasHeight / bottomHeight) - backgroundOffsetY) / 15);
                x = x + 0.5;
            });

        }
        

        else if (zoom && backgroundOffsetY < canvasHeight / zoomHeight) {
            if((backgroundOffsetY > (canvasHeight / (bottomHeight-0.5)))) {
                setShowButton(false);
            }
            else {
                setShowButton(true);
            }
            
            let x = 0;
            images.forEach((image, index) => {
                
                const scrolled = backgroundOffsetY / canvasHeight;
                const percentageZoom = (scrolled-0.33)/(0.5-0.33)
                let zoom = (percentageZoom*x);
                const growth = frameWidth - zoom*frameWidth

                ctx.drawImage(
                    image,
                    zoom*frameWidth/2, zoom*frameWidth/1.5,
                    growth, growth ,
                    0, Math.floor(-canvasHeight / bottomHeight),
                    canvasWidth, canvasHeight
                );
                

                if (index === images.length - 1) {
                    const horizonLine = (canvasHeight - canvasHeight / bottomHeight)/canvasHeight
                    const sizeDrawnOnCanvas = growth 
                    const ratioPixelsOnCanvas = sizeDrawnOnCanvas / ctx.canvas.width
                    
                    const horizonLineCanvas = (horizonLine*frameWidth)+(frameWidth/bottomHeight)                  
                    const BP = signDivTop.current - canvasHeight / bottomHeight + canvasHeight / 15
                    
                    const percentFromH = ((BP  * ratioPixelsOnCanvas)+ zoom*frameWidth/1.5) / horizonLineCanvas
                    const amountShowing = signWidth/growth
                    const signFrameSize = canvasHeight*amountShowing
                    
                    const zoom1 = Math.floor(zoom * x * signCanvasSize.signWidth);

                    const move = (signDivTop.current + Math.floor(-canvasHeight / bottomHeight)) - zoom1 / 1.5;
                    signRef2.current.setProperty("width", `${signCanvasSize.signWidth + zoom1 * 4}px`);
                    signRef2.current.setProperty("height", `${signCanvasSize.signHeight + (zoom1 * 4) / 2}px`);
                    signRef2.current.setProperty("top", `${move}px`);
                    
                    fontRef.current.forEach((element) => {
                        element.style.fontSize = `${Math.round((fontSizeRef.current/3) + (fontSizeRef.current* percentageZoom)/1.5,1)}px`;
                        
                    }); 
                    if (hoverRef.current){
                        console.log("here")
                        hoverRef.current.style.fontSize = `${Math.round((fontSizeRef.current/3) + (fontSizeRef.current* percentageZoom),1)}px`;       
                    }
                    
                    //console.log(move2)

                    
                    ctx.drawImage(
                        signRef.current,
                        (frameIndex.current * signWidth), 0, //only change x on sign for frames
                        signWidth, signWidth, 
                        Math.floor(canvasWidth/2 -(signFrameSize)/2), Math.floor(BP -  (percentFromH * zoom * frameWidth/1.5)/(ratioPixelsOnCanvas+1)), //change position based on center of thing
                        // ctx.canvas.width / 5 * Math.pow(0.67 + scrolled, 1.9)
                        Math.floor(signFrameSize), Math.floor(signFrameSize) //increase canvas drawing size to avoid having to reposition
                    );

                    

                }
                x += 0.07;
            });

            
            
        }


        else if (zoom) {
            let x = 0;

            images.forEach((image, index) => {
                const growth = frameWidth - x*frameWidth
                ctx.drawImage(
                    image,
                    x*frameWidth/2, x*frameWidth/1.5,
                    growth, growth ,
                    0, Math.floor(-canvasHeight / bottomHeight),
                    canvasWidth, canvasHeight
                );


                if (index === images.length - 1) {
                    const horizonLine = (canvasHeight - canvasHeight / bottomHeight)/canvasHeight
                    const sizeDrawnOnCanvas = growth 
                    const ratioPixelsOnCanvas = sizeDrawnOnCanvas / canvasWidth
                    
                    const horizonLineCanvas = (horizonLine*frameWidth)+(frameWidth/bottomHeight)                  
                    const BP = signDivTop.current - canvasHeight / bottomHeight + canvasHeight / 15
                    
                    const percentFromH = ((BP  * ratioPixelsOnCanvas)+ x*frameWidth/1.5) / horizonLineCanvas
                    const amountShowing = signWidth/growth
                    const signFrameSize = canvasHeight*amountShowing
                    
                    ctx.drawImage(
                        signRef.current,
                        (frameIndex.current * signWidth), 0, //only change x on sign for frames
                        signWidth, signWidth, 
                        canvasWidth/2 -(signFrameSize)/2, BP - (percentFromH * x * frameWidth/1.5)/(ratioPixelsOnCanvas+1), //change position based on center of thing
                        // ctx.canvas.width / 5 * Math.pow(0.67 + scrolled, 1.9)
                        (canvasWidth*amountShowing), (signFrameSize) //increase canvas drawing size to avoid having to reposition
                    );
                }
                    
                x += 0.07;
            });
        }

        else {
            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    0, 0,
                    frameWidth, frameHeight,
                    0, Math.floor(-canvasHeight / bottomHeight),
                    canvasWidth, canvasHeight
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

    function onClick(destination) {
        setPage(destination);
        smoothScrollToTop(parentRef.current);
    }

    function smoothScrollToTop(element, duration = 2000, top = true) {
        const start = element.scrollTop;
        
        const startTime = performance.now();
      
        function scroll(timestamp) {
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1); 
          element.scrollTop = start  * (1 - easeInOut(progress));
      
          if (progress < 1) {
            requestAnimationFrame(scroll);
          }
        }

        function scroll2(timestamp) {
            const end = element.scrollHeight - element.clientHeight;
            const dist  = end - start;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            element.scrollTop = start + dist * (easeInOut(progress));
            
            if (progress < 1) {
                requestAnimationFrame(scroll2);
            }
        }

        if (top) {
            requestAnimationFrame(scroll);
        }

        else {
            requestAnimationFrame(scroll2);
        }
      }
      
      function easeInOut(t) {
        return t < 0.5 ? 4 * Math.pow(t, 3) : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

    return (
        <div className="foreground-container">
            <div className="sign-button-container" id="sign" style={{ width: `${signCanvasSize.signWidth}px`, height: `${signCanvasSize.signHeight}px` }}>
                <div className = "button-home"
                onMouseEnter={(e) => {setHovering("main"); hoverRef.current = e.currentTarget.querySelector("h1")}}
                onMouseLeave={() => {setHovering("none"); hoverRef.current = null}}>
                    <button onClick={() => onClick("main")}>
                        <h1>Home</h1>
                    </button>
                </div>
                <div className = "div-filler"></div>
                <div className = "button-aboutMe" 
                onMouseEnter={(e) => {setHovering("aboutMe"); hoverRef.current = e.currentTarget.querySelector("h1")}}
                onMouseLeave={() => {setHovering("none"); hoverRef.current = null}}>
                    <button onClick={() => onClick("aboutMe")}>
                        <h1>About Me</h1>
                    </button>
                </div>
                <div className = "div-filler"></div>
                <div className = "button-projects" 
                onMouseEnter={(e) => {setHovering("project"); hoverRef.current = e.currentTarget.querySelector("h1")}}
                onMouseLeave={() => {setHovering("none"); hoverRef.current = null}}>
                    <button  onClick={() => onClick("project")}>
                        <h1>Projects</h1>
                    </button>
                </div>
                <div className = "div-filler"></div>
            </div>

            <Canvas
                draw={draw2}
                width={canvasSize.width}
                height={canvasSize.height}
                id="foreground"
                style={{ zIndex: 5 }}
            />
                <button className="down-button" id = "db" style = {{display: showButton ? 'block' : 'none'}} onClick={() => smoothScrollToTop(parentRef.current, 1000, false)}> <i class="arrow down"></i> </button>


        </div>
    );
}

export default Foreground;