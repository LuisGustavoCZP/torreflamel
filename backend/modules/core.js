const player = require(`${__dirname}/users/player.js`);
const database = require(`${__dirname}/database/database.js`);
const utility = require(`${__dirname}/utility`);
const users = player.users;
const path = __dirname.replace("modules", "");
const fs = require('fs');

function getStock (user)
{
   console.log(user.unlockedItems);
   const t = database.fromID(...user.unlockedItems);
   console.log(t);
   return t;
}

function getBook (user)
{
    let total = database.fromID(...user.unlockedRecipes);
    //console.log(total);
    if(!total.length){
       total = [total];
    }
    return total;
}

function getRecipe (recipeID)
{
    const ps = getItem(recipeID);
    const is = [];
    ps.ingredients.forEach(i => {
        const r = getItem(i);
        is.push({item:r.name, icon:r.icon});
    });
    const itm = getItem(ps.item);
    return {item:{"name":itm.name, "icon":itm.icon}, "ingredients":is};
}

// função que retorna o livro para o usuário
function book (req, res)
{
   const p = users[req.session.userid];
   const unlockedRecipes = getBook(p);
   const itemsArray = database.itemArray
   const recipeArray = database.recipeArray;
   console.log("aqui esta", unlockedRecipes);
   

    // relaciona as tabelas dos itens do livro com os itens totais
  const resultForBook = [];
  
  unlockedRecipes.forEach((element)=>{
     itemsArray.forEach((el)=>{
        
        if(element.item === el.id){
           let rcpArr = element.ingredients;
           rcpArr = forItemArray(rcpArr);
           
           //resultForBook.push({name: el.name, icon: el.icon, desc: el.desc, recipe:rcpArr});

           resultForBook.push({item:{name: el.name, icon: el.icon, desc: el.desc}, ingredients: rcpArr})
         }
      })
      
   })
   res.json({resultBook: resultForBook, totalRecipes: recipeArray.length});
}

function forItemArray(array){
   const itemsArray = database.itemArray
   const dataIngredients = [];
   array.forEach((item)=>{
      itemsArray.forEach((el)=>{
         if(el.id === item){
            dataIngredients.push({name: el.name, icon: el.icon, desc: el.desc})
         }
      })
    })
    return dataIngredients;
}

function stock (req, res)
{
    const p = users[req.session.userid];
    console.log(`STOCK USER: ${req.session.userid} = ${p.id}`);
    const sts = getStock(p);
    console.log("STOCK FOR:", p.name, p.unlockedRecipes, sts.length);
    res.json(sts);
}

function possibleRecipes (user)
{
   return database.recipeArray.filter((recipe) => 
   {
      if(user.unlockedRecipes.includes(recipe.id))
      {
         return false;
      }
      //console.log(user.level, recipe.level);
      if(user.level < recipe.level){

         return false;
      }
      /* let hasIt = 0;
      user.unlockedItems.forEach((c) => 
      {
         if(!recipe.ingredients.includes(c)) 
         {
            hasIt ++;
         };
      }); */
      return true;
   });   
}

//insere um novo item na receita caso ele ainda não tenha sido descoberto
function verifyUnlockedRecipes(user, recipe){
   let isUnlocked = false;
   const p = user;
   const recipeArray = database.recipeArray;

   /* const recipeId = recipeArray.filter((element)=>{
      if(element.id === recipe.id){
         return true;
      }
   }) */

   let recipesOnBook = getBook(p);
   if(!recipesOnBook) recipesOnBook = [];
   if(!recipesOnBook.length) recipesOnBook = [recipesOnBook];
   const checkItem = recipesOnBook.filter((element)=>{
      if(element.id === recipe.id){
         return true;
      }
   })

   if(JSON.stringify(checkItem) === "[]"){
      console.log(`Add ${p.name} to ${recipe.id}`);
      p.unlockedRecipes.push(recipe.id);
      p.unlockedItems.push(recipe.item);
      p.points += Math.pow(recipe.level, 2) * 100;
      if(p.level < recipe.level) p.level = recipe.level;
      player.addRank(p);
      isUnlocked = true;
   }

   //verificar o status está sempre retornado como false
   //falta reescrever o arquivo do usuário corretamente
   player.save(p.id);
   return isUnlocked;
}

function verifyRecipe(req, res){
   const receivedItems = req.body["items"];
   const p = users[req.session.userid]
   const receivedItemsLength = receivedItems.length;
   
   //console.log("received = " + receivedItems);

   //verifica se está recebendo o array no formato correto
   if(typeof(receivedItems) === "object" && receivedItemsLength === 2){
      //console.log("feito");
      const craft = database.result(receivedItems);
      
      
      // verifica se o craft existe
      if(craft)
      {
         const crafted = craft.id;
         const craftedItem = craft.item;
        //console.log(crafted + "feito");
         /* const itemsArray = JSON.parse(fs.readFileSync(`${__dirname}/database/data/ingredients.json`));
         const infoCrafted = itemsArray.filter((element)=>{
            if(element === crafted){
               return true;
            }
         }) */
         const infoCrafted = database.getItem(craftedItem);
         const result = {
            result: infoCrafted,
            status: verifyUnlockedRecipes(p, craft) ? 1 : 0
         };

         res.json(result);
      }else{
         const result = {
            status: 0
         }
         res.json(result)
      }
      
   }else{
        /* res.status(404); */
      res.json({status:0});
   }
}

function randomDialog (req, res) 
{
   res.json(utility.randomOf(database.dialogs));
}

function randomTip (req, res) 
{
   const user = users[req.session.userid]
   const ps = possibleRecipes(user);
   //console.log("tip: ", ps);
   if(ps && ps.length)
   {
      const d = utility.randomOf(ps);
      const ingIcons = d.ingredients.map((curr) => database.getItem(curr).icon);
      const tip = {
         "text":"Dica: {i0} + {i1} = ?",
         "icons":[...ingIcons, database.getItem(d.item).icon],
         "click": false
      }
      res.json(tip);
   } else {
      res.json({});
   }
}

//
module.exports = {
    player,
    database,
    book,
    stock,
    verifyRecipe,
    randomDialog,
    randomTip
  /*   stagePrepare,
    stageStart,
    stageUpdate */
}