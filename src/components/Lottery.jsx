import React, { useEffect, useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { WebContext } from "../context/WebContext";
import { Navigation } from "./Navbar";
import { loadWeb3, showMessage } from "../helpers/utils";
import headerImg from "../assets/tickets.jpg"

export const Lottery = () => {

    const { isLoading, sendError, account, contract, setAccount, setContract, setLoading } = useContext( WebContext );
    const [ numTickets, setNumTickets ] = useState(0);

    useEffect( () => {
        loadWeb3(setAccount, setContract, setLoading);
    }, []);

    const _yourTickets = async () => {
        try {
            setLoading(true);
            const _boletos = await contract.methods.Boletos(account).call();
            let _ticketMsg = _boletos.toString();
            _ticketMsg = _ticketMsg.replaceAll(',', ', ');

            showMessage('info', 'Your tickets are:', _ticketMsg.trim());
        }catch( err ){
            //this.setState({ errorMessage: err });
        }finally{
            setLoading(false);
        }    
    }  
  
    const _priceTicket = async () => {
        try {
            setLoading(true);
            const _price = await contract.methods.priceTicket().call();
            showMessage('info', `Ticket price:<br />${ _price } tokens (ERC-20)`);
        }catch( err ){
            sendError( err );
        }finally{
            setLoading(false);
        }
    }  

    const _buyTickets = async (_numBoletos) => {
        try {
            setLoading(true);
            await contract.methods.buyTickets(_numBoletos).send({
                from: account
            });
            showMessage('success', 'Payment successfully completed. Good luck!', `You've purchased ${ _numBoletos } tickets`);
        }catch( err ){
            showMessage('error', 'You have rejected the transaction!');
            sendError( err );
        }finally{
            setLoading(false);
        }
    }  

    return (
        <>
            <Navigation account={ account } />
            <img className="w-100" src={ headerImg } alt="Tickets managment" />
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <Container>
                                <h3 className="mt-4 mb-2">Do you want to buy any ticket?</h3>
                                <form onSubmit={ (e) => {
                                    e.preventDefault();
                                    _buyTickets(numTickets);
                                }}>
                                    <input 
                                        type="number" 
                                        id="amount_tickets" 
                                        name="amount_tickets" 
                                        className="form-control mb-2" 
                                        placeholder="Amount of tickets you want to buy..." 
                                        onInput={ e => setNumTickets(e.target.value) }  
                                    />
                                    <input 
                                        type="submit" 
                                        name="buy_now" 
                                        className="btn btn-primary btn-md" 
                                        value="Buy now" 
                                        disabled={ isLoading || numTickets == 0 || contract == null }
                                    />
                                </form>
                                <Row className="mt-3">
                                    <Col>
                                        <h3 className="mt-3">Ticket Price</h3>
                                        <form onSubmit={ (e) => {
                                            e.preventDefault();
                                            _priceTicket();
                                        }}>
                                            <input 
                                                type="submit" 
                                                name="check_price" 
                                                className="btn btn-danger btn-md" 
                                                value="Check price!" 
                                                disabled={ isLoading || contract == null }
                                            />
                                        </form>
                                    </Col>
                                    <Col>
                                        <h3 className="mt-3">Your tickets</h3>
                                        <form onSubmit={ (e) => {
                                            e.preventDefault();
                                            _yourTickets();
                                        }}>
                                            <input 
                                                type="submit" 
                                                name="checkt_tickets" 
                                                className="btn btn-success btn-md" 
                                                value="Check tickets!" 
                                                disabled={ isLoading || contract == null }
                                            />
                                        </form>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}