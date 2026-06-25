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
    display.textContent = `${String(minutes).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

update();

async function openFloat(){
    if(!("documentPictureInPicture" in window)){
        alert("Use Chrome/Edge");
        return;
    }

    const pip = await documentPictureInPicture.requestWindow({
        width: 220,
        height: 110,
        preferInitialWindowPlacement: true
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
        justify-content: center;
        align-items: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.1;
        container-type: inline-size;
        padding: 6px 4px; /* Added slight top/bottom padding to prevent header clipping */
        position: relative;
    }

    #mode {
        font-size: 6cqw; /* Slightly adjusted to balance beautifully with the timer */
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 2px;
        opacity: 0.75;
    }

    #time {
        font-size: 16cqw; /* Reduced slightly from 20 to give it clean breathing room */
        font-weight: 800;
        font-variant-numeric: tabular-nums;
    }

    /* Invisible click-to-fit trigger area in the top-right corner */
    #compact-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 40px;
        height: 40px;
        background: transparent;
        border: none;
        cursor: pointer;
        z-index: 10;
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

    <button id="compact-btn" title="Click to fit size"></button>
    <div id="mode"></div>
    <div id="time">${display.textContent}</div>
    `;

    pip.document.getElementById("compact-btn").addEventListener("click", () => {
        window.resizeTo(250, 95); 
        pip.resizeTo(250, 95);
    });

    function sync(){
        let modeEl = pip.document.getElementById("mode");
        let timeEl = pip.document.getElementById("time");

        if(modeEl && timeEl) {
            modeEl.textContent = mode === "focus" ? "Focus" : "Break";
            timeEl.textContent = display.textContent;
        }

        pip.document.body.className = mode === "focus" ? "focus" : "break";
    }

    sync();
    setInterval(sync, 500);
}

function moveToNextMode(){
    if(mode === "focus"){
        completedCycles++;
        let total = Number(cycleInput.value);
        if(completedCycles >= total){
            mode="long";
            completedCycles=0;
        } else {
            mode="short";
        }
    } else if(mode==="short"){
        mode="focus";
    } else if(mode==="long"){
        mode="focus";
    }
    seconds = getTime();
    update();
}