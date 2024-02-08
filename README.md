# Stealth Address Project for Polygon Network

This repository contains an implementation of ERC-5564 compliant stealth addresses for the Polygon network. It is designed to enhance user privacy by facilitating non-interactive and private transactions.

## Project Structure

The project is organized into the following directories:

- `foundryContracts`: Contains Solidity smart contracts and Foundry scripts for the Ethereum smart contract development environment.
- `Frontend`: Houses the SvelteKit application code for the user interface.
- `PythonTestingLogic`: Includes Jupyter notebooks (`test.ipynb` and `test2.ipynb`) for Python-based testing and interaction with the smart contracts.

## Installation and Setup

### Prerequisites

- Node.js
- Foundry
- Python 3 with Jupyter Notebook or Jupyter Lab

### Clone the Repository

```bash
git clone [REPOSITORY_URL]
```

### Install Node Dependencies

Navigate to the frontend directory and install the required packages:

```bash
cd Frontend
npm install
```

### Compile Smart Contracts

Compile the smart contracts using Foundry:

```bash
cd ../foundryContracts
forge build
```

### Test Smart Contracts

Execute Foundry tests:

```bash
forge test
```

### Run Python Tests

Launch the Python Jupyter notebooks:

```bash
cd ../PythonTestingLogic
jupyter notebook test.ipynb
```

## Usage

### Starting the Frontend

To launch the SvelteKit application:

```bash
cd ../Frontend
npm run dev
```

Visit `http://localhost:3000` in your browser to interact with the frontend application.

### Smart Contract Interaction

Use Foundry's `forge` and `cast` tools or the frontend application to interact with the deployed smart contracts on the Polygon network.

## Contributing

Contributions are very welcome. To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/yourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/yourFeature`).
5. Create a new Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgements

This project was inspired by the ERC-5564 proposal and is an effort to provide enhanced privacy features to users of the Polygon network.

---
