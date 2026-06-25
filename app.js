let mode = "focus";
let timer = null;

const display = document.getElementById("timer");

const focusInput = document.getElementById("focus");
const shortInput = document.getElementById("short");
const longInput = document.getElementById("long");
const cycleInput = document.getElementById("cycles");


let completedCycles = 0;

let seconds = Number(focusInput.value) * 60;



function setMode(value){

    mode = value;

    reset();

}



function getTime(){

    if(mode === "focus"){
        return Number(focusInput.value) * 60;
    }


    if(mode === "short"){
        return Number(shortInput.value) * 60;
    }


    return Number(longInput.value) * 60;

}





function start(){

    if(timer !== null){
        return;
    }


    timer = setInterval(()=>{


        seconds--;

        update();


        if(seconds <= 0){


            clearInterval(timer);

            timer = null;


            moveToNextMode();


            start();

        }


    },1000);

}





function pause(){

    clearInterval(timer);

    timer = null;

}





function reset(){

    pause();

    completedCycles = 0;

    seconds = getTime();

    update();

}





function update(){


    let minutes = Math.floor(seconds / 60);

    let sec = seconds % 60;


    display.textContent =
    `${String(minutes).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

}



update();






async function openFloat(){

if(!("documentPictureInPicture" in window)){
    alert("Use Chrome/Edge");
    return;
}

// We request a standard size, but the CSS below will handle the packing
const pip = await documentPictureInPicture.requestWindow({
    width: 280,
    height: 140
});

pip.document.body.innerHTML = `
<style>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

body {
    display: flex;
    flex-direction: column;
    justify-content: center; /* Vertically centers the entire block */
    align-items: center;    /* Horizontally centers everything */
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    padding: 4px;           /* Minimal padding so text hugs the window edges */
}

/* Container to tightly pack the label and timer together */
.scaler {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

#mode {
    font-size: 5.5vw;        /* Scales dynamically based on window width */
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: -2px;     /* Pulls the clock even closer to the text */
    opacity: 0.8;
}

#time {
    font-size: 17vw;         /* Massive fluid scaling to absorb all whitespace */
    font-weight: 800;
    line-height: 0.9;        /* Tightens vertical space around the numbers */
    font-variant-numeric: tabular-nums;
}

.focus {
    background: #ffe5e5;
    color: #b91c1c;
}

.break {
    background: #e5ffe8;
    color: #15803d;
}
</style>

<div class="scaler">
    <div id="mode"></div>
    <div id="time">${display.textContent}</div>
</div>
`;

function sync(){
    let modeEl = pip.document.getElementById("mode");
    let timeEl = pip.document.getElementById("time");

    modeEl.textContent = mode === "focus" ? "Focus" : "Break";
    timeEl.textContent = display.textContent;

    pip.document.body.className = mode === "focus" ? "focus" : "break";
}

sync();
setInterval(sync, 500);

}






function moveToNextMode(){



if(mode === "focus"){


completedCycles++;


let total =
Number(cycleInput.value);



if(completedCycles >= total){


mode="long";

completedCycles=0;


}
else{


mode="short";


}



}

else if(mode==="short"){


mode="focus";


}


else if(mode==="long"){


mode="focus";


}



seconds = getTime();

update();


}