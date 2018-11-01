pragma solidity ^0.4.24;
    
    contract OnlineQuiz {
        uint n;            
        uint tFee;
        uint pFee;
        uint contractFee;
        uint total;
        
        string Q1;   
        string Q2;
        string Q3;
        string Q4;
        
        string A1;     
        string A2;
        string A3;
        string A4;
        
        
        address private Contractor;
        
        address[] private participants;
        
        mapping(address => uint) ParticipantCorrectAnsCount;
        
        modifier notContractor(){
            require(msg.sender!=Contractor,"Contractor cannot become a particiant");
        _;}
        
        modifier CheckIFAlreadyRegister(){
            bool flag = false;
            for(uint i=0;i<participants.length; i++)
            {
                if(msg.sender == participants[i])
                {
                    flag = true;
                    break;
                }
            }
            require(flag == false,"Participant Already Registered");

        _;}
        
        modifier participantscount(){
            require(total<=n,"Sorry, No other Participants can participate");
        _;}
        
        modifier OnlyContractor(){
            require(msg.sender==Contractor,"Only Contractor can calculate total amount to be paid!");
        _;}
        
        modifier CheckPayFeeEqual(uint _pFee){
            require(_pFee==pFee,"Any Fee other than participationFee is not acceptable");
        _;}

        constructor(string _Q1,string _A1,string _Q2,string _A2,string _Q3,string _A3,string _Q4,string _A4,uint _pFee, uint _n)
        public
        {
            Q1 = _Q1;
            Q2 = _Q2;
            Q3 = _Q3;
            Q4 = _Q4;

            A1 = _A1;
            A2 = _A2;
            A3 = _A3;
            A4 = _A4;
            
            pFee = _pFee;
            n = _n;
            
            Contractor = msg.sender;
            contractFee = (n*pFee)/4;
            
            tFee = 0;
            total = 0;
        }
        
        function Questions_Display()
        public
        view                                
        returns(string,string,string,string)
        {
            return(Q1,Q2,Q3,Q4);
        }
        
        
        function registerParticipants(string _A1,string _A2,string _A3,string _A4)
        public
        payable
        notContractor()
        participantscount()
        CheckIFAlreadyRegister()
        CheckPayFeeEqual(msg.value)
        returns (string,uint)
        {
            tFee = tFee + pFee;
            uint a=calculateCorrectAnswer(_A1,_A2,_A3,_A4);
            total=total+1;
            return("Total number of correct answers",a);
        }
        
        function getParticipantsLength()
        public
        returns(uint)
        {
            return(participants.length);
        }
        function calculateCorrectAnswer(string _A1,string _A2,string _A3,string _A4)
        private
        returns (uint)
        {
            uint count=0;
            if(checkEqual(_A1,A1))
                count++;
            if(checkEqual(_A2,A2))
                count++;
            if(checkEqual(_A3,A3))
                count++;
            if(checkEqual(_A4,A4))
                count++;
            
            ParticipantCorrectAnsCount[msg.sender]=count;  
            participants.push(msg.sender) ;
            
            return (count);
        }
        function checkEqual (string _a, string _b)
        private
        pure 
        returns (bool)
        {
            bytes memory a = bytes(_a);
            bytes memory b = bytes(_b);
            return keccak256(a) == keccak256(b);
        }
        
        function TransferAmount()
        public
        returns (string,address,uint)
        {
            uint val=0;
            if(msg.sender == Contractor){
                val=contractFee;
                msg.sender.transfer(contractFee);
                contractFee = 0;
                
            }
            else
            {
                val=(ParticipantCorrectAnsCount[msg.sender]*3*tFee)/16;
                msg.sender.transfer(val);
                ParticipantCorrectAnsCount[msg.sender] = 0;
            }
            return("total amount Earned: ",msg.sender,val);
        }
    }
