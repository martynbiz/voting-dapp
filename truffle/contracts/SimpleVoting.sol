// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SimpleVoting {
    struct Proposal {
        string description;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    address public administrator;

    WorkflowStatus public workflowStatus;

    mapping(address => Voter) public voters;
    uint32 public voterCount; // Counter for the number of registered voters

    Proposal[] public proposals;

    uint private winningProposalId;

    modifier onlyAdministrator() {
        require(
            msg.sender == administrator,
            "the caller of this function must be the administrator"
        );
        _;
    }

    modifier onlyRegisteredVoter() {
        require(
            voters[msg.sender].isRegistered,
            "the caller of this function must be a registered voter"
        );
        _;
    }

    modifier onlyDuringVotersRegistration() {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "this function can be called only before proposals registration has started"
        );
        _;
    }

    modifier onlyDuringProposalsRegistration() {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "this function can be called only during proposals registration"
        );
        _;
    }

    modifier onlyAfterProposalsRegistrationEnded() {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "this function can be called only after proposals registration"
        );
        _;
    }

    modifier onlyAfterVotingSessionStarted() {
        require (
            workflowStatus == WorkflowStatus.VotingSessionStarted
        );
        _;
    }

    modifier onlyDuringVotingSession {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "this function can be called only during voting session"
        );
        _;
    }

    modifier onlyAfterVotingSession {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnded,
            "this function can be called only after voting session"
        );
        _;
    }

    modifier onlyBeforeVotesTallied {
        require(
            workflowStatus < WorkflowStatus.VotesTallied,
            "this function can be called only before votes tallied"
        );
        _;
    }

    modifier onlyAfterVotesTallied {
        require(
            workflowStatus == WorkflowStatus.VotesTallied,
            "this function can be called only after votes tallied"
        );
        _;
    }

    event VoterRegisteredEvent(address voterAddress);
    event ProposalsRegistrationStartedEvent();
    event ProposalsRegistrationEndedEvent();
    event ProposalRegisteredEvent(uint proposalId);
    event VotingSessionStartedEvent();
    event VotingSessionEndedEvent();
    event VotedEvent(address voter, uint proposalId);
    event VotesTalliedEvent();

    event WorkflowStatusChangeEvent(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    constructor() {
        administrator = msg.sender;
        workflowStatus = WorkflowStatus.RegisteringVoters;
    }

    function registerVoter(
        address _voterAddress
    ) public onlyAdministrator onlyDuringVotersRegistration {
        require(
            !voters[_voterAddress].isRegistered,
            "the voter is already registered"
        );

        voters[_voterAddress].isRegistered = true;
        voters[_voterAddress].hasVoted = false;
        voters[_voterAddress].votedProposalId = 0;

        voterCount++;

        emit VoterRegisteredEvent(_voterAddress);
    }

    function startProposalsRegistration()
        public
        onlyAdministrator
        onlyDuringVotersRegistration
    {
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        emit ProposalsRegistrationStartedEvent();
        emit WorkflowStatusChangeEvent(
            WorkflowStatus.RegisteringVoters,
            workflowStatus
        );
    }

    function endProposalsRegistration()
        public
        onlyAdministrator
        onlyDuringProposalsRegistration
    {
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;

        emit ProposalsRegistrationEndedEvent();
        emit WorkflowStatusChangeEvent(
            WorkflowStatus.ProposalsRegistrationStarted,
            workflowStatus
        );
    }

    function startVotingSession()
        public
        onlyAdministrator
        onlyAfterProposalsRegistrationEnded
    {
        workflowStatus = WorkflowStatus.VotingSessionStarted;

        emit VotingSessionStartedEvent();
        emit WorkflowStatusChangeEvent(
            WorkflowStatus.RegisteringVoters,
            workflowStatus
        );
    }

    function endVotingSession()
        public
        onlyAdministrator
        onlyAfterVotingSessionStarted
    {
        workflowStatus = WorkflowStatus.VotingSessionEnded;

        emit VotingSessionEndedEvent();
        emit WorkflowStatusChangeEvent(
            WorkflowStatus.VotingSessionStarted,
            workflowStatus
        );
    }

    function registerProposal(
        string memory proposalDescription
    ) public onlyRegisteredVoter onlyDuringProposalsRegistration {
        proposals.push(
            Proposal({description: proposalDescription, voteCount: 0})
        );

        emit ProposalRegisteredEvent(proposals.length - 1);
    }

    function vote(
        uint proposalId
    ) public onlyRegisteredVoter onlyDuringVotingSession {
        require(!voters[msg.sender].hasVoted, "the caller has already voted");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = proposalId;

        proposals[proposalId].voteCount += 1;

        emit VotedEvent(msg.sender, proposalId);
    }

    function tallyVotes()
        public
        onlyAdministrator
        onlyAfterVotingSession
        onlyBeforeVotesTallied
    {
        uint winningVoteCount = 0;
        uint winningProposalIndex = 0;

        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalIndex = i;
            }
        }

        winningProposalId = winningProposalIndex;
        workflowStatus = WorkflowStatus.VotesTallied;

        emit VotesTalliedEvent();
        emit WorkflowStatusChangeEvent(
            WorkflowStatus.VotingSessionEnded,
            workflowStatus
        );
    }

    function getVotersNumber() public view returns (uint32) {
        return voterCount;
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function getProposalsNumber() public view returns (uint) {
        return proposals.length;
    }

    function getProposalDescription(uint index) public view returns (string memory) {
        return proposals[index].description;
    }

    function getWinningProposalId()
        public
        view
        onlyAfterVotesTallied
        returns (uint)
    {
        return winningProposalId;
    }

    function getWinningProposalDescription()
        public
        view
        onlyAfterVotesTallied
        returns (string memory)
    {
        return proposals[winningProposalId].description;
    }

    function getWinningProposalVoteCounts()
        public
        view
        onlyAfterVotesTallied
        returns (uint)
    {
        return proposals[winningProposalId].voteCount;
    }

    function isRegisteredVoter(
        address _voterAddress
    ) public view returns (bool) {
        return voters[_voterAddress].isRegistered;
    }

    function isAdministrator(address _address) public view returns (bool) {
        return _address == administrator;
    }

    function getWorkflowStatus() public view returns (WorkflowStatus) {
        return workflowStatus;
    }
}
