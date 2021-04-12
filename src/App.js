import React, { Component } from 'react';
import './App.css';
import {Route,Switch} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';

class App extends Component {
  render() {
    return (
      <div className="App">
       <Switch>
        <Route exact path="/" component={HomeScreen}/>
        <Route exact path="/products/:channel/:carType/:fuelType/:totCost/:downPayment/:term" component={ProductScreen}/>
        <Route exact path="/:channel/:carType/:fuelType/:totCost/:downPayment/:term" component={HomeScreen}/>
        
       </Switch>
      </div>
    );
  }
}

export default App;
