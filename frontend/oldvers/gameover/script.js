import { Request } from "../scripts/request.js";
$(document).ready(() => 
{
    $(".menu-background > *").remove();
    let userData = window.gameuser.data;

    let result = `<div id="title"><strong>Fim de Jogo!</strong></div>
                    <div id="content">
                        <div class="content-title"><strong>VOCÊ FEZ ${userData.points} PONTOS!</strong></div>
                        <div class="content-subtitle"><strong>MELHOR: ${userData.highscore} PONTOS</strong></div>
                        <div>
                            <button id="btn-restart"></button>
                            <button id="btn-home"></button>
                        </div>
                    </div>`;
    
    $(".menu-background > *").html(result);


    $("btn-restart").on("click", () => {
        // window.location.replace(`../game`);
    });

   $("btn-home").on("click", () => {
        // window.location.replace(`../menu`);
    });


  /*  $(".close").on("click", function() 
    {
        console.log("Close");
        parent.modal.src = "";
        //$(`#Modal`).css("display","none");
    });*/

});