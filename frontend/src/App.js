import './App.css';
import React, {useState, useEffect} from 'react';
import Axios from 'axios';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [diet, setDiet] = useState('');
  const [newPassword, setNewPassword] = useState("");

  const [search, setSearch] = useState('');
  const [recipeList, setRecipeList] = useState([]);
  const [advQueryList1, setAdvQueryList1] = useState([]);
  const [advQueryList2, setAdvQueryList2] = useState([]);
  const [userList, setUserList] = useState([]);


  const deleteUser = (userId) => {
    Axios.delete(`http://localhost:3000/api/delete/${userId}`);
  };

  const updatePassword = (userId) => {
    Axios.post(`http://localhost:3000/api/post/update`, {
      userId: userId,
      password: newPassword
    });
  };

  const searchRecipe = () => {
    Axios.post('http://localhost:3000/api/post/ingredient', {
      search: search
    }).then((response) => {
      setRecipeList(response.data);
    });
  };


  const advQuery1 = () => {
    Axios.post('http://localhost:3000/api/post/advQuery1', {
      diet: diet
    }).then((response) => {
      setAdvQueryList1(response.data);
    });
  };

  const advQuery2 = () => {
    Axios.post('http://localhost:3000/api/post/advQuery2').then((response) => {
      setAdvQueryList2(response.data);
    });
  };


  const submitUser = () => {
    Axios.post('http://localhost:3000/api/insert', {
      firstName: firstName,
      lastName: lastName,
      password: password,
      carbs: carbs,
      protein: protein,
      fat: fat,
      diet: diet,
    })

    // setUserList([
    //   ...userList,
    //   {
    //     firstName: firstName,
    //     lastName: lastName,
    //     password: password
    //   },
    // ]);
  };

  const getRecentUser = () => {
    Axios.get('http://localhost:3000/api/get/recentUser').then((response) => {
      setUserList(response.data);
    });
  }

  return (
    <div className="App">
      <h1> Find Your Recipe! </h1>

      <div className="form">

        <h2> New User Info </h2>

        <h3> Personal Info </h3>
        <label> First Name </label>
        <input type="text" name="firstName" onChange={(e) => {
          setFirstName(e.target.value)
        } }/>
        <label> Last Name </label>
        <input type="text" name="lastName" onChange={(e) => {
          setLastName(e.target.value)
        } }/>
        <label> Password </label>
        <input type="text" name="password" onChange={(e) => {
          setPassword(e.target.value)
        } }/>

        <h3> Dietary Info </h3>
        <label> Carbs (carbs/low carbs) </label>
        <input type="text" name="carbs" onChange={(e) => {
          setCarbs(e.target.value)
        }} />
        <label> Protein (protein/high protein) </label>
        <input type="text" name="protein" onChange={(e) => {
          setProtein(e.target.value)
        }} />
        <label> Fat (fat/low fat)</label>
        <input type="text" name="fat" onChange={(e) => {
          setFat(e.target.value)
        } }/>

        <h3> Diet Restrictions (vegan, vegetarian, meat) </h3>
        <label> Please Select </label>
        <input type="text" name="diet" onChange={(e) => {
          setDiet(e.target.value)
        } }/>
        <button onClick={submitUser}> Submit </button>

        <h3> Get the most recent user </h3>
        <button onClick={getRecentUser}> Newest User </button>

        {userList.map((val) => {
          return (
            <div className = "card">
              <h1> User</h1>
              <h2> User ID: {val.userId} </h2>
              <h2> First Name: {val.firstName} </h2>
              <h2> Last Name: {val.lastName} </h2>
              <h2> Password: {val.password}</h2>
              <button onClick={() => { 
                deleteUser(val.userId) 
              }}> Delete </button>
              <input type="text" id="updateInput" onChange={(e) => {
                setNewPassword(e.target.value)
              } }/>
              <button onClick={() => {
                updatePassword(val.userId)
              }}> Update </button>
              </div>
          );
        })}

        <h2> Search for a Recipe by Ingredient </h2>
        <label> Enter an ingredient </label>
        <input type="text" name="search" onChange={(e) => {
          setSearch(e.target.value)
        }} />
        <button onClick={searchRecipe}> Search </button>

        {recipeList.map((val) => {
          return (
            <div className = "card">
              <h1> Recipe Name: {val.recipeName} </h1>
              <h2> Calories: {val.calories} </h2>
              <h2> Carbs: {val.carbs} </h2>
              <h2> Fat: {val.fat }</h2>
              <h2> Protein: {val.protein }</h2>
            </div>
          );
        })}


        <h2> Advanced Queries </h2>
        <label> After you have created an account and filled out your information, click these buttons to filter recipes by either nutritional preferences or dietary restrictions: </label>
        <button onClick={advQuery1}> Nutrition </button>
        <button onClick={advQuery2}> Diet Restriction </button>

        {advQueryList1.map((val) => {
          return (
            <div className = "card">
              <h1> Recipe Name: {val.recipeName} </h1>
              <h2> Calories: {val.calories} </h2>
              <h2> Carbs: {val.carbs} </h2>
              <h2> Fat: {val.fat }</h2>
              <h2> Protein: {val.protein }</h2>
            </div>
          );
        })}

        {advQueryList2.map((val) => {
          return (
            <div className = "card">
              <h1> Recipe Name: {val.recipeName} </h1>
              <h2> Calories: {val.calories} </h2>
              <h2> Carbs: {val.carbs} </h2>
              <h2> Fat: {val.fat }</h2>
              <h2> Protein: {val.protein }</h2>
            </div>
          );
        })}
        

      </div>
    </div>
  );
}

export default App;

// npm start