import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Web3 from "web3";
import smart_contract from "../abis/lottery.json";
import Navigation from "./Navbar";
import MyCarousel from "./Carousel";
import { showMessage } from "../helpers/utils";

class Tokens extends Component {

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
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    const networkId = await web3.eth.net.getId();
    const networkData = smart_contract.networks[ networkId ];

    

    if( networkData ){
      const abi = smart_contract.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract( abi, address );
      this.setState({ contract });
    }else{
      showMessage('error', 'Smart Contract not deployed in the network!')
    }
  }

  _balanceTokens = async () => {
    try{
      const _balance = await this.state.contract.methods.balanceTokens(this.state.account).call();
      showMessage('info', 'User tokens balance:', _balance );
    }catch( err ){
      this.setState({ errorMessage: err });
    }finally{
      this.setState({ loading: false });
    }
  }

  _balanceTokensSC = async () => {
    try{
      const _balanceTokensSC = await this.state.contract.methods.balanceTokensSC().call();
      showMessage('info', 'Smart Contract token balance:', `${ _balanceTokensSC } tokens`);
    }catch( err ){
      this.setState({ errorMessage: err });
    }finally{
      this.setState({ loading: false });
    }
  }

  _balanceEthersSC = async () => {
    try{
      const _balanceEthersSC = await this.state.contract.methods.balanceEthersSC().call();
      showMessage('info', 'Smart Contract ether balance:', `${ _balanceEthersSC } ethers`);
    }catch( err ){
      this.setState({ errorMessage: err });
    }finally{
      this.setState({ loading: false });
    }
  }

  _buyTokens = async ( _numTokens ) => {
    try{
      const web3 = window.web3;
      const ethers = web3.utils.toWei(_numTokens, 'ether');
      await this.state.contract.methods.buyTokens(_numTokens).send({
        from: this.state.account,
        value: ethers
      });
      showMessage('success', 'Token purchase done!', `You've purchased ${ _numTokens } tokens worth ${ ethers / 10**18} ether/s`);
    }catch( err ){
      this.setState({ errorMessage: err });
    }finally{
      this.setState({ loading: false });
    }
  }

  _refundTokens = async ( _numTokens ) => {
    try{
      await this.state.contract.methods.returnTokens(_numTokens).send({
        from: this.state.account
      });
      showMessage('warning', 'Tokens ERC-20 refund!', `${ _numTokens } tokens have been refunded`);
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
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                  <h1 className="m-3">Tokens ERC-20 managment</h1>
                  <Container>
                    <Row>
                      <Col>
                        <h3>User's<br />Tokens</h3>
                        <form onSubmit={ (event) => {
                          event.preventDefault();
                          this._balanceTokens();
                        }}>
                          <input type="submit" name="tokens_user" className="btn btn-block btn-success btn-sm" value="Get balance" />
                        </form>
                      </Col>
                      <Col>
                        <h3>SC's<br />Token</h3>
                        <form onSubmit={ (event) => {
                          event.preventDefault();
                          this._balanceTokensSC();
                        }}>
                          <input type="submit" name="sc_balance" className="btn btn-block btn-info btn-sm" value="Get balance (SC)" />
                        </form>
                      </Col>
                      <Col>
                        <h3>Ethers<br />SC</h3>
                        <form onSubmit={ (event) => {
                          event.preventDefault();
                          this._balanceEthersSC();
                        }}>
                          <input type="submit" name="ethers_balance" className="btn btn-block btn-danger btn-sm" value="Get balance (SC) ethers" />
                        </form>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h3 className="mt-5 m-3"><strong>Tokens purchase</strong></h3>
                        <form onSubmit={ (event) => {
                          event.preventDefault();
                          const cantidad = this._numTokens.value;
                          this._buyTokens(cantidad);
                        }}>
                        <input type="number" name="tokens_amount" className="form-control mb-1" placeholder="I would like to buy (x) tokens ..." ref={ (input) => this._numTokens = input } />
                        <input type="submit" name="tokens_buy" className="btn btn-block btn-primary btn-sm" value="Buy now!" />
                        </form>
                        <h3 className="mt-5 m-3"><strong>Tokens refund</strong></h3>
                        <form onSubmit={ (event) => {
                          event.preventDefault();
                          const cantidad = this._numTokensDevolver.value;
                        this._refundTokens(cantidad);
                        }}>
                          <input type="number" name="amount_tokens_refund" className="form-control mb-1" placeholder="I would like to get (x) tokens back ..." ref={ (input) => this._numTokensDevolver = input } />
                          <input type="submit" name="tokens_refund" className="btn btn-block btn-warning btn-sm" value="Refund now!" />
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

export default Tokens;