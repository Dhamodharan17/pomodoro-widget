let mode = "focus";
let timer = null;

const display = document.getElementById("timer");

const focusInput = document.getElementById("focus");
const shortInput = document.getElementById("short");
const longInput = document.getElementById("long");

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


        if(seconds > 0){

            seconds--;

            update();

        }
        else{

            clearInterval(timer);

            timer = null;

            alert("Finished");

        }


    },1000);


}



function pause(){

    clearInterval(timer);

    timer = null;

}



function reset(){

    pause();

    seconds = getTime();

    update();

}



function update(){

    let minutes = Math.floor(seconds / 60);

    let sec = seconds % 60;


    display.textContent =
        `${String(minutes).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

}



// load initial timer

update();


async function openFloat(){

    if("documentPictureInPicture" in window){

        const pip = await documentPictureInPicture.requestWindow({
            width:250,
            height:180
        });


        pip.document.body.innerHTML = `

        <style>
        body{
            font-family:Arial;
            text-align:center;
            margin:0;
            padding:20px;
        }

        h1{
            font-size:50px;
        }

        </style>


        <h2>Pomodoro</h2>

        <h1 id="floatTimer">
        ${display.textContent}
        </h1>

        `;



        setInterval(()=>{

            let timer =
            pip.document.getElementById("floatTimer");


            if(timer){

                timer.textContent =
                display.textContent;

            }


        },500);



    }

    else{

        // fallback

        let win = window.open(
            "",
            "Pomodoro",
            "width=250,height=180,alwaysOnTop=yes"
        );


        win.document.write(`

        <body style="font-family:Arial;text-align:center">

        <h2>Pomodoro</h2>

        <h1 id="t">
        ${display.textContent}
        </h1>


        </body>


        `);



        setInterval(()=>{

            if(!win.closed){

                win.document
                .getElementById("t")
                .textContent =
                display.textContent;

            }


        },500);

    }

}