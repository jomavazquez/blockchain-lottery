import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Web3 from "web3";
import smart_contract from "../abis/lottery.json";
import Navigation from "./Navbar";
import { showMessage } from "../helpers/utils";
import headerImg from "../assets/tickets.jpg"

class Lottery extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      loading: true,
      contract: null,
      errorMessage: ""
    }
  }  

  async componentDidMount() {
    await this.loadWeb3();
    try{
      const networkId = await window.ethereum.request({ method: 'net_version' });
      if( networkId != 80001){
        showMessage("warning", "Please connect your Metamask account to Polygon test for this project. Thank you");
      }
    }catch{
      showMessage("error", "It seems you're not in Polygon test network into your Metamask account.");
    }
    if( window.ethereum || window.web3 ){
      await this.loadBlockchainData();
    }
  }

  async loadWeb3() {
    if( window.ethereum ){
      window.web3 = new Web3( window.ethereum );
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }else if( window.web3 ){
      window.web3 = new Web3( window.web3.currentProvider );
    }else{
      showMessage('info', 'Browser not compatible. Please use Metamask to run this project!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    const networkId = await web3.eth.net.getId() 
    const networkData = smart_contract.networks[networkId]

    if( networkData ){
      const abi = smart_contract.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract( abi, address );
      this.setState({ contract });
    }else{
      showMessage('error', 'Smart Contract not deployed in the network!')
    }
  }

  _buyTickets = async (_numBoletos) => {
    try {
      await this.state.contract.methods.buyTickets(_numBoletos).send({
        from: this.state.account
      });
      showMessage('success', 'Payment successfully completed. Good luck!', `You've purchased ${ _numBoletos } tickets`);
    }catch( err ){
      this.setState({ errorMessage: err });
    }finally{
      this.setState({ loading: false });
    }
  }

  _priceTicket = async () => {
    try {
      const _price = await this.state.contract.methods.priceTicket().call();
      showMessage('info', `Ticket price:<br />${ _price } tokens (ERC-20)`);
    }catch( err ){
      this.setState({ errorMessage: err });
    }finally{
      this.setState({ loading: false });
    }
  }

  _yourTickets = async () => {
    try {
      const _boletos = await this.state.contract.methods.Boletos(this.state.account).call();
      let _ticketMsg = _boletos.toString();
      _ticketMsg = _ticketMsg.replaceAll(',', ', ');

      showMessage('info', 'Your tickets are:', _ticketMsg.trim());
    }catch( err ){
      this.setState({ errorMessage: err });
    }finally{
      this.setState({ loading: false });
    }    
  }

  render() {
    return (
      <div>
        <Navigation account={ this.state.account } />
        <img className="w-100" src={ headerImg } alt="Tickets managment" />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <Container>
                  <h3 className="mt-4 mb-2">Do you want to buy any ticket?</h3>
                  <form onSubmit={ (event) => {
                      event.preventDefault();
                      const cantidad = this._numBoletos.value;
                      this._buyTickets(cantidad);
                    }}>
                      <input type="number" name="amount_tickets" className="form-control mb-2" placeholder="Amount of tickets you want to buy..." ref={ (input) => this._numBoletos = input } />
                      <input type="submit" name="buy_now" className="btn btn-primary btn-md" value="Buy now" />
                    </form>
                    <Row className="mt-3">
                      <Col>
                        <h3 className="mt-3">Ticket Price</h3>
                        <form onSubmit={ (event) => {
                          event.preventDefault();
                          this._priceTicket();
                        }}>
                          <input type="submit" name="check_price" className="btn btn-danger btn-md" value="Check price!" />
                        </form>
                      </Col>
                      <Col>
                        <h3 className="mt-3">Your tickets</h3>
                        <form onSubmit={ (event) => {
                          event.preventDefault();
                          this._yourTickets();
                        }}>
                          <input type="submit" name="checkt_tickets" className="btn btn-success btn-md" value="Check tickets!" />
                        </form>
                      </Col>
                    </Row>
                </Container>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Lottery;