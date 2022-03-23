$(document).ready(() => 
{
    let potionActive;
    $(".this-potion").hide();
    let recipe = /* parent.gameuser ? parent.gameuser.book : */ [
        { "item":{"name": "poção da velocidade", "icon": "../../images/potions/1.png"}, "ingredients": [{"name": "Maracujá", "icon": "../../images/ingredients/1.png"}, {"name": "Alface", "icon": "../../images/ingredients/3.png"}, {"name": "Tomate", "icon": "../../images/ingredients/4.png"}], "desc": "Mesmo parecendo um escaravelho, esse estranho doce é feito de um açúcar mágico! É ótimo para gerar itens que mexam com os sentimentos!" },
        { "item":{"name": "poção da resistencia", "icon": "../../images/potions/2.png"}, "ingredients": [{"name": "Maracujá", "icon": "../../images/ingredients/1.png"}, {"name": "Alface", "icon": "../../images/ingredients/3.png"}, {"name": "Teia de Aranha", "icon": "../../images/ingredients/5.png"}], "desc": "Mesmo parecendo um escaravelho, esse estranho doce é feito de um açúcar mágico! É ótimo para gerar itens que mexam com os sentimentos!" },
        { "item":{"name": "poção da resistencia", "icon": "../../images/potions/3.png"}, "ingredients": [{"name": "Maracujá", "icon": "../../images/ingredients/1.png"}, {"name": "Alface", "icon": "../../images/ingredients/3.png"}, {"name": "Teia de Aranha", "icon": "../../images/ingredients/5.png"}], "desc": "Mesmo parecendo um escaravelho, esse estranho doce é feito de um açúcar mágico! É ótimo para gerar itens que mexam com os sentimentos!" },
        { "item":{"name": "poção da resistencia", "icon": "../../images/potions/4.png"}, "ingredients": [{"name": "Maracujá", "icon": "../../images/ingredients/1.png"}, {"name": "Alface", "icon": "../../images/ingredients/3.png"}, {"name": "Teia de Aranha", "icon": "../../images/ingredients/5.png"}], "desc": "Mesmo parecendo um escaravelho, esse estranho doce é feito de um açúcar mágico! É ótimo para gerar itens que mexam com os sentimentos!" },
        { "item":{"name": "poção da resistencia", "icon": "../../images/potions/5.png"}, "ingredients": [{"name": "Maracujá", "icon": "../../images/ingredients/1.png"}, {"name": "Alface", "icon": "../../images/ingredients/3.png"}, {"name": "Teia de Aranha", "icon": "../../images/ingredients/5.png"}], "desc": "Mesmo parecendo um escaravelho, esse estranho doce é feito de um açúcar mágico! É ótimo para gerar itens que mexam com os sentimentos!" },
        { "item":{"name": "poção da velocidade", "icon": "../../images/potions/6.png"}, "ingredients": [{"name": "Maracujá", "icon": "../../images/ingredients/1.png"}, {"name": "Alface", "icon": "../../images/ingredients/3.png"}, {"name": "Tomate", "icon": "../../images/ingredients/4.png"}], "desc": "Mesmo parecendo um escaravelho, esse estranho doce é feito de um açúcar mágico! É ótimo para gerar itens que mexam com os sentimentos!" },
        { "item":{"name": "poção da resistencia", "icon": "../../images/potions/7.png"}, "ingredients": [{"name": "Maracujá", "icon": "../../images/ingredients/1.png"}, {"name": "Alface", "icon": "../../images/ingredients/3.png"}, {"name": "Teia de Aranha", "icon": "../../images/ingredients/5.png"}], "desc": "Mesmo parecendo um escaravelho, esse estranho doce é feito de um açúcar mágico! É ótimo para gerar itens que mexam com os sentimentos!" }
    ];
    //console.log(recipe[0].ingredients[0].icon);

    function fillIngredients(){
        const recipeLength = recipe.length;
        let line = Math.ceil(recipeLength/4);
        let count = 4
        for(let j = 1; j < line+1; j++){
            $("#potion-stock").append(`<div id="potion-line${j}" class="potion-line">
            <div class="pot-position">
                <img id="pot${count-3}" class="this-potion">
            </div>
            <div class="pot-position">
                <img id="pot${count-2}" class="this-potion">
            </div>
            <div class="pot-position">
                <img id="pot${count-1}" class="this-potion">
            </div>
            <div class="pot-position">
                <img id="pot${count}" class="this-potion">
            </div>
        </div>`);
            $(".this-potion").hide();
            count += 4;
        }
        for(let i = 0; i < recipeLength; i++){
            $(`#pot${i+1}`).show();
            $(`#pot${i+1}`).attr("src", `/images/${recipe[i].item.icon}`);
            $(`#pot${i+1}`).attr("id", i);
        }
    }

    fillIngredients();

    $(".close").on("click", function() 
    {
        parent.modal.src = "";
        parent.audiosys.play("close");

    });

    /* $("body").on("click", function() 
    {
        console.log("Close");
        parent.modal.src = "";
        //$(`#Modal`).css("display","none");
    });
 */
    $("div.modal-background").on("click", function(e) 
    {
        console.log("On");
        e.stopPropagation();
        //$(`#Modal`).css("display","none");
    });

    function showInformation(){
        let potion = this.id;
        if(potionActive !== potion){
            potionActive = potion;
            console.log(recipe);
            $("#ingredients-description").html("");
            let recipeLength = recipe[potion].ingredients.length;
            console.log(recipeLength);
            $("#potion-description h3").html(recipe[potion].item.name);
            $("#potion-image").attr("src", `/images/${recipe[potion].item.icon}`);
            for(let i = 0; i < recipeLength; i++){
                $("#ingredients-description").append(`<img id="potion-${i}" class="this-potion" src="/images/${recipe[potion].ingredients[i].icon}">`);
            }
            $("#item-descp").html(`${recipe[potion].desc}`);
        }
    }
    
    $(".this-potion").on("click ",showInformation);

});