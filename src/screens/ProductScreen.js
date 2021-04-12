import React from 'react';
import {Link} from 'react-router-dom';
import {getAnswers, getHeaders, string2currency, isUndefined} from '../utils';
import '../App.css';
class ProductScreen extends React.Component{
    
    constructor(props){
        super();
        this.state ={
            offers:[],
            totCost: props.match.params.totCost,
            downPayment: props.match.params.downPayment,
            term: props.match.params.term,
        }
    }

    /**
     * @returns a query based on the props values
     */
    getQuery(){
        const answers = getAnswers(this.props.match.params);
        const path = getHeaders().map((item, i) => 
            [item, answers[i]].join('=')).join('&');
        console.log(path)
        return path
    }

    /**
     * Fetches the response from the server to be shown on the screen.
     */
    componentDidMount(){
        fetch('http://localhost:8080/car-finance/get-offers?'+ this.getQuery())
        .then(response => response.json())
        .then(data => {
            var offers = [];
            if (!isUndefined(data.offers)) offers = data.offers;
            
            this.setState({
                offers: offers,
                message: data.message
            })
            if (!isUndefined(data.answersheet)) {
                this.setState({
                    totCost: data.answerSheet.totCost,
                    downPayment: data.answerSheet.downPayment,
                    term: data.answerSheet.term,
                })
            }
        });
    }
    /**
     * Convert the interest rate in decimals into integers.
     */
    formatInterestRate =(rate) => {
        return Math.round(rate * 100);
    }

    /**
     * Returns a HTML code for the interest rate adjustment information.
     * @param before: the interest rate before adjustment
     * @param after: the interest rate after adjustment
     * @returns a HTML code for the interest rate adjustment information.
     */
    getInterestAdjustment = (before, after) => {
        var adjustment = this.formatInterestRate(Number.parseFloat(after) - Number.parseFloat(before));
        return adjustment > 0 ? <li> Extra Interest Rate due to and/or car fuel type: {adjustment} % </li> : 
        (adjustment < 0 ? <li> Discount due to car and/or fuel type: {adjustment} % </li> : <label></label>)
    }

    /**
     * Generates and returns a HTML-code for a product(offer) card.
     * @param {G} item: the offer
     * @param {*} i: the index of the offer
     * @returns a HTML-code for the offer.
     */
    getCard = (item, i) => {
        return <div key = {i}>
            <button className="card">
            <h2 className = "header"> Product Name: {item.name.replace("_"," ")}</h2>
            <p> Annual Payment: {string2currency(item.annualPayment)}</p>
            <ul>
            <li> Car Price: {string2currency(this.state.totCost)} </li>
            <li> Down Payment: {string2currency(this.state.downPayment)} </li>
            <li> Loan Term: {this.state.term} years </li>
            
            <li> Interest Rate: {this.formatInterestRate(Number.parseFloat(item.interestRate))} % </li>
            <ul>
                {this.getInterestAdjustment(item.baseInterestRate, item.interestRate)}
            </ul>
            </ul>
            </button>
        </div>
    }

    /**
     * @returns the html code for the entire screen 
     */
    render(){
        return <div>
            <h2 className = "banner" style={{textAlign:"left"}}>
            <Link to={'/'+getAnswers(this.props.match.params).join("/")} 
            style={{ textDecoration: "none", color: "white" }}>
                    {"< Go Back"}</Link></h2>
            <h2 className="header">Message From the Bank</h2>
            <p style={{textAlign:"left"}}>{this.state.message}</p>
            <p className="small">Note: To alter your parameters or to revisit your choices, please click on the "Go Back" button to the upper left. To start over, please click on the "Start Over" button further down.</p>
            {this.state.offers.map((item, i) => this.getCard(item, i))}
            <button className ="card">
            <Link to={'/'}
             className ="card centred small" style={{ textDecoration: 'none'}}>
            <h2>Start Over</h2>
            </Link>
            </button>
        </div>
    }
}


export default ProductScreen;