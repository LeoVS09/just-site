import smoothScroll from 'smoothscroll-polyfill'

smoothScroll.polyfill();

function scrollTo(hash){
    document.querySelector('.' + hash).scrollIntoView({ behavior: 'smooth' });
}
Array.from(document.querySelectorAll(".nav-button")).forEach(el =>
    el.addEventListener('click', () => scrollTo(el.id))
);

const fadeNav = tag => () => {
    let offset = getOffset(document.getElementsByClassName(tag)[0]);
    let nav = document.getElementsByTagName("nav")[0];
    if(getScrollXY().y > offset.top)
        nav.classList.add("scrolled");
    else
        nav.classList.remove("scrolled");
};


function getScrollXY() {
    let x = 0, y = 0;
    if( typeof( window.pageYOffset ) == 'number' ) {
        //Netscape compliant
        y = window.pageYOffset;
        x = window.pageXOffset;
    } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
        //DOM compliant
        y = document.body.scrollTop;
        x = document.body.scrollLeft;
    } else if( document.documentElement && ( document.documentElement.scrollLeft ||
        document.documentElement.scrollTop ) ) {
        //IE6 standards compliant mode
        y = document.documentElement.scrollTop;
        x = document.documentElement.scrollLeft;
    }

    return { x, y };
}


function getOffset(elem) {
    if (elem.getBoundingClientRect) {
        // "правильный" вариант
        return getOffsetRect(elem)
    } else {
        // пусть работает хоть как-то
        return getOffsetSum(elem)
    }
}

function getOffsetSum(elem) {
    var top=0, left=0;
    while(elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent
    }

    return {top: top, left: left}
}

function getOffsetRect(elem) {
    // (1)
    var box = elem.getBoundingClientRect();

    // (2)
    var body = document.body;
    var docElem = document.documentElement;

    // (3)
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    // (4)
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

    // (5)
    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return {
        top: Math.round(top),
        left: Math.round(left)
    }
}
export default tag =>
    window.addEventListener('scroll',fadeNav(tag));