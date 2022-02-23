import { Request } from "../../scripts/request.js";
import { SoundSys } from "../scripts/soundsys.js";
import { Animations } from "../scripts/animations.js";

/* Define as funções básicas do jogo */
class GameFunctions{
    gamePaused;
    gameMode;
    audio;
    animations;
    lives;
    score;
    itensAsked;
    cauldron;
    constructor()
    {
        /* Diz se o jogo está pausado */
        this.gamePaused = true;

        /* define o modo de jogo */
        this.gameMode = "";

        /* define o controlador de audio */
        this.audio = new SoundSys ();
        //console.log(this.audio);

        /* Define o objeto que governa as animações */
        this.animations = new Animations();
        console.log(this.animations);

        /* Conta as vidas */
        this.lives = 3;

        /* conta os pontos */
        this.score = 0;
        /* Itens necessários para fazer a poção */
        this.itensAsked = [];

        /* Itens que o jogador colocou no caldeirão */
        this.cauldron = [];

    };

    get isPaused ()
    {
        return this.gamePaused;
    }

    get gameMode ()
    {
        return this.gameMode;
    }

    /* Acontece quando o jogador acerta a sequencia de ingredientes */
    victory(){
        animations.removeAnimations();
        $("#potion").attr("src", `./assets/escolhidos/pocoes/${numberIngredients}.png`);
        numberIngredients = numberIngredients +1;
        actualLotery();
        setTimeout(showLotery ,2000);
    };
    
    /* Preenche as prateleiras de itens */
    fillShelves(){
        //console.log(cookie);
        Request.get("stock", 
        {params:document.cookie.replace("userData=", "")},
        data => 
        {
            console.log(data);
            const stock = data.stock;
            for(let i = 0; i < stock.length; i++){
                if(i < 3){
                    $("#itens-1").append(`<img src="${stock[i].icon}" id="${stock[i].id}" class="item">`)
                }
                else if(i < 6){
                    $("#itens-2").append(`<img src="${stock[i].icon}" id="${stock[i].id}" class="item">`)
                }
                else{
                    $("#itens-3").append(`<img src="${stock[i].icon}" id="${stock[i].id}" class="item">`)
                }
            }
        },
        error => 
        {
            console.log("Redirecionando para o login");
            window.location.replace(`../menu`);
        });
    };

    /* Sorteia os ingredientes que deverão se jogados no caudeirão
        Caso o IF não esteja comentado os ingredientes serão sorteados aleatóriamentes
    */
    lotery (){
        Request.get(this.gameMode, 
        {params:document.cookie.replace("userData=", "")},
        data => 
        {
            console.log(data);
            this.itensAsked = data.recipe;
            
            setTimeout(() => {this.showLotery()}, 1000);
            //.push(arrayCopia[sorteado]);
        },
        error => 
        {
            console.log("Redirecionando para o login");
            window.location.replace(`../menu`);
        });
    }
    /* lotery(){
        if(gameMode === "random"){
            itensAsked = [];
        }
        let arrayCopia = [...ITENS];
        let numero = arrayCopia.length - 1;
        for(let i = itensAsked.length; i < numberIngredients; i++){
            numero = arrayCopia.length - 1;
            let sorteado = parseInt(Math.random() * (numero - 0) + 0);
            while(i > 0 && arrayCopia[sorteado] === itensAsked[i-1]){
                sorteado = parseInt(Math.random() * (numero - 0) + 0);
            }
            itensAsked.push(arrayCopia[sorteado]);
        }
    }; */

    /* Contagem de vida */
    lifeCount(){
        if(this.lives > 1){
            this.animations.removeAnimations();
            $(`#life${lives}`).addClass("lostLife");
            this.lives = lives -1;
            this.cauldron = [];
            this.lotery();
            setTimeout(this.showLotery ,3500);
        }
        else{
            this.animations.removeAnimations();
            $(`#life${lives}`).addClass("lostLife");
            this.lives = lives -1;
            alert("GAME OVER");
        }
    }

    /* Esconde os ingredientes necessários após eles serem mostrados ao jogador */
    hideLotery(){
        $(".pedido").delay(2000).queue(function(next) {
            $(this).fadeOut();
            next();
        })
        /* $(`#${itensAsked[0].id}`).delay(2000).queue(function(next) {
            
        }) */
        setTimeout(() => {this.hideInDelay();}, 2000);
    }

    /* Faz os ingredientes brilharem */
    showLotery(){
        if(this.gamePaused){
            return false;
        }
        else{
            $("#pedido").remove();
            console.log(this.animations);
            this.animations.showShine(this.audio, this.itensAsked);

            setTimeout(() => {this.showInDelay();}, 1000);
            /* $("#client").delay(1000).queue(function (next) {
                this.execDelay(next);
            }); */
        }
    }

    showInDelay (next) {
        console.log(this.itensAsked);
        $(`#${this.itensAsked[this.itensAsked.length-1].id}`).addClass('itemShine');
        this.hideLotery();
        //next();
    }

    hideInDelay (next) {
        this.animations.hideShine();
        this.animations.removeAnimations();
        //next();
    }

    /* Adiciona os itens jogados no caldeirão em um array e no final compara se os itens jogados foram os corretos */
    potionMaking(valor){
        let quantity = cauldron.length;
        cauldron.push(ITENS[valor]);

        if(quantity === numberIngredients - 1){
            animations.removeAnimations();
            soundTremor.play();
            setTimeout(animations.finishedPotion, 50);
            const compareOrder= cauldron.find((v,i) => v !== itensAsked[i]);
            if(compareOrder === undefined){
                score += 500 * numberIngredients;
                $("#score").html(score);
                setTimeout(animations.mageVictory, 1000);
                setTimeout(animations.potionShine, 1000);
                setTimeout(potionSfx, 2000);
                setTimeout(gameSettings.victory , 4500);
                cauldron = [];
                return true;
            }
            else{
                setTimeout(animations.mageDefeat, 1000);
                setTimeout(wrongSfx, 1000);
                gameSettings.lifeCount();
            }
        }
        return false;
    }

    /* Ativa o modo de jogo aleatório */
    randomMode(){
        $("#modo-de-jogo").fadeOut("slow");
        $("#play").fadeIn("slow");
        this.gameMode = "recipe";
    }

    /* Ativa o modo de jogo sequencial */
    sequentialMode(){
        $("#modo-de-jogo").fadeOut("slow");
        $("#play").fadeIn("slow");
        this.gameMode = "item";
    }

    /* Começa o jogo */
    gameStart(){
        this.gamePaused = false;
        $("main").removeClass("blur");
        $("#play").fadeOut("slow");
        console.log(this.audio);
        this.audio.musicPlay();
        this.lotery();
    };

    /* Pausa o jogo */
    pauseGame(){
        this.gamePaused = true;
        clearTimeout(showLotery);
        animations.removeAnimations();
        $("main").addClass("blur");
        $("#play").fadeIn("slow");
        this.audio.music.pause();
    };
}

export { SoundSys, Animations, GameFunctions };