//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

contract DaoLaunchpad {
    // Struct for proposals
    struct Proposal {
        string name;
        string description;
        uint256 timeline;
        uint256 funding;
        uint256 votesFor;
        uint256 votesAgainst;
    }

    // Events for when a new proposal is submitted or a vote is cast
    event NewProposal(
        string name,
        string description,
        uint256 timeline,
        uint256 funding
    );
    event VoteCast(string name, bool inFavor);

    // Variables
    Proposal[] public proposals;
    mapping(address => uint256) public balances;
    mapping(address => mapping(uint256 => bool)) public votes;

    // Functions
    function submitProposal(
        string memory _name,
        string memory _description,
        uint256 _timeline,
        uint256 _funding
    ) public {
        Proposal memory newProposal = Proposal(
            _name,
            _description,
            _timeline,
            _funding,
            0,
            0
        );
        proposals.push(newProposal);
        emit NewProposal(_name, _description, _timeline, _funding);
    }

    function vote(uint256 _proposalIndex, bool _inFavor) public {
        require(
            balances[msg.sender] > 0,
            "You don't have any tokens to vote with."
        );
        require(
            !votes[msg.sender][_proposalIndex],
            "You've already voted on this proposal."
        );

        Proposal storage proposal = proposals[_proposalIndex];

        if (_inFavor) {
            proposal.votesFor += balances[msg.sender];
        } else {
            proposal.votesAgainst += balances[msg.sender];
        }

        votes[msg.sender][_proposalIndex] = true;

        emit VoteCast(proposal.name, _inFavor);
    }
}
