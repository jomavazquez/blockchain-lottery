import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Web3 from "web3";
import smart_contract from "../abis/lottery.json";
import Navigation from "./Navbar";
import { showMessage } from "../helpers/utils";
import headerImg from "../assets/winner.jpg"

class Winner extends Component {

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
    await this.loadWeb3()
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
    const networkId = await web3.eth.net.getId() ;
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

  _generateWinner = async () => {
    try{
      await this.state.contract.methods.generateWinner().send({
        from: this.state.account
      });
      showMessage('success', 'Winner generated successfully!');
    }catch( err ){
      this.setState({ errorMessage: err });
    }finally{
      this.setState({ loading: false });
    }
  }

  _winner = async () => {
    try{
      const winner = await this.state.contract.methods.winner().call();
      showMessage('success', 'And the winner is...', winner);
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
        <img className="w-100" src={ headerImg } alt="Lottery Winner" />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <Container>
                  <Row>
                    <Col>
                      <form name="generate_winner" onSubmit={ (event) => {
                        event.preventDefault();
                        this._generateWinner();
                      }}>
                        <input type="submit" className="btn btn-block btn-info btn-lg mt-2 mb-2" value="Generate Winner" />
                      </form>
                    </Col>
                    <Col>
                    <form name="check_winner" onSubmit={ (event) => {
                        event.preventDefault();
                        this._winner();
                      }}>
                        <input type="submit" className="btn btn-block btn-success btn-lg mt-2 mb-2" value="Check Winner" />
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

export default Winner;