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
              <p className="m-0">
                Smart Contract deployed over Ganache. Be sure you have this network running in your machine.
              </p>
            </div>
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase boldmb-4">
                <strong>Stack</strong>
              </h6>
              <p className="m-0">
                Solidity, Ganache, React, JS, Mocha for testing.
              </p>
            </div>
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
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