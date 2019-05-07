pragma solidity ^0.4.23;

contract Quiz
{
    string Ques1;
    string Ques2;
    string Ques3;
    string Ques4;
    address public Owner;
    uint public Num_Participants;
    uint public Max_Participants;
    uint public Participation_Fee;
    uint public Total_Fee;
    mapping(address => bool) public Participants;
    address[] public Participant_Addresses;
    uint public Revealtime = 5;
    uint public Starttime;
    uint public Endtime;
    uint public Max_Reveal_Ans_time;
    uint public Max_Reveal_OrigAns_time;
    bytes32[4] public Answers_hash;
    uint[4] public Answers;
    uint[4] public Closing_times;
    uint Min_close_time = 1;
    bool public Claimed_Refund;
    struct Participant
    {
        uint Pending_amount;
        bytes32[4] Choice_hash;
        uint[4] choices;
        uint[4] Open_times;
    }
    
    mapping(address => Participant) Participant_Info;

    constructor(uint _n,uint _pfee,uint _starttime) public
    {
        //require(Owner !=0x0,"Owner already assigned");
        require(_n>0 && _pfee>0 && _starttime>0,"invalid inputs to start quiz");

        Owner = msg.sender;
        Num_Participants = 0;
        Max_Participants = _n;
        Participation_Fee = _pfee;
        Starttime = now+_starttime;
    }
    function RegisterParticipants() public payable
    {
        require(Participants[msg.sender]==false,"User already registered");
        //require(msg.value>=0,"Fee insufficient");
        
        require(msg.value>=Participation_Fee,"Fee insufficient");
        
        require(now<Starttime,"Time up for registration");
        require(Num_Participants<Max_Participants,"Participants limit exceeded");
        Participants[msg.sender] = true;
        Participant par;
        Participant_Info[msg.sender] = par;
    
        Participant_Info[msg.sender].Pending_amount  = msg.value - Participation_Fee;
        Total_Fee += Participation_Fee;
        Participant_Addresses.push(msg.sender);
        Num_Participants++;
        
    }
    function StartQuiz(string q1,string q2,string q3,string q4,uint[4] answers,bytes32 secret,uint[4] close_times,uint _endtime) public
    {
        uint i;
        if(now<Starttime || now>(Starttime+Revealtime))
        {
            if(Claimed_Refund==false)
            {
                for(i=0;i<Num_Participants;i++)
                {
                    Participant_Info[Participant_Addresses[i]].Pending_amount += Participation_Fee;
                }
                Claimed_Refund = true;
            }
        }

        require(msg.sender==Owner,"Only owner can reveal quesetions");
        require(now>=Starttime && now<=(Starttime+Revealtime),"Quiz cant be started now");
        uint sum_closing_times;
        
        for(i=0;i<4;i++)
        {
            require(close_times[i]>Min_close_time,"Need atleast 5 mins of close time for all ques");
            sum_closing_times += close_times[i];
        }
        require(now+_endtime>=Starttime+Revealtime+sum_closing_times,"Unfair ending time");
        Ques1 = q1;
        Ques2 = q2;
        Ques3 = q3;
        Ques4 = q4;
        for(i=0;i<4;i++)
        {
            Answers_hash[i] =  keccak256(abi.encodePacked(answers[i],secret));
            Closing_times[i] = close_times[i];
        }
        Endtime = _endtime;
        Max_Reveal_Ans_time = Endtime + 5;
        Max_Reveal_OrigAns_time = Max_Reveal_Ans_time + 5;
    }
    function OpenQues(uint num) public returns(string)
    {
        require(msg.sender!=Owner,"You have set the questions already so you must know");
        require(Participants[msg.sender]!=false,"Unregistered user");
        require(num>0 && num<5,"Only question numbers 1,2,3,4 are present");
        string ques;
        if(num==1)
            ques = Ques1;
        else if(num==2)
            ques = Ques2;
        else if(num==3)
            ques = Ques3;
        else if(num==4)
            ques = Ques4;
        if(Participant_Info[msg.sender].Open_times[num-1] ==0)
            Participant_Info[msg.sender].Open_times[num-1] = now;
        return ques;
    }

    function SubmitAnswer(uint num,uint ans,bytes32 secret) public
    {
        
        require(msg.sender!=Owner,"You cannot submit");
        require(Participants[msg.sender]!=false,"Unregistered user");
        require(num>0 && num<5,"Only question numbers 1,2,3,4 are present");
        require(Participant_Info[msg.sender].Open_times[num-1]!=0,"You didnot open that question");
        
        require(Participant_Info[msg.sender].Open_times[num-1]+Closing_times[num-1] > now,"Sorry timeup");
        require(now<=Starttime+Endtime,"Its already Time up");
        bytes32 ans_hash = keccak256(abi.encodePacked(ans,secret));
        Participant_Info[msg.sender].Choice_hash[num-1] = ans_hash;
    }

    function RevealAnswer(uint num,uint ans,bytes32 secret) public
    {
        require(msg.sender!=Owner,"You cannot access");
        require(Participants[msg.sender]!=false,"Unregistered user");
        require(num>0 && num<5,"Only question numbers 1,2,3,4 are present");
        require(now>=Starttime + Max_Reveal_Ans_time && now <= Starttime + Max_Reveal_OrigAns_time,"You cannot reveal now");
        bytes32 ans_hash = keccak256(abi.encodePacked(ans,secret));
        require(Participant_Info[msg.sender].Choice_hash[num-1]==ans_hash,"Wrong answer revealed");
        Participant_Info[msg.sender].choices[num-1]=ans;
    }


    function RevealOriginalAnswer(uint num,uint ans,bytes32 secret) public
    {
        require(now>=Starttime + Endtime && now<=Starttime + Max_Reveal_Ans_time,"You cannot reveal now");
        require(msg.sender==Owner,"You cannot RevealOriginalAnswer");
        bytes32 ans_hash = keccak256(abi.encodePacked(ans,secret));
        require(Answers_hash[num-1]==ans_hash,"Submitted answer not revealed");
        Answers[num-1] = ans;
    }

    function GetScores() public
    {
        require(now>Max_Reveal_OrigAns_time,"Not Revealed by all");
        uint rem_amount;
        uint i;
        uint j;
        for(i=0;i<4;i++)
        {
            if(Answers[i]==0)
            {
                if(Claimed_Refund==false)
                {
                    for(j=0;j<Num_Participants;j++)
                    {
                        Participant_Info[Participant_Addresses[j]].Pending_amount += Participation_Fee;
                    }
                    Claimed_Refund = true;
                }
            }
            rem_amount = 0;
        }
        uint allocated_amount = 0;
        if(Claimed_Refund==false)
        {
            for(i=0;i<4;i++)
            {
                for(j=0;j<Num_Participants;j++)
                {
                    if(Participant_Info[Participant_Addresses[j]].choices[i] == Answers[i])
                    {
                        Participant_Info[Participant_Addresses[j]].Pending_amount += (3*Total_Fee)/64;
                        allocated_amount += (3*Total_Fee)/64;
                    }
                }
            }
            rem_amount = Total_Fee - allocated_amount;
        }
        uint amount;
        for(j=0;j<Num_Participants;j++)
        {
            amount = Participant_Info[Participant_Addresses[j]].Pending_amount ;
            Participant_Info[Participant_Addresses[j]].Pending_amount = 0;
            if(amount>0)
            {
                Participant_Addresses[j].transfer(amount);
            }
        }
        Owner.transfer(rem_amount);
        rem_amount = 0;
        allocated_amount = 0;
    }
}
