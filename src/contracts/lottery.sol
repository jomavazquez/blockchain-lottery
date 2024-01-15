// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract lottery is ERC20, Ownable {

    // ============================================
    // Tokens managment
    // Gestion de los tokens
    // ============================================

    // Address of the NFT Contract
    // Direccion del contrato NFT del proyecto
    address public nft;

    // Constructor 
    constructor() ERC20("Lottery", "LT"){
        _mint( address(this), 5000 );
        nft = address( new mainERC721() );
    }

    // Winner of the lottery
    // Ganador del premio de la loteria
    address public winner;

    // User registration
    // Registro del usuario
    mapping( address => address ) public userContract;

    // Get Tokens ERC-20 price
    // Obtencion del precio de los tokens ERC-20
    function priceTokens( uint256 _numTokens ) internal pure returns (uint256) {
        return _numTokens * (1 ether);
    }

    // Get user's tokens ERC-20 balance
    // Visualizacion del balance de tokens ERC-20 de un usuario
    function balanceTokens( address _account ) public view returns (uint256) {
        return balanceOf( _account );
    }

    // Get Smart Contract's tokens ERC-20 balance
    // Visualizacion del balance de tokens ERC-20 del Smart Contract
    function balanceTokensSC() public view returns (uint256) {
        return balanceOf( address(this) );
    }

    // Get Smart Contract ethers balance
    // Visualizacion del balance de ethers del Smart Contract
    function balanceEthersSC() public view returns (uint256) {
        return address(this).balance / 10**18;
    }

    // Generation of new Tokens ERC-20
    // Generacion de nuevos Tokens ERC-20
    function mint( uint256 _newTokens ) public onlyOwner {
        _mint( address(this), _newTokens );
    }

    // User registration
    // Registro de usuarios
    function userRegister() internal {
        address addr_personal_contract = address( new ticketsNFTs(msg.sender, address(this), nft) );
        userContract[ msg.sender ] = addr_personal_contract; 
    }

    // User information
    // Informacion de un usuario
    function usersInfo( address _account ) public view returns (address) {
        return userContract[ _account ];
    }

    // Buy tokens ERC-20
    // Compra de tokens ERC-20
    function buyTokens( uint256 _numTokens ) public payable {
        // Registering the user
        if( userContract[msg.sender] == address(0) ){
            userRegister();
        }
        // Calculate the cost of the tokens to buy
        uint256 cost = priceTokens( _numTokens );
        // Filtering if the user has enough money
        require( msg.value >= cost, "Buy less tokens o pay with more ethers!" );
        // Getting the tokens ERC-20 available
        uint256 balance = balanceTokensSC();
        // Filtering if there are enough tokens
        require( _numTokens <= balance, "Buy less tokens please!" );
        // Regund of excess money
        uint256 returnValue = msg.value - cost;
        // Smart Contract returns the money left
        payable(msg.sender).transfer( returnValue );
        // Sending the tokens to the user
        _transfer( address(this), msg.sender, _numTokens );
    }

    // Refund tokens to Smart Contract
    // Devolucion de tokens al Smart Contract
    function returnTokens( uint _numTokens ) public payable {
        // Filtering the number of tokens greater than 0
        require( _numTokens > 0, "You need to return a number of tokens greater than 0!" );
        // User must demonstrate having the number of tokens he wants to return
        require( _numTokens <= balanceTokens(msg.sender), "You do not have the tokens you want to return!" );
        // User transfers tokens to Smart Contract
        _transfer( msg.sender, address(this), _numTokens );
        // Smart Contract sends ethers to the user
        payable(msg.sender).transfer( priceTokens(_numTokens) );
    }

    // ============================================
    // Lottery managment
    // Gestión de la lotería
    // ============================================

    // Lottery ticket price (in ERC-20 tokens)
    // Precio del boleto de loteria (en tokens ERC-20)
    uint public priceTicket = 5;

    // Relationship between someone who buys tickets -> number of tickets
    // Relacion: persona que compra los boletos -> el numero de los boletos
    mapping(address => uint []) idUserTickets;

    // Relationship between tickets -> winner
    // Relacion: boleto -> ganador
    mapping(uint => address) ADNTicket;

    // Random number
    // Numero aleatorio
    uint randNonce = 0;

    // Lottery tickets generated
    // Boletos de la loteria generados
    uint [] ticketsGenerated;

    // Buy lottery tickets
    // Compra de boletos de loteria
    function buyTickets( uint _numTickets ) public {

        // Total price of tickets
        // Precio total de los boletos a comprar
        uint totalPrice = _numTickets * priceTicket;
        
        // Checking if the user has enough tokens to buy something
        // Verificacion de los tokens del usuario
        require( totalPrice <= balanceTokens(msg.sender), "You don't have enough tokens. Please buy more!" );
        
        // Token transfer from the user to the Smart Contract
        // Transferencia de tokens del usuario al Smart Contract
        _transfer( msg.sender, address(this), totalPrice );
        
        for (uint i = 0; i < _numTickets; i++){
            // Generating the random number using timestamp, the address who buy tickets and the nonce
            /* 
                Recoge:
                    - la marca de tiempo (block.timestamp), 
                    - msg.sender 
                    - y un Nonce 
                    (un numero que solo se utiliza una vez, para que no ejecutemos dos veces la misma  funcion de hash con los mismos parametros de entrada) en incremento.
                
                Se utiliza 'keccak256 'para convertir estas entradas a un hash aleatorio, convertir ese hash a un uint y luego utilizamos % 10000 para tomar los ultimos 4 digitos,
                dando un valor aleatorio entre 0 - 9999. 
            */
            uint random = uint( keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % 10000;
            randNonce++;

            // Assign tickets to user
            // Almacenamiento de los datos del boletos enlazados al usuario
            idUserTickets[msg.sender].push(random);

            // Storing tickets
            // Almacenamiento de los datos de los boletos
            ticketsGenerated.push(random);

            // Assigning tickets to generate a winner later
            // Asignacion del ADN del boleto para la generacion de un ganador
            ADNTicket[random] = msg.sender;

            // New NFT token creation for the ticket
            // Creacion de un nuevo NFT para el numero de boleto
            ticketsNFTs( userContract[msg.sender] ).mintBoleto(msg.sender, random);
        }
    }

    // Get user's tickets
    function Boletos( address _owner ) public view returns(uint [] memory) {
        return idUserTickets[ _owner ];
    }

    // Generation of the lottery winner
    // Generacion del ganador de la loteria
    function generateWinner() public onlyOwner {
        // Declaracion de la longitud del array
        uint _length = ticketsGenerated.length;

        // Filtering the purchase: at least must be 1 ticket
        // Verificacion de la compra de al menos de 1 boleto
        require(_length > 0, "There are no tickets purchased!");

        // Generation a random number
        // Eleccion aleatoria de un numero entre: [0-Longitud]
        uint random = uint(uint(keccak256(abi.encodePacked(block.timestamp))) % _length);
        
        // Choosing a random number
        // Seleccion del numero aleatorio
        uint _selected = ticketsGenerated[random];

        // Lottery's winner address
        // Direccion del ganador de la loteria
        winner = ADNTicket[_selected];

        // 95% of the prize to winner
        // Envio del 95% del premio de loteria al ganador
        payable(winner).transfer(address(this).balance * 95 / 100);

        // 5%  of the prize sent to the owner (benefits)
        // Envio del 5% del premio de loteria al owner
        payable(owner()).transfer(address(this).balance * 5 / 100);
    }

}

// NFT Smart Contract
// Smart Contract de NFTs
contract mainERC721 is ERC721 {

    address public addressLottery;
    constructor() ERC721("Lottery", "LT"){
        addressLottery = msg.sender;
    }

    // NFTs creation
    // Creacion de NFTs
    function safeMint( address _owner, uint256 _ticket ) public {
        require( msg.sender == lottery(addressLottery).usersInfo(_owner), "You do not have permissions to run this function!" );
        _safeMint( _owner, _ticket );
    }

}

contract ticketsNFTs {

    // Owner information
    // Datos relevantes del propietario
    struct Owner {
        address direccionPropietario;
        address contratoPadre;
        address contractNFT;
        address contratoUsuario;
    }
    Owner public owner;

    // Smart Contract (child) constructor
    // Datos relevantes del propietario 
    constructor( address _owner, address _contractParent, address _contractNFT){
        owner = Owner(
            _owner, 
            _contractParent,
            _contractNFT, 
            address(this)
        );
    }

    // Conversion of lottery ticket numbers
    // Conversion de los numeros de los boletos de loteria
    function mintBoleto( address _owner, uint _ticket ) public {
        require( msg.sender == owner.contratoPadre, "You do not have permissions to run this function" );
        mainERC721( owner.contractNFT).safeMint( _owner, _ticket );
    }

}