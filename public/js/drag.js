const wrapper1 = document.querySelector(".wrapper1"),
header1 = wrapper1.querySelector(".header1");

const wrapper2 = document.querySelector(".wrapper2"),
header2 = wrapper2.querySelector(".header2");

function onDrag({movementX, movementY}){
    let getStyle = window.getComputedStyle(wrapper1);
    let leftVal = parseInt(getStyle.left);
    let topVal = parseInt(getStyle.top);
    wrapper1.style.left = `${leftVal + movementX}px`;
    wrapper1.style.top = `${topVal + movementY}px`;
}

function onDrag2({movementX, movementY}){
    let getStyle = window.getComputedStyle(wrapper2);
    let leftVal = parseInt(getStyle.left);
    let topVal = parseInt(getStyle.top);
    wrapper2.style.left = `${leftVal + movementX}px`;
    wrapper2.style.top = `${topVal + movementY}px`;
}

header1.addEventListener("mousedown", ()=>{
    header1.classList.add("active"); header1.addEventListener("mousemove", onDrag);
});

header2.addEventListener("mousedown", ()=>{
    header2.classList.add("active"); header2.addEventListener("mousemove", onDrag2);
});

document.addEventListener("mouseup", ()=>{
    header1.classList.remove("active"); header1.removeEventListener("mousemove", onDrag);
    header2.classList.remove("active"); header2.removeEventListener("mousemove", onDrag2);
});