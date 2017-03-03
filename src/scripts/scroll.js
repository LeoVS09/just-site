import smoothScroll from 'smoothscroll-polyfill'

smoothScroll.polyfill();

function scrollTo(hash){
    document.querySelector('.' + hash).scrollIntoView({ behavior: 'smooth' });
}
Array.from(document.querySelectorAll(".nav-button")).forEach(el =>
    el.addEventListener('click', () => scrollTo(el.id))
);

document.querySelector(".scrollto").addEventListener('click', () => scrollTo("about"));