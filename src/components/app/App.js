import {Component, useEffect} from 'react';
import './App.css';
import logo from '../../resources/logo.svg';
import Services from '../../services/Services';


class App extends Component {
  state = {
    currencyOptions: [],
    fromCurrency: 0,
    toCurrency: 0,
    exchangeRate: null,
    amount: 1,
    amountInFromCurrency: true,
    usd: 0,
    eur: 0
  };

  services = new Services();


  componentDidMount () {
    this.services.getResource('https://api.exchangerate.host/latest')
    .then(res => {
      this.setHeaderCurrencies(res);
      this.setCurrencyOptons(res);
      this.setFromCurrency(res);
      this.setToCurrency(res);
      this.setExchangeRate(res);
    })
  }

  setHeaderCurrencies = (res) => {
    this.services.getResource('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
    .then(res => {
      this.setState({
        usd: res[0].buy.slice(0,5),
        eur: res[1].buy.slice(0,5)
      })
    })
  }

  setCurrencyOptons = (res) => {
    this.setState({currencyOptions: [res.base, ...Object.keys(res.rates)]})
  }

  setFromCurrency = (res) => {
    this.setState({fromCurrency: res.base})
  }

  setToCurrency = (res) => {
    this.setState({toCurrency: Object.keys(res.rates)[1]})
  }

  setAmount = (e) => {
    this.setState ({amount: e.target.value})
  }

  setAmountInFromCurrency = (isTrue) => {
    this.setState({amountInFromCurrency: isTrue})
  }

  setExchangeRate = (res) => {
    this.setState({exchangeRate: res.rates[Object.keys(res.rates)[1]]})
  }

  onSetFromCurrency = (e) => {
    this.setState({fromCurrency: e.target.value}, () => {
      this.services.getResource(`https://api.exchangerate.host/latest&base=${this.state.fromCurrency}&symbols=${this.state.toCurrency}`)
      .then(res => this.setState({exchangeRate: res.rates[this.state.fromCurrency]}))
    })
  }

  onSetToCurrency = (e) => {
    this.setState({toCurrency: e.target.value}, () => {
      this.services.getResource(`https://api.exchangerate.host/latest&base=${this.state.fromCurrency}&symbols=${this.state.toCurrency}`)
      .then(res => this.setState({exchangeRate: res.rates[this.state.toCurrency]}))
    })
  }

  handleFromAmountChange = (e) => {
    this.setAmount(e);
    this.setAmountInFromCurrency(true);
  }

  handleToAmountChange = (e) => {
    this.setAmount(e);
    this.setAmountInFromCurrency(false);
  }

  
  render () {
    const {fromCurrency, toCurrency, currencyOptions, amountInFromCurrency, exchangeRate, amount, eur, usd} = this.state;
    const options = currencyOptions.map(option => (<option key={option} value={option}>{option}</option>));
    let toAmount, fromAmount = null;

    if(amountInFromCurrency){
      fromAmount = amount;
      toAmount = amount * exchangeRate;
    } else {
      toAmount = amount;
      fromAmount = amount / exchangeRate;
    }

    return (
      <div className="App"> 
          <header>
            <div className="wrapper">
              <div className="logo"><img src={logo} alt="logo" /></div>
              <div className="currencies">
                <div id="eur">EUR = {eur}</div>
                <div id="usd">USD = {usd}</div>
              </div>
            </div>
          </header>
          <main className='wrapper'>
             <div className="converter">
              <div className='firstVal'>
                    <input type="number" value={fromAmount} onChange={this.handleFromAmountChange}/>
                    <select onChange={this.onSetFromCurrency} value={fromCurrency}>{options}</select>
                </div> 
                <div id="equals">=</div>
                <div className="secondVal">
                <input type="number" value={toAmount} onChange={this.handleToAmountChange}/>
                    <select onChange={this.onSetToCurrency} value={toCurrency}> {options}</select>
                </div>
             </div>
          </main>
      </div>
    )
  }
}

export default App;
