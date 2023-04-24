// Set the ABI of your smart contract
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeline",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "funding",
				"type": "uint256"
			}
		],
		"name": "NewProposal",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_timeline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_funding",
				"type": "uint256"
			}
		],
		"name": "submitProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_proposalIndex",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_inFavor",
				"type": "bool"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "inFavor",
				"type": "bool"
			}
		],
		"name": "VoteCast",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proposals",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timeline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "funding",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "votesFor",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "votesAgainst",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votes",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
  
  // Set the address of your smart contract
  const contractAddress = '0xB565AF1c2fFbbB8317093eD925E95F0921378E41';
  
  // Create a new instance of web3 using the Metamask provider
  const web3 = new Web3(window.ethereum);
  
  // Get the user's account address
  async function getAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    return account;
  }
  
  // Get the user's token balance
  async function getTokenBalance(account) {
    const contract = new web3.eth.Contract(abi, contractAddress);
    const balance = await contract.methods.balanceOf(account).call();
    return balance;
  }
  
  // Get all proposals
  async function getProposals() {
    const contract = new web3.eth.Contract(abi, contractAddress);
    const proposalIds = await contract.methods.getProposals().call();
    const proposals = await Promise.all(proposalIds.map(async (proposalId) => {
      const proposal = await contract.methods.proposals(proposalId).call();
      return {
        id: proposalId,
        name: proposal.projectName,
        description: proposal.projectDescription,
        timeline: proposal.projectTimeline,
        funding: proposal.projectFunding,
        votesFor: proposal.votesFor,
        votesAgainst: proposal.votesAgainst
      };
    }));
    return proposals;
  }
  // Submit a new proposal
async function submitProposal(event) {
    event.preventDefault();
    const account = await getAccount();
  
    const projectName = document.getElementById("project-name").value;
    const projectDescription = document.getElementById("project-description").value;
    const projectTimeline = document.getElementById("project-timeline").value;
    const projectFunding = document.getElementById("project-funding").value;
  
    const contract = new web3.eth.Contract(abi, contractAddress);
  
    try {
      await contract.methods.createProposal(projectName, projectDescription, projectTimeline, projectFunding).send({ from: account });
      alert("Proposal created successfully!");
      document.getElementById("project-name").value = "";
      document.getElementById("project-description").value = "";
      document.getElementById("project-timeline").value = "";
      document.getElementById("project-funding").value = "";
    } catch (error) {
      alert(error.message);
    }
  }
  
//   // Submit a proposal
//   async function submitProposal(event) {
//     event.preventDefault();
//     const account = await getAccount();
//     const name = document.getElementById('project-name').value;
//     const description = document.getElementById('project-description').value;
//     const timeline = document.getElementById('project-timeline').value;
//     const funding = document.getElementById('project-funding').value;
//     const contract = new web3.eth.Contract(abi, contractAddress);
//     await contract.methods.submitProposal(name, description, timeline, funding).send({ from: account });
//     window.location.reload();
//   }
  
  // Vote on a proposal
  async function vote(event) {
    event.preventDefault();
    const account = await getAccount();
    const proposalId = event.target.dataset.proposalId;
    const voteType = event.target.dataset.voteType;
    const weiAmount = "0";
  const tx = await contract.methods.vote(proposalId, voteType).send({
    from: account,
    value: weiAmount
  });
  console.log(tx);
}

// Listen for form submissions to submit a proposal
document.getElementById("submit-proposal-form").addEventListener("submit", submitProposal);

// Listen for vote button clicks to vote on a proposal
const voteButtons = document.querySelectorAll(".vote-button");
voteButtons.forEach(button => {
  button.addEventListener("click", vote);
});