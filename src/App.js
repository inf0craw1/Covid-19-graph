import { ChartBoard } from './chart/ChartBoard';
import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [newData, setNewData] = useState(null);
  const date = new Date();
  const endCreateDt = date.getFullYear().toString() + (date.getMonth()+1 < 10 ? "0" + (date.getMonth()+1).toString() : (date.getMonth()+1).toString()) + ((date.getDate() < 10) ? "0" + date.getDate().toString() : date.getDate().toString());
  useEffect(() => {
     async function get(){
        axios
        .get(`/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?serviceKey=X%2Bd0hoRSjvUivUzV6FB6%2Ba%2ByWIKaSpvIbvkEH0RznfUCshFENP%2BAc6S8WHL5S5yDV75OUOTnCxbHh8Gk4PUWpg%3D%3D&pageNo=1&numOfRows=10&startCreateDt=20200101&endCreateDt=${endCreateDt}`)
        .then(response => {
           const items = response.data.response.body.items.item;
           let newData = [];
           for(let i = 0; i < items.length; i++){
              if(items[i].gubun === "합계"){
                 newData.push({ date: items[i].createDt.toString().split(" ")[0], newCovid: items[i].incDec});
              }
           }
           newData.reverse();
           setNewData(newData);
        }) 
        .catch(e => {
           console.error(e);
        })
     }
     get();
  }, [])
  
  return (
     <div className="App">
        <ChartBoard chartData={newData} width="500px" height="300px"></ChartBoard>
        {/* <BackgroundAnimate></BackgroundAnimate> */}
     </div>
  );
}

export default App;
