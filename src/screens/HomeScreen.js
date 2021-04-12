import React from 'react';
import { getAnswers, getUserFriendlyHeaders, isUndefined} from '../utils';
import '../App.css';
import NumberFormat from 'react-number-format';
class HomeScreen extends React.Component{

    constructor(props){
        super();
        var predefinedAnswers = getAnswers(props.match.params);
        this.state = {
            channels: [],
            carTypes: [],
            fuelTypes: [],
            channel: predefinedAnswers[0],
            carType: predefinedAnswers[1],
            fuelType: predefinedAnswers[2],
            totCost:predefinedAnswers[3],
            downPayment:predefinedAnswers[4],
            term:predefinedAnswers[5],
            warning: "Please provide your answers below. Please note that only integer inputs are allowed. For any special case, please contact the bank."
        }
    }

    /**
     * Fetches categorical options from the server once mounted
     */
    componentDidMount(){
        fetch("http://localhost:8080/car-finance")
        .then(response => response.json())
        .then(data => {
            this.setState({
                channels: data.channels,
                carTypes: data.carTypes,
                fuelTypes: data.fuelTypes,
                channel: this.checkPreviousAnswer(this.state.channel, data.channels),
                carType: this.checkPreviousAnswer(this.state.carType, data.carTypes),
                fuelType: this.checkPreviousAnswer(this.state.fuelType, data.fuelTypes),
                totCost: this.checkPreviousAnswer(parseInt(this.state.totCost), []),
                downPayment: this.checkPreviousAnswer(parseInt(this.state.downPayment), []),
                term:this.checkPreviousAnswer(parseInt(this.state.term), []),
            })
        });
    }

    /**
     * Checks if previous inputs exists, return it if there is one. Use the 
     * default value if it does not.
     */
    checkPreviousAnswer =(previousInput, defaultValues)=>{
        return isUndefined(previousInput) ? defaultValues[0] : previousInput;
    }

    /**
     * Redirects the user to the product screen provided the answers are not empty. 
     * Uses parseAnswers() to parse and warn for empty answers.
     */
    handleSubmit = () => {
        const answersParsed = this.parseAnswers()
        if (answersParsed.length > 0){
            this.props.history.push('/products/'+answersParsed.join('/'));
        }
    }
    
    /**
     * Parses and returns the answers to an array of strings, warns the user
     * and returns an empty array if there exists any empty undefined answer.
     */
    parseAnswers =()=>{
        var emptyAnswers = [];
        var headers  = getUserFriendlyHeaders();
        var answersParsed = []
        getAnswers(this.state).forEach((item, i)=>{
            if (isUndefined(item)) {
                emptyAnswers.push(headers[i].toLowerCase());
            }
            else answersParsed.push(item);
        });
        if (emptyAnswers.length > 0){
            this.setState({
                warning: "Please provide the " + emptyAnswers.join(", ") + ". "
            });
            return [];
        } else return answersParsed;
    }

    /**
     * Creates a HTML code for an radio entry
     * @param key: the field name
     * @param li: the list of field values as options.
     * @param placeholder: a placeholder to store the selected option.
     * @param setter: a call back function to store the selected option as a state value
     * @returns a div with radio entry.
     */
    getRadioEntry = (key, li, placeholder, setter) => {
        return <div> <span> {key}: </span> {li.map((item, i) =>
                <label key = {item}>
            <input type="radio"
                key = {item}
                name={key}
                value={item}
                checked = {placeholder === item}
                onChange={setter}

            /> {item.replaceAll('_',' ')} </label>)}
            </div>
    }

    /**
     * Creates and returns a HTML code for a number entry
     * @param header: the field name
     * @param placeholder: a placeholder to store the selected option.
     * @param setter: a call back function to store the selected option as a state value
     * @param unit: the unit of the field.
     * @returns a div with a number entry.
     */
    getNumberEntry = (header, placeholder, setter, unit) => {
        return <div><span className = "header"> {header}: </span>
        <NumberFormat format="### ###"
        type ="text" name = {header}
        value={parseInt(placeholder, 10)}
        onChange={
            (event) =>{
            var value = parseInt(event.target.value.replaceAll(/[^0-9]/g, ""),0);
            setter(isNaN(value)? "0":value)}}
        /> <label>{unit}</label>
        </div>
    }
    
    /**
     * @returns the html code for the entire screen 
     */
    render(){
        return <div>
            <h2 className = "banner">Welcome To Car Finance</h2>
            <button className = "card">{this.state.warning}</button>
         
            <form className = "form">
                {this.getRadioEntry("Channel", this.state.channels, this.state.channel, 
                (event)=> { this.setState({channel:event.target.value});})}
                {this.getRadioEntry("Car Type", this.state.carTypes, this.state.carType,
                (event)=> { this.setState({carType:event.target.value});})}
                {this.getRadioEntry("Fuel Type", this.state.fuelTypes, this.state.fuelType,
                (event)=> { this.setState({fuelType:event.target.value});})}
                {this.getNumberEntry("Car Price", this.state.totCost, (value) => {this.setState({totCost: value});}, "kr")}
                {this.getNumberEntry("Down Payment", this.state.downPayment, (value) => this.setState({downPayment: value}), "kr")}
                {this.getNumberEntry("Loan Term", this.state.term, (value) => this.setState({term: value}), "years")}
            </form>
            <button className = "card" onClick={this.handleSubmit.bind(this)}>Submit</button>
           
        </div>
    }
}

export default HomeScreen;