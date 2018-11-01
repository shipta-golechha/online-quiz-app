pragma solidity ^0.4.24;
    
    contract Combinatorial_Auction {
        
        string Q1;   //Storing the questions 1 to 4
        string Q2;
        string Q3;
        string Q4;
        
        string A1;     //Storing the answers 1 to 4
        string A2;
        string A3;
        string A4;
        
        uint n;             //max number of participants allowed in the quiz
        uint tFee;
        uint pFee;
        uint contractFee;
        uint total;
        address private Contractor;
        
        address[] private participants;
        
         mapping(address => uint) correctAnswerCountMapping;
         mapping(address => uint) public participantEarning;
        
        //This makes sure that Contractor cannot become a particiant
        modifier notContractor(){
            require(msg.sender!=Contractor,"Contractor cannot become a particiant");
        _;}
        
        //Everyone inputs the same pFee
        modifier feeEqualToPFee(uint _pFee){
            require(_pFee==pFee,"Any Fee other than pFee is not acceptable");
        _;}
        
        //Checks the number of participants in the game == n
        modifier participantscount(){
            require(total<=n,"Sorry, No other Participants can participate");
        _;}
        modifier checkParticipantsN(){
            require(total==n,"Game will start when all participants enter");
        _;}
        modifier OnlyContractor(){
            require(msg.sender==Contractor,"Only Contractor can calculate total amount to be paid!");
        _;}
        constructor(string _Q1,string _A1,string _Q2,string _A2,string _Q3,string _A3,string _Q4,string _A4,uint _pFee, uint _n) 
        payable
        public
        {
            Q1 = _Q1;
            A1 = _A1;
            
            Q2 = _Q2;
            A2 = _A2;
            
            Q3 = _Q3;
            A3 = _A3;
            
            Q4 = _Q4;
            A4 = _A4;
            
            pFee = _pFee;
            
            n = _n;
            
            Contractor = msg.sender;
            
            contractFee = n*pFee*1/4;
            
            tFee = 0;
            total = 0;
        }
        
        function displayQuestion()
        public
        view                                
        returns(string,string,string,string,uint)
        {
            return(Q1,Q2,Q3,Q4,pFee);
        }
        
        
        function registerParticipants(string _A1,string _A2,string _A3,string _A4)
        public
        notContractor()
        participantscount()
        {
            tFee = tFee + pFee;
            calculateCorrectAnswer(_A1,_A2,_A3,_A4);
            total=total+1;
        }
        
        
        function calculateCorrectAnswer(string _A1,string _A2,string _A3,string _A4)
        private
        {
            uint count=0;
            if(compareStrings(_A1,A1))
                count++;
            if(compareStrings(_A2,A2))
                count++;
            if(compareStrings(_A3,A3))
                count++;
            if(compareStrings(_A4,A4))
                count++;
            
            correctAnswerCountMapping[msg.sender]=count;  
            participants.push(msg.sender) -1;
        }
        
        function compareStrings (string _a, string _b)
        private
        pure 
        returns (bool)
        {
            bytes memory a = bytes(_a);
            bytes memory b = bytes(_b);
            return keccak256(a) == keccak256(b);
        }
        
        function calculateAmountPaid()
        public
        view
        OnlyContractor()
        checkParticipantsN()

        {
            uint payableValue;
            uint remainingFee=tFee;
            uint count;
            for(uint i=0;i<participants.length;i++){
                payableValue=0;
                count = correctAnswerCountMapping[participants[i]];
                payableValue = (3*count*tFee)/16;    
                participantEarning[msg.sender]=payableValue;
                remainingFee -= payableValue;
            }
            tFee = remainingFee;
        }
        function withdraw()
        payable
        public
        {
            if(msg.sender == Contractor){
                msg.sender.transfer(contractFee);
                contractFee = 0;
            }
            else
            {
                msg.sender.transfer(participantEarning[msg.sender]);
                participantEarning[msg.sender] = 0;
            }
        }
    }
