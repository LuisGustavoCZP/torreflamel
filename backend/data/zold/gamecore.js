const user = require(`${__dirname}/user`);
const Database = require(`${__dirname}/database`);
const craft = require(`${__dirname}/craft`);
const jwt = require('jsonwebtoken');

const recipesecret = "R4kunN4-m4Tat4";


// função armazena a receita no usuário, e retorna pra o front {name: , icon: } da poção sorteada
function createRecipe (req, res){
    const user = user.get(req.userid);
    const potion = Database.sortPotion(user.stage);
    user.recipe = potion.recipe;
    res.json({name: potion.name, icon: potion.icon});
}


function sortItem (req, res){
    const user = user.get(req.userid);
    const lastRecipe = user.recipe? user.recipe : [];
    console.log(lastRecipe);
    const exclude = lastRecipe ? [lastRecipe[lastRecipe.length-1]] : [];
    const recipe = Database.randomItems(1, user.stock, exclude);
    lastRecipe.push(...recipe);
    user.recipe = recipe;

    res.json({recipe:Database.getItem(...lastRecipe)});
}


function checkRecipe (recipe, itens){
    for (let i = 0; i < Math.min(recipe.length, itens.length); i++){
        if(itens[i] != recipe[i]) return false;
    }
    return true;
}

function verifyRecipe (req, res){
    const user = user.get(req.userid);
    const response = req.body;
    console.log(response, user.recipe);
    if(checkRecipe(user.recipe, response)){
        user.points += 300*user.stage;
        user.stage++;
        if(user.points > user.highscore){
            user.highscore = user.points;
        }
        user.saveUsers();
        res.json({name:user.name, stage:user.stage, lives:user.lives, points:user.points, highscore:user.highscore});
    } 
    else if(user.lives >= 0){
        user.lives--;
        
        user.saveUsers();
        res.json(1);
    } 
    else if(user.lives == 0){
        res.json(2);
    }
    
}

function clearRecipe (req, res){
    const token = jwt.sign({recipe:[]}, cryptokey);
    res.cookie("recipeData", token);
}

// ranking() retorna as melhores pontuações como um objeto {classification: , name: , score: } 
function ranking(req, res){

   function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
   }
   const theBest = Number(req.params.top);
   
   if(isNumber(theBest)){

      if(Number.isInteger(theBest)){
         const ordened = user.users.sort((a,b) => b.highscore - a.highscore);
         const topRanking = ordened.map(function (element , index){
            if(index < theBest){
               return {classification: index+1 , name: element.name , highscore: element.highscore}
            }
         
         })
         topRanking.splice(theBest, topRanking.length - theBest);
         res.json(topRanking);
      }else{
         res.json("The router params is not a intenger");
      }
      
   }else{
      res.json("The router params is not a number");
   }
   
}

function randomSort(items) {
   const numero = items.length;
   return parseInt(Math.random() * numero);
}

// sortPotions retorna um objeto da poção sorteada no formato:
/* {
  icon: "resources/ingredients/Potion (2).png",
  id: 2,
  name: "Poção do Sumiço"
} */
function sortPotion(req, res) {

   const total_pots = [...potions];
   const potionID = randomSort(total_pots);
   const sorted_pots = total_pots[potionID];
   console.log(sorted_pots);
   return sorted_pots;
}

// retorna as poções e 
function userBook(req, res){
   const p = user.get(req.userid);
   const result = Database.getBook(p.stage);
   res.json(result);

}

/* async function stagePrepare (req, res)
{
    const user = users[req.session.userid];
    const stageid = req.query["stage"];
    const oStage = stages[stageid];
    const tempStage = 
    {
        stage:stageid,
        potion:oStage.potions[utility.randomSort(oStage.potions)],
        limitTime: oStage.time*1000,
    };
    user.currentStage = tempStage;

    const newStage = {...tempStage};
    newStage.potion = getRecipe(tempStage.potion);

    console.log(tempStage);
    res.json(newStage);
}

async function stageStart (req, res)
{
    const user = users[req.session.userid];
    const time = new Date().getTime();
    const cstage = user.currentStage;
    
    cstage.expiration = time + cstage.limitTime;

    res.json(cstage.expiration);
}

async function stageUpdate (req, res)
{
    const user = users[req.session.userid];
    const stage = user.currentStage;
    const time = new Date().getTime();
    const expectedResult = getItem(stage.potion).item;

    const timePass = stage.expiration - time;
    //console.log(timePass, `${time} - ${stage.limitTime}`);

    if(timePass <= 0) {
        res.json({status:1});
        return;
    }
    const r = result(req.body["items"]);
    //console.log(timePass, `${expectedResult} == ${r}`);
    if(!r) res.json({status:0});
    else 
    {
        const ritem = getItem(r);
        if(expectedResult == r) {
            st = 2;
            const points = nextStage(user, timePass);
            res.json({potion:{name:ritem.name, icon:ritem.icon}, points:points, status:2});
        } else {
            res.json({potion:{name:ritem.name, icon:ritem.icon}, status:0});
        }
        
    }
} */

module.exports =
{
    clearRecipe,
    createRecipe,
    verifyRecipe,
    sortItem,
    ranking,
    sortPotion,
    userBook,
    craft,
    user
};