import React, { useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { WebContext } from "../context/WebContext";
import { Navigation } from "./Navbar";
import { loadWeb3, showMessage } from "../helpers/utils";
import headerImg from "../assets/winner.jpg";

export const Winner = () => {

  const { isLoading, sendError, account, contract, setAccount, setContract, setLoading } = useContext( WebContext );

  useEffect( () => {
    loadWeb3(setAccount, setContract, setLoading);
  }, []);

  const _generateWinner = async () => {
    try{
      setLoading(true);
      const response = await contract.methods.generateWinner().send({
        from: account
      });
      showMessage('success', 'Winner generated successfully!');
    }catch( err ){
      sendError( err );
      showMessage('error', 'You have rejected the transaction!');
    }finally{
      setLoading(false);
    }
  }

  const _winner = async () => {
    try{
      setLoading(true);
      const winner = await contract.methods.winner().call();
      showMessage('success', 'And the winner is...', winner);
    }catch( err ){
      sendError( err );
    }finally{
      setLoading(false);
    }
  }

    return (
     <>
       <Navigation account={ account } />
       <img className="w-100" src={ headerImg } alt="Lottery Winner" />
       <div className="container-fluid mt-5">
         <div className="row">
           <main role="main" className="col-lg-12 d-flex text-center">
             <div className="content mr-auto ml-auto">
               <Container>
                 <Row>
                   <Col>
                     <form id="generate_winner" name="generate_winner" onSubmit={ (event) => {
                       event.preventDefault();
                       _generateWinner();
                     }}>
                      <input 
                        type="submit" 
                        className="btn btn-block btn-info btn-lg mt-2 mb-2" 
                        value="Generate Winner" 
                        disabled={ isLoading || contract == null }
                      />
                     </form>
                   </Col>
                   <Col>
                   <form id="check_winner" name="check_winner" onSubmit={ (event) => {
                       event.preventDefault();
                       _winner();
                     }}>
                       <input 
                          type="
                          submit" className="btn btn-block btn-success btn-lg mt-2 mb-2" 
                          value="Check Winner" 
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