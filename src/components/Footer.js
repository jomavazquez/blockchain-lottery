import React from "react";

const MyFooter = () => (
    <footer style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} className="text-center text-lg-start text-muted">
      <section className="border-bottom">
        <div className="container text-center text-md-start mt-5">
          <div className="row p-5">
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <strong>About the project</strong>
              </h6>
              <p>
                Smart Contract deployed over <strong>Polygon test</strong> network.
              </p>
              <p className="m-0">
                Be sure you have connected your Metamask account to this.
              </p>
            </div>
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase boldmb-4">
                <strong>Stack used</strong>
              </h6>
              <p className="m-0">
                Solidity, Ganache, Binance, Polygon, React, JS, Mocha for testing.
              </p>
            </div>
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <strong>Contact</strong>
              </h6>
              <p className="m-0">
                <a href="https://www.linkedin.com/in/jomavazquez" target="_blank">LinkedIn</a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className='text-center p-4 bg-dark text-white' >
       { new Date().getFullYear() } © Copyright - <a className="text-reset" href="https://www.josemariavazquez.com" target="_blank">José María Vázquez</a>
      </div>
    </footer>
);

export default MyFooter;