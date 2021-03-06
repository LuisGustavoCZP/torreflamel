$(document).ready(() => 
{

    $(".menu-background").on("click", (e) => {e.preventDefault(); e.stopPropagation();});
    $(".menu-background > *").remove();
   
    
    //const cookie = document.cookie;
    parent.gameuser.requestRanking((ranking) => 
    {
        let result = `<div id="menu-header">
                        <div id="title"><strong>CLASSIFICAÇÃO</strong></div>
                        <span class="close">&times;</span>
                    </div>
                    <div id="content">`;
        ranking.forEach((element, index) => {
            const id = index + 1;
            result += `<div id="place-${id}" class="places">
                            <p> #${id} - ${element.name}</p>
                            <p> ${parseInt(element.highscore)} PONTOS</p>
                        </div>`;
        });
        result += `</div>`;
        //console.log(result);
        
        $(".menu-background").append(result);


        function close () 
    {
        parent.modal.src = "windows/main";
        parent.audiosys.play("close");

    }
    $("body").on("click", close);
    $(".close").on("click", close);
    
        /* $(".close").on("click", function() 
        {
            //console.log("Close");
            parent.modal.src = "windows/main";
            parent.audiosys.play("close");
            //$(`#Modal`).css("display","none");
        }); */
    });

});