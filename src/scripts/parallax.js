

const tag = name => document.getElementsByTagName(name);
const clas = name => Array.prototype.slice.call(document.getElementsByClassName(name));

const PARALLAX = "dynamic-parallax";
const CONTENT = "dynamic-parallax--content";
const RATIO = 16 / 9;

export default function dynamicParallax(parallax = PARALLAX, content = CONTENT, ratio = RATIO) {
    /* detect touch */
    if ("ontouchstart" in window)
        document.documentElement.className += " touch";

    /* background fix */
    if (!tag("html")[0].matches(".touch"))
        clas(parallax).forEach(el => el.style.backgroundAttachment = "fixed");


    /* fix vertical when not overflow
     call fullscreenFix() if .fullscreen content changes */
    const fullscreenFix = () =>
        // set .fullscreen height
        clas(content).forEach(el =>
            el.clientHeight > document.body.offsetHeight ?
                el.closest("." + parallax).className += " overflow" : false
        );

    window.addEventListener('resize', fullscreenFix);
    fullscreenFix();

    /* resize background images */
    function backgroundResize(ratio) {
        console.log("background resize");
        let windowH = document.documentElement.clientHeight;
        clas(parallax).forEach(function (path) {
            // letiables

            let contW = path.clientWidth;
            let contH = path.clientHeight;


            // overflowing difference
            let diff = 0;
            // remaining height to have fullscreen image only on parallax
            let remainingH = 0;
            if (!tag("html")[0].matches(".touch"))
                remainingH = windowH - contH;

            // set img values depending on cont
            let imgH = contH + remainingH + diff;
            let imgW = imgH * ratio;
            // fix when too large
            if (contW > imgW) {
                imgW = contW;
                imgH = imgW / ratio;
            }
            //
            path.setAttribute("resized-imgW", imgW);
            path.setAttribute("resized-imgH", imgH);
            path.style.backgroundSize = imgW + "px " + imgH + "px";

        });
    }

    console.log(67);
    const backResizeWithRatio = () => backgroundResize(ratio);
    window.addEventListener('resize', backResizeWithRatio);
    window.addEventListener("focus", backResizeWithRatio);
    backResizeWithRatio();

    const scrollTop = () => Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
    /* set parallax background-position */
    function parallaxPosition(e) {
        console.log("parallax position");
        let heightWindow = document.documentElement.clientHeight;
        let topWindow = document.body.scrollTop;
        let bottomWindow = topWindow + heightWindow;
        let currentWindow = (topWindow + bottomWindow) / 2;
        clas(parallax).forEach(function (path) {
            let height = path.clientHeight;
            let top = path.offsetTop;
            let bottom = top + height;
            // only when in range
            if (bottomWindow > top && topWindow < bottom) {
                let imgW = path.getAttribute("resized-imgW");
                let imgH = path.getAttribute("resized-imgH");

                // min when image touch top of window
                let min = 0;
                // max when image touch bottom of window
                let max = -imgH + heightWindow;
                // overflow changes parallax
                let overflowH = height < heightWindow ? imgH - height : imgH - heightWindow; // fix height on overflow
                top = top - overflowH;
                bottom = bottom + overflowH;
                // value with linear interpolation
                let value = min + (max - min) * (currentWindow - top) / (bottom - top);
                // set background-position
                let horizontalPosition = path.getAttribute("data-oriz-pos");
                horizontalPosition = horizontalPosition ? horizontalPosition : "50%";
                path.style.backgroundPosition = horizontalPosition + " " + value + "px";
                console.log(horizontalPosition,value);

            }
        });
    }

    if (!tag("html")[0].matches(".touch")) {
        window.addEventListener('resize', parallaxPosition);
        //$(window).focus(parallaxPosition);
        window.addEventListener('scroll', parallaxPosition);
        parallaxPosition();
    }
}