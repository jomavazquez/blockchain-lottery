import Web3 from "web3";
import smart_contract from "../abis/lottery.json";
import Swal from "sweetalert2";

export const loadWeb3 = async (setAccount, setContract, setLoading) => {
  if( window.ethereum ){
    window.web3 = new Web3( window.ethereum );
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }else if( window.web3 ){
    window.web3 = new Web3( window.web3.currentProvider );
  }else{
    setLoading( true );
    showMessage('info', 'Browser not compatible. Please use Metamask to run this project!');
  }
  if( window.ethereum || window.web3 ){
    await loadBlockchainData(setAccount, setContract, setLoading);
  }    
}

const loadBlockchainData = async (setAccount, setContract, setLoading) => {
  const web3 = window.web3;
  const accounts = await web3.eth.getAccounts();
  setAccount( accounts[0] );

  // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
  try{
    const networkId = await web3.eth.net.getId();
    const networkData = smart_contract.networks[ networkId ];
    if( networkData ){
      const abi = smart_contract.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract( abi, address );
  
      setContract( contract );
      setLoading( false );
    }else{
      showMessage('error', 'Smart Contract not deployed in the network!')
    }
  }catch{
    showMessage('warning', 'It seems you are not in Polygon Test network.', 'The Smart Contract has been deployed on it, please connect yourself.');
  }
}

export const showMessage = ( _icon, _message, _moreTextOptional = '' ) => {
  Swal.fire({
      icon: _icon,
      title: _message,
      width: 600,
      padding: '2em',
      text: _moreTextOptional,
      backdrop: 'rgba(0, 0, 0, 0.75) left top no-repeat'
    });      
}