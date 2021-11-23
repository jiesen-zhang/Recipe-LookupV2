const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

var db = mysql.createConnection({
  host: '34.132.46.65',
  user: 'root',
  password: 'JumpingJaks!123',
  database: 'cs411team33',
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// app.get('/products/:id', function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for all origins!'})
// })

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})


app.post("/api/insert", (require, response) => {
  const firstName = require.body.firstName;
  const lastName = require.body.lastName;
  const password = require.body.password;
  const carbs = require.body.carbs;
  const protein = require.body.protein;
  const fat = require.body.fat;
  const diet = require.body.diet; // Will diet be a string?
  let insertRestrictions;


  const insertUser = "INSERT INTO User (firstName, lastName, password) VALUES (?,?,?)";
  const insertDiet = "INSERT INTO `Preferences` (`userId`,`fatPref`, `carbsPref`, `proteinPref`) VALUES (?,?,?,?)";
  if(diet.toLowerCase() == "vegetarian"){
    insertRestrictions = "INSERT INTO `DietRestrictions` (`userId`,`isVegetarian`, `isNotVegetarian`, `isVegan`) VALUES (?,1,0,0)";
  } else if(diet.toLowerCase() == "vegan"){
    insertRestrictions = "INSERT INTO `DietRestrictions` (`userId`,`isVegetarian`, `isNotVegetarian`, `isVegan`) VALUES (?,0,0,1)";
  } else {
    insertRestrictions = "INSERT INTO `DietRestrictions` (`userId`,`isVegetarian`, `isNotVegetarian`, `isVegan`) VALUES (?,0,1,0)";
  }

  db.query(insertUser,[firstName, lastName, password], (err, result) => {
    console.log(err);
    console.log("UserId" + result.insertId);
    uid = result.insertId;
    db.query(insertDiet, [result.insertId, fat, carbs, protein], (err, result) => {
      console.log(err);
      // console.log("SUCCESS!")
    })

    db.query(insertRestrictions, [result.insertId], (err, result) => {
      console.log(err);
    })
  })
});

app.get("/api/get/recentUser", (require, response) => {
  const getUser = "Select * from User where userId = (select max(userId) from User);";

  db.query(getUser, (err, result) => {
    console.log(result);
    response.send(result)
  });
});

app.post("/api/post/advQuery1", (require, response) => {
  const diet = require.body.diet;
  console.log("Diet Parameter: " + diet);
  let advQuery1;

  // Query #1
  if(diet.toLowerCase() == "vegetarian"){
    advQuery1 = "(SELECT r.recipeId, r.recipeName, r.calories, r.carbs, r.fat, r.protein, SUM(CASE WHEN info.ingIsVegan = 1 THEN 1 else 0 end) as veganCount, SUM(CASE WHEN info.ingIsVegetarian = 1 THEN 1 else 0 end) as vegCount, SUM(CASE WHEN info.ingIsMeat = 1 THEN 1 else 0 end) as nonvegCount FROM Recipes r INNER JOIN Ingredients i ON r.recipeId = i.recipeId INNER JOIN IngInfo info ON i.ingredientName = info.ingredientName GROUP BY r.recipeId HAVING nonvegCount = 0)";
  } else if(diet.toLowerCase() == "vegan"){
    advQuery1 = "(SELECT r.recipeId, r.recipeName, r.calories, r.carbs, r.fat, r.protein, SUM(CASE WHEN info.ingIsVegan = 1 THEN 1 else 0 end) as veganCount, SUM(CASE WHEN info.ingIsVegetarian = 1 THEN 1 else 0 end) as vegCount, SUM(CASE WHEN info.ingIsMeat = 1 THEN 1 else 0 end) as nonvegCount FROM Recipes r INNER JOIN Ingredients i ON r.recipeId = i.recipeId INNER JOIN IngInfo info ON i.ingredientName = info.ingredientName GROUP BY r.recipeId HAVING nonvegCount = 0 AND veganCount != 0)";
  } else {
    advQuery1 = "(SELECT r.recipeId, r.recipeName, r.calories, r.carbs, r.fat, r.protein, SUM(CASE WHEN info.ingIsVegan = 1 THEN 1 else 0 end) as veganCount, SUM(CASE WHEN info.ingIsVegetarian = 1 THEN 1 else 0 end) as vegCount, SUM(CASE WHEN info.ingIsMeat = 1 THEN 1 else 0 end) as nonvegCount FROM Recipes r INNER JOIN Ingredients i ON r.recipeId = i.recipeId INNER JOIN IngInfo info ON i.ingredientName = info.ingredientName GROUP BY r.recipeId)";
  }

  db.query(advQuery1, (err, result) => {
    response.send(result)
  });
});

app.post("/api/post/advQuery2", (require, response) => {
  // Query #2
  const advQuery2 = "SELECT r.recipeId, r.recipeName, r.calories, r.carbs, r.fat, r.protein FROM Recipes r WHERE (r.carbs <= CASE WHEN (Select p.carbsPref from Preferences p natural join User u where u.userId IN (select max(userId) from User)) LIKE 'Low Carbs' THEN 200 ELSE 10000 end) AND (r.fat <= CASE WHEN (Select p.fatPref from Preferences p natural join User u where u.userId IN (select max(userId) from User)) LIKE 'Low Fat' THEN 125 ELSE 10000 end) AND (r.protein >= CASE WHEN (Select p.proteinPref from Preferences p natural join User u where u.userId IN (select max(userId) from User)) LIKE 'High Protein' THEN 180 ELSE 0 end)";
  db.query(advQuery2, (err, result) => {
    response.send(result)
  });
});


app.post("/api/post/ingredient", (require, response) => {
  const search = require.body.search;
  console.log("Ingredient: " + search);
  const searchQuery = "SELECT r.recipeId, r.recipeName, r.calories, r.carbs, r.fat, r.protein FROM Recipes r NATURAL JOIN Ingredients I WHERE I.ingredientName = ?";
  const basicQuery = "SELECT * FROM Ingredients WHERE ingredientName = ?"

   db.query(searchQuery, [search], (err, result) => {
    // console.log(result)
    response.send(result)
  });
});


app.get("/api/get", (require, response) => {
  // previous code
  const sqlSelect = "SELECT userId, firstName, lastName, password FROM `User`";
  console.log("and not here");
  db.query(sqlSelect, (err, result) => {
      response.send(result);
  });
});

app.delete("/api/delete/:userId", (require, response) => {
  const delId = require.params.userId;
  console.log("This is the delId " + delId);

  const sqlDelete = "DELETE FROM `User` WHERE `userId`= ?";
  db.query(sqlDelete, delId, (err, result) => {
    console.log(err);
  })
});

app.post("/api/post/update", (require, response) => {
  const userId = require.body.userId;
  const password = require.body.password;

  console.log("This is user, password: " + userId + " " + password);

  const sqlUpdate = "UPDATE `User` SET `password` = ? WHERE `userId`= ?";
  db.query(sqlUpdate, [password, userId], (err, result) => {
    console.log("Success?");
    if (err) 
    console.log(err);
  })
});

app.listen(3000, () => {
  console.log("running on port 3000");
})

// node index.js

