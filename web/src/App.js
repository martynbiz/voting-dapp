import React, { useEffect, useState } from 'react';
import { Container, Form, Button, ButtonGroup, Tabs, Tab } from 'react-bootstrap';
import Web3 from 'web3';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const contractAddress = "0xBb06589E8D1a7B6c7CE3153b98932157B209E0CD";

// Replace with your API endpoint
const apiUrl = './contracts/SimpleVoting.json';

function App() {
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [networkId, setNetworkId] = useState(null);

  const [voterAddress, setVoterAddress] = useState('');
  // const [votersNumber, setVotersNumber] = useState(0);
  // const [voters, setVoters] = useState([]);

  const [proposalDescription, setProposalDescription] = useState('');
  const [proposals, setProposals] = useState([]);

  const [proposalID, setProposalID] = useState(0);

  const [winningProposalDescription, setWinningProposalDescription] = useState("");
  const [winningProposalVoteCounts, setWinningProposalVoteCounts] = useState(0);

  useEffect(() => {

    console.log("useEffect");

    const initWeb3 = async () => {

      try {

        const ganacheProvider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        const web3Instance = new Web3(ganacheProvider);

        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();

        setWeb3(web3Instance);
        setAccounts(accounts);
        setNetworkId(networkId);

        // now we have web3 init, fetch abi
        const fetchData = async () => {
          try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();

            const contract = new web3Instance.eth.Contract(json.abi, contractAddress);
            setContract(contract);

          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };

        fetchData();

      } catch (error) {
        setError(error.message);
      }
    };

    initWeb3();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleRegisterVoter = async () => {

    const fromAccount = accounts[0];

    try {

      // Estimate the amount of gas needed
      const gasEstimate = await contract.methods.registerVoter(voterAddress).estimateGas({ from: fromAccount });
      console.log("gasEstimate: ", web3.utils.fromWei(gasEstimate, 'gwei'));

      contract.methods.registerVoter(voterAddress).send({ from: fromAccount, gas: gasEstimate })
        .then(receipt => {
          console.log('Transaction receipt:', receipt);
        })
        .catch(error => {
          console.error('Error:', error);
        });

    } catch (error) {
      console.error('Error:', error.message);
    }

  };

  const handleStartProposalRegistration = async () => {

    const fromAccount = accounts[0];

    try {

      // Estimate the amount of gas needed
      const gasEstimate = await contract.methods.startProposalsRegistration().estimateGas({ from: fromAccount });
      console.log("gasEstimate: ", web3.utils.fromWei(gasEstimate, 'gwei'));

      contract.methods.startProposalsRegistration().send({ from: fromAccount, gas: gasEstimate })
        .then(receipt => {
          console.log('Transaction receipt:', receipt);
        })
        .catch(error => {
          console.error('Error:', error);
        });

    } catch (error) {
      console.error('Error:', error.message);
    }

  }

  const handleEndProposalRegistration = async () => {

    const fromAccount = accounts[0];

    try {

      // Estimate the amount of gas needed
      const gasEstimate = await contract.methods.endProposalsRegistration().estimateGas({ from: fromAccount });
      console.log("gasEstimate: ", web3.utils.fromWei(gasEstimate, 'gwei'));

      contract.methods.endProposalsRegistration().send({ from: fromAccount, gas: gasEstimate })
        .then(receipt => {
          console.log('Transaction receipt:', receipt);
        })
        .catch(error => {
          console.error('Error:', error);
        });

    } catch (error) {
      console.error('Error:', error.message);
    }

  }

  const handleStartVotingSession = async () => {

    const fromAccount = accounts[0];

    try {

      // Estimate the amount of gas needed
      const gasEstimate = await contract.methods.startVotingSession().estimateGas({ from: fromAccount });
      console.log("gasEstimate: ", web3.utils.fromWei(gasEstimate, 'gwei'));

      contract.methods.startVotingSession().send({ from: fromAccount, gas: gasEstimate })
        .then(receipt => {
          console.log('Transaction receipt:', receipt);
        })
        .catch(error => {
          console.error('Error:', error);
        });

    } catch (error) {
      console.error('Error:', error.message);
    }

  }

  const handleEndVotingSession = async () => {

    const fromAccount = accounts[0];

    try {

      // Estimate the amount of gas needed
      const gasEstimate = await contract.methods.endVotingSession().estimateGas({ from: fromAccount });
      console.log("gasEstimate: ", web3.utils.fromWei(gasEstimate, 'gwei'));

      contract.methods.endVotingSession().send({ from: fromAccount, gas: gasEstimate })
        .then(receipt => {
          console.log('Transaction receipt:', receipt);
        })
        .catch(error => {
          console.error('Error:', error);
        });

    } catch (error) {
      console.error('Error:', error.message);
    }

  }

  const handleRegisterProposal = async () => {

    const fromAccount = accounts[0];

    try {

      // Estimate the amount of gas needed
      const gasEstimate = await contract.methods.registerProposal(proposalDescription).estimateGas({ from: fromAccount });
      console.log("gasEstimate: ", web3.utils.fromWei(gasEstimate, 'gwei'));

      contract.methods.registerProposal(proposalDescription).send({ from: fromAccount, gas: gasEstimate })
        .then(receipt => {

          console.log('Transaction receipt:', receipt);

          // contract.methods.getAllProposals().call()
          //   .then(result => {
          //     console.log(result);
          //     // setProposals(result);
          //   })
          //   .catch(error => {
          //     console.error('Error:', error);
          //   });

        })
        .catch(error => {
          console.error('Error:', error);
        });

    } catch (error) {
      console.error('Error:', error.message);
    }

  };

  const handleVote = async () => {

    const fromAccount = accounts[0];

    try {

      // Estimate the amount of gas needed
      const gasEstimate = await contract.methods.vote(proposalID).estimateGas({ from: fromAccount });
      console.log("gasEstimate: ", web3.utils.fromWei(gasEstimate, 'gwei'));

      contract.methods.vote(proposalID).send({ from: fromAccount, gas: gasEstimate })
        .then(receipt => {

          console.log('Transaction receipt:', receipt);

          // contract.methods.getAllProposals().call()
          //   .then(result => {
          //     console.log(result);
          //     // setProposals(result);
          //   })
          //   .catch(error => {
          //     console.error('Error:', error);
          //   });

        })
        .catch(error => {
          console.error('Error:', error);
        });

    } catch (error) {
      console.error('Error:', error.message);
    }

  };

  const handleTallyVotes = async () => {

    const fromAccount = accounts[0];

    try {

      // Estimate the amount of gas needed
      const gasEstimate = await contract.methods.tallyVotes().estimateGas({ from: fromAccount });
      console.log("gasEstimate: ", web3.utils.fromWei(gasEstimate, 'gwei'));

      contract.methods.tallyVotes().send({ from: fromAccount, gas: gasEstimate })
        .then(receipt => {

          console.log('Transaction receipt:', receipt);

          contract.methods.getWinningProposalDescription().call()
            .then(result => {
              console.log(result);
              setWinningProposalDescription(result);
            })
            .catch(error => {
              console.error('Error:', error);
            });

          contract.methods.getWinningProposalVoteCounts().call()
            .then(result => {
              console.log(result);
              const voteCounts = Number(result);
              setWinningProposalVoteCounts(voteCounts);
            })
            .catch(error => {
              console.error('Error:', error);
            });

        })
        .catch(error => {
          console.error('Error:', error);
        });

    } catch (error) {
      console.error('Error:', error.message);
    }

  };

  return (
    <div className="App">
      <Container className="mb-3">
        <h1>SimpleVoting app</h1>
        <Tabs defaultActiveKey="registerVoter" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="registerVoter" title="Register voters">
            <Form className="p-3">
              <Form.Group className="pb-3" controlId="voterAddress">
                <Form.Label>Voter address</Form.Label>
                <Form.Control
                  type="text"
                  value={voterAddress}
                  onChange={e => setVoterAddress(e.target.value)}
                  placeholder="Enter voter address"
                />
              </Form.Group>
              <Button variant="primary" onClick={handleRegisterVoter}>
                Register voter
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="admin" title="Register proposal">
            <ButtonGroup className="mb-3 btn-group-sm">
              <Button variant="primary" onClick={handleStartProposalRegistration}>
                Start proposal registration
              </Button>
              <Button variant="primary" onClick={handleEndProposalRegistration}>
                End proposal registration
              </Button>
            </ButtonGroup>
            <Form className="border mb-5 p-3">
              <Form.Group className="pb-3" controlId="proposalDescription">
                <Form.Label>Proposal description</Form.Label>
                <Form.Control
                  type="text"
                  value={proposalDescription}
                  onChange={e => setProposalDescription(e.target.value)}
                  placeholder="Enter proposal description"
                />
              </Form.Group>
              <Button variant="primary" onClick={handleRegisterProposal}>
                Register proposal
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="vote" title="Vote">
            <ButtonGroup className="mb-3 btn-group-sm">
              <Button variant="primary" onClick={handleStartVotingSession}>
                Start voting session
              </Button>
              <Button variant="primary" onClick={handleEndVotingSession}>
                End voting session
              </Button>
            </ButtonGroup>
            <Form className="border mb-5 p-3">
              <Form.Group className="pb-3" controlId="proposalID">
                <Form.Label>Proposal ID</Form.Label>
                <Form.Control
                  type="text"
                  value={proposalID}
                  onChange={e => setProposalID(e.target.value)}
                  placeholder="Enter proposal ID"
                />
              </Form.Group>
              <Button variant="primary" onClick={handleVote}>
                Vote
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="tallyVotes" title="Tally votes">
            <Button variant="primary" onClick={handleTallyVotes}>
              Tally votes
            </Button>
            <p>Winning proposal: {winningProposalDescription}</p>
            <p>Winning proposal vote counts: {winningProposalVoteCounts}</p>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
