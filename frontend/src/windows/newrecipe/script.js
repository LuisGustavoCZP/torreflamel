import { waitFor } from "/static/scripts/timer.js";

/* $(document).ready(async () => 
{ */
    console.log("Estou rodando!")
    /* await WaitFor(() => 
    {
        if(window.gameuser.lastCreation) return true;
        else return false;
    }); */
    const lastCreation = parent.gameuser.lastCreation.result;
    const isUnlocking = parent.gameuser.lastCreation.status==1;
    console.log(lastCreation);
    /* const points = parseInt(window.gameuser.stages[stage].highscore);
    const item = window.gameuser.currentStage.potion.item; */
    //$("#title").html
    const title = document.getElementById("title");
    title.innerHTML = isUnlocking?`DESBLOQUEADO`:`RESULTADO`;
   
    $("#potion").html(`
        <img src="/images/${lastCreation.icon}" alt="${lastCreation.name}"/>
        <h3>${lastCreation.name}</h3>
        <p>${lastCreation.desc}</p>
    `);
    

    $("body").on("click", function() 
    {
        console.log("Close");
        parent.modal.src = "";
        //$(`#Modal`).css("display","none");
    });
/* }); */