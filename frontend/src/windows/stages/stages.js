$(document).ready(() => 
{
    $(".menu-background > *").remove();
    
    //const cookie = document.cookie;
   
    const stages = [...parent.gameuser.stages].reverse();

    let result = `<div id="menu-header">
                    <div id="title"><strong>FASES</strong></div>
                    <span class="close">&times;</span>
                </div>
                <div id="content">`;
    stages.forEach((element, index) => {
        result += `<div id="stage-${index + 1}" class="stages">
                        <button id="btn-stage${index+1}" class="stageButton" stage="${element.stage + 1}">AULA ${element.stage + 1}</button>
                        <p> ${parseInt(element.highscore)} PONTOS</p>
                        <div class="potions">
                    `;
        const potions = element.potions;

        potions.forEach((e) => {
            result += `<img src="../../../images/${e.icon}" alt="${e.name}">`
        });
        result += `</div> 
                </div>`

    });
    result += `</div>`;
    
    $(".menu-background").html(result);


    //Clica na fase e faz algo
    $("button").on("click", (e) =>{
        /* console.log(e.target); */
        parent.audiosys.play("start");
        parent.gameuser.start(e.target.getAttribute("stage")-1);
        parent.modal.src = "";
    });
    //console.log(parent.gameuser.stages);
    /*parent.game.src = "modules/game/";
    parent.modal.src = "";*/
    $(".close").on("click", function() 
    {
        //console.log("Close");
        parent.modal.src = "modules/windows/main";
        parent.audiosys.play("close");
        //$(`#Modal`).css("display","none");
    });

});