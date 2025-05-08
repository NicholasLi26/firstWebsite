import React, { useState, useEffect, useRef } from 'react';
import '../css/Foreground.css'; // Import the CSS file for styling
import Canvas from './Canvas.js'; // Import the Canvas component
import sky from '../images/sprites/sky3.png'; // Import the image
import sign from '../images/sprites/sign.png'; // Import the image



function Foreground({ parentRef }) {
    const scrollRef = useRef(0);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [signCanvasSize, setSignCanvasSize] = useState({ signWidth: 0, signHeight: 0 });
    const [shiftLeft, setShiftLeft] = useState(0);
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
    const ratio = useRef(0);

    const signDown = useRef(0);
    const signRef2 = useRef(null);

    const [hovering, setHovering] = useState("none"); // Set the initial page to "Main"

    const stopUpdate = useRef(false);

    const [imageLoaded, setImageLoaded] = useState(false);

    const [images, setImages] = useState([]);

    const zoom = true; // Turn on off zoom
    const turnSpeed = 20;

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
        if (signElement) {
            const computedStyle = window.getComputedStyle(signElement);
            signRef2.current = signElement.style;
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
                setShiftLeft(Math.floor(sL))
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
                setShiftLeft(sL);
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

        //console.log(ctx.canvas.height, ctx.canvas.width, window.innerHeight, window.innerWidth, tallThin)
        //console.log(window.innerheight > window.innerWidth+Math.floor(-ctx.canvas.height/bottomHeight), window.innerWidth, ctx.canvas.width)

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        //console.log(backgroundOffsetY*ratio, window.innerWidth/3,ratio)

        //console.log(canvasSize.width, canvasSize.height, ctx.canvas.width, ctx.canvas.height, signCanvasSize.widthS, signCanvasSize.heightS)

        let targetPos;
        

        if ((count / turnSpeed) % 1 === 0) {
            if (hovering === "main") {
                targetPos = sign1End;
            } else if (hovering === "project") {
                targetPos = sign2End;
            } else if (hovering === "aboutMe") {
                targetPos = sign3End;
            }
            else {
                targetPos = signCenter;
            }
            if (frameIndex.current > targetPos)
                frameIndex.current -= 1;

            else if (frameIndex.current < targetPos)
                frameIndex.current += 1;
        }

        if (backgroundOffsetY < ctx.canvas.height / bottomHeight) {

            let y = 0;
            let x = 0.9;

            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    0, 0,
                    frameWidth, frameHeight,
                    0, Math.floor(-backgroundOffsetY - y),
                    ctx.canvas.width, ctx.canvas.height
                );

                if (index === images.length - 1) {
                    const move = signDivTop.current + Math.floor(-backgroundOffsetY - y);

                    //console.log(move, signDown.current, backgroundOffsetY, y)
                    signRef2.current.setProperty("top", `${move}px`);


                    //console.log(targetPos)        
                    if ((count / turnSpeed) % 1 === 0) {
                        if (frameIndex.current > targetPos)
                            frameIndex.current -= 1;

                        else if (frameIndex.current < targetPos)
                            frameIndex.current += 1;
                    }

                    ctx.drawImage(
                        signRef.current,
                        frameIndex.current * signWidth, 0,
                        signWidth, signWidth,
                        4 * ctx.canvas.width / 10, move + ctx.canvas.height / 15, //cetner 
                        ctx.canvas.width / 5, ctx.canvas.height / 5
                    );
                }

                y = y - 2 * Math.floor(x * ((ctx.canvas.height / bottomHeight) - backgroundOffsetY) / 15);
                x = x + 0.5;
            });

        }


        else if (zoom && backgroundOffsetY < ctx.canvas.height / zoomHeight) {
            let x = 0;
            let zoom = Math.floor((ctx.canvas.height / bottomHeight - backgroundOffsetY));

            const scrolled = backgroundOffsetY / ctx.canvas.height;
            console.log(scrolled)
            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    -Math.floor((zoom * x) / 2), -Math.floor((zoom * x * 2) / 3),
                    frameWidth + zoom * x, frameWidth + zoom * x,
                    0, Math.floor(-ctx.canvas.height / bottomHeight),
                    ctx.canvas.width, ctx.canvas.height
                );
                const signCanvas = document.getElementById("signCanvas");

                if (index === images.length - 1) {
                    const bigoffsetY = -Math.floor((zoom * x) / 1.5);
                    const ROE = -(zoom * x);
                    const movementUp = bigoffsetY
                    const movementDown = ROE - bigoffsetY
                    const horizonLine = movementUp / (movementUp + movementDown)
                    const yDown = Math.floor(horizonLine * window.innerHeight)
                    const BP = signDivTop.current - ctx.canvas.height / bottomHeight + ctx.canvas.height / 15
                    const signZoom = zoom  *x*1.5* ((yDown - BP) / ctx.canvas.height)


                    const zoom1 = Math.floor((-zoom * x) / signDivScale);

                    // const zoomY = Math.round(ctx.canvas.height*0.75)
                    // const difference = BP + ctx.canvas.height / bottomHeight +((ctx.canvas.width-(zoom*x))/5)/2   - zoomY
                    // const percentage = difference/((ctx.canvas.width-(zoom*x))/5)
                    // console.log(BP, zoomY, difference, percentage)

                    const move = (signDivTop.current + Math.floor(-ctx.canvas.height / bottomHeight)) - zoom1 / 1.5;
                    signRef2.current.setProperty("width", `${signCanvasSize.signWidth + zoom1 * 1.3}px`);
                    signRef2.current.setProperty("height", `${signCanvasSize.signHeight + (zoom1 * 1.3) / 2}px`);
                    signRef2.current.setProperty("top", `${move}px`);

                    //console.log(move2)


                    ctx.drawImage(
                        signRef.current,
                        (frameIndex.current * signWidth), 0, //only change x on sign for frames
                        signWidth, signWidth, //keep sign width for proper scaling
                        (ctx.canvas.width / 2) - ctx.canvas.width / 5 * Math.pow(0.67 + scrolled, 1.9) / 2, BP + signZoom, //change position based on center of thing
                        ctx.canvas.width / 5 * Math.pow(0.67 + scrolled, 1.9), ctx.canvas.width / 5 * Math.pow(0.67 + scrolled, 1.9) //increase canvas drawing size to avoid having to reposition
                    );
                }
                x += 0.5;
            });
        }


        else if (zoom) {
            let x = 0;

            const zoom = Math.floor((ctx.canvas.height / bottomHeight - ctx.canvas.height / zoomHeight));
            const bigoffsetY = -Math.floor((zoom * 1.5) / 1.5);
            const ROE = -(zoom * 1.5);
            const movementUp = bigoffsetY
            const movementDown = ROE - bigoffsetY
            const horizonLine = movementUp / (movementUp + movementDown)
            const yDown = Math.floor(horizonLine * window.innerHeight)
            const BP = signDivTop.current - ctx.canvas.height / bottomHeight + ctx.canvas.height / 15
            const signZoom = zoom * 1.5 * 1.5* ((yDown - BP) / ctx.canvas.height)


            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    -Math.floor((zoom * x) / 2), -Math.floor((zoom * x) / 1.5),
                    frameWidth + zoom * x, frameHeight + zoom * x,
                    0, Math.floor(-ctx.canvas.height / bottomHeight),
                    ctx.canvas.width, ctx.canvas.height
                );


                if (index === images.length - 1) {
                    ctx.drawImage(
                        signRef.current,
                        (frameIndex.current * signWidth), 0, //only change x on sign for frames
                        signWidth, signWidth, //keep sign width for proper scaling
                        (ctx.canvas.width / 2) - ctx.canvas.width / 5 * Math.pow(0.67 + 0.5, 1.9) / 2, BP + signZoom, //change position based on center of thing
                        ctx.canvas.width / 5 * Math.pow(0.67 + 0.5, 1.9), ctx.canvas.width / 5 * Math.pow(0.67 + 0.5, 1.9) //increase canvas drawing size to avoid having to reposition
                    );
                }
                x += 0.5;
            });
        }

        else {

            images.forEach((image, index) => {
                ctx.drawImage(
                    image,
                    0, 0,
                    frameWidth, frameHeight,
                    0, Math.floor(-ctx.canvas.height / bottomHeight),
                    ctx.canvas.width, ctx.canvas.height
                );
            });
        }
    }

    const drawSign = (ctx, count) => {
        if (!imageLoaded || !signRef.current) return;

        //console.log("sign", signRef.current, signCanvasSize.widthS, signCanvasSize.heightS, ctx.canvas.width, ctx.canvas.height)
        let targetPos = 0;
        stopUpdate.current = false;
        if (hovering !== "none") {
            if (hovering === "main") {
                targetPos = sign1End;
            } else if (hovering === "project") {
                targetPos = sign2End;
            } else if (hovering === "aboutMe") {
                targetPos = sign3End;
            }
            //console.log(targetPos)
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            if ((count / turnSpeed) % 1 === 0) {
                if (frameIndex.current > targetPos)
                    frameIndex.current -= 1;

                else if (frameIndex.current < targetPos)
                    frameIndex.current += 1;
            }

            ctx.drawImage(
                signRef.current,
                frameIndex.current * signWidth, 0,
                signWidth, signWidth,
                0, 0,
                ctx.canvas.width, ctx.canvas.height
            );
        }

        else {
            if (!stopUpdate.current) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                if ((count / turnSpeed) % 1 === 0) {
                    if (frameIndex.current > signCenter)
                        frameIndex.current -= 1;

                    else if (frameIndex.current < signCenter)
                        frameIndex.current += 1;
                }

                ctx.drawImage(
                    signRef.current,
                    frameIndex.current * signWidth, 0,
                    signWidth, signWidth,
                    0, 0,
                    ctx.canvas.width, ctx.canvas.height
                );

                if (frameIndex.current === signCenter) {
                    stopUpdate.current = true;
                }
            }
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
        <div className="foreground-container">
            <div className="sign-button-container" id="sign" style={{ width: `${signCanvasSize.signWidth}px`, height: `${signCanvasSize.signHeight}px` }}>
                <div className = "button-aboutMe" onMouseEnter={() => setHovering("aboutMe")}   onMouseLeave={() => setHovering("none")}></div>
                <div className = "button-home" onMouseEnter={() => setHovering("project")}   onMouseLeave={() => setHovering("none")}></div>
                <div className = "button-projects" onMouseEnter={() => setHovering("main")}   onMouseLeave={() => setHovering("none")}></div>
            </div>

            <Canvas
                draw={draw2}
                width={canvasSize.width}
                height={canvasSize.height}
                id="foreground"
                style={{ zIndex: 5 }}
            />


        </div>
    );
}

export default Foreground;