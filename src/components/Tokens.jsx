import React, { useEffect, useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { WebContext } from "../context/WebContext";
import { MyCarousel, Navigation } from "./";
import { loadWeb3, showMessage } from "../helpers/utils";

export const Tokens = () => {

    const { isLoading, sendError, account, contract, setAccount, setContract, setLoading } = useContext( WebContext );
    const [ tokenAmount, setTokenAmount ] = useState(0);
    const [ tokenAmountRefund, setTokenAmountRefund ] = useState(0);

    useEffect( () => {
        loadWeb3(setAccount, setContract, setLoading);
    }, []);

    const _balanceTokens = async () => {
        try{
            setLoading(true);
            const _balance = await contract.methods.balanceTokens(account).call();
            showMessage('info', 'User tokens balance:', _balance );
        }catch( err ){
            sendError( err );
        }finally{
            setLoading(false);
        }
    }

    const _balanceTokensSC = async () => {
        try{
            setLoading(true);
            const _balanceTokensSC = await contract.methods.balanceTokensSC().call();
            showMessage('info', 'Smart Contract token balance:', `${ _balanceTokensSC } tokens`);
        }catch( err ){
            sendError( err );
        }finally{
            setLoading(false);
        }
    }

    const _balanceEthersSC = async () => {
        try{
            setLoading(true);
            const _balanceEthersSC = await contract.methods.balanceEthersSC().call();
            showMessage('info', 'Smart Contract ether balance:', `${ _balanceEthersSC } ethers`);
        }catch( err ){
            sendError( err );
        }finally{
            setLoading(false);
        }
    }

    const _buyTokens = async ( _numTokens ) => {
        try{
            setLoading(true);
            const web3 = window.web3;
            const ethers = web3.utils.toWei(_numTokens, 'ether');
            await contract.methods.buyTokens(_numTokens).send({
                from: account,
                value: ethers
            });
            showMessage('success', 'Token purchase done!', `You've purchased ${ _numTokens } tokens worth ${ ethers / 10**18} ether/s`);
        }catch( err ){
            sendError( err );
            showMessage('error', 'You have rejected the transaction!');
        }finally{
            setLoading(false);
        }
    }

    const _refundTokens = async ( _numTokens ) => {
        try{
            setLoading(true);
            await contract.methods.returnTokens(_numTokens).send({
                from: account
            });
            showMessage('warning', 'Tokens ERC-20 refund!', `${ _numTokens } tokens have been refunded`);
        }catch( err ){
            sendError( err );
            showMessage('error', 'You have rejected the transaction!');
        }finally{
            setLoading(false);
        }
    }    

    return (
        <>
            <Navigation account={ account } />
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
                                        <form onSubmit={ (e) => {
                                            e.preventDefault();
                                            _balanceTokens();
                                        }}>
                                            <input 
                                                type="submit" 
                                                name="tokens_user" 
                                                className="btn btn-block btn-success btn-sm" 
                                                value="Get balance" 
                                                disabled={ isLoading || contract == null }
                                            />
                                        </form>
                                    </Col>
                                    <Col>
                                        <h3>SC's<br />Token</h3>
                                        <form onSubmit={ (e) => {
                                            e.preventDefault();
                                            _balanceTokensSC();
                                        }}>
                                            <input 
                                                type="submit" 
                                                name="sc_balance" 
                                                className="btn btn-block btn-info btn-sm" 
                                                value="Get balance (SC)" 
                                                disabled={ isLoading || contract == null }
                                            />
                                        </form>
                                    </Col>
                                    <Col>
                                        <h3>Ethers<br />SC</h3>
                                        <form onSubmit={ (e) => {
                                            e.preventDefault();
                                            _balanceEthersSC();
                                        }}>
                                            <input 
                                                type="submit" 
                                                name="ethers_balance" 
                                                className="btn btn-block btn-danger btn-sm" 
                                                value="Get balance (SC) ethers" 
                                                disabled={ isLoading || contract == null }
                                            />
                                        </form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h3 className="mt-5 m-3"><strong>Tokens purchase</strong></h3>
                                        <form onSubmit={ (e) => {
                                            e.preventDefault();
                                            _buyTokens(tokenAmount);
                                        }}>
                                            <input 
                                                type="number" 
                                                name="tokens_amount" 
                                                className="form-control mb-1" 
                                                placeholder="I would like to buy (x) tokens ..." 
                                                onInput={ e => setTokenAmount(e.target.value) } 
                                            />
                                            <input 
                                                type="submit" 
                                                name="tokens_buy" 
                                                className="btn btn-block btn-primary btn-sm" 
                                                value="Buy now!"
                                                disabled={ isLoading || tokenAmount == 0 || contract == null }
                                            />
                                        </form>
                                        <h3 className="mt-5 m-3"><strong>Tokens refund</strong></h3>
                                        <form onSubmit={ (e) => {
                                            e.preventDefault();
                                            _refundTokens(tokenAmountRefund);
                                        }}>
                                            <input 
                                                type="number" 
                                                name="amount_tokens_refund" 
                                                className="form-control mb-1" 
                                                placeholder="I would like to get (x) tokens back ..." 
                                                onInput={ e => setTokenAmountRefund(e.target.value) } 
                                            />
                                            <input 
                                                type="submit" 
                                                name="tokens_refund" 
                                                className="btn btn-block btn-warning btn-sm" 
                                                value="Refund now!" 
                                                disabled={ isLoading || tokenAmountRefund == 0 || contract == null }
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