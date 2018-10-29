pragma solidity ^0.4.24;
    
    contract Combinatorial_Auction {
        
        string question1;   //Storing the questions 1 to 4
        string question2;
        string question3;
        string question4;
        
        string answer1;     //Storing the answers 1 to 4
        string answer2;
        string answer3;
        string answer4;
        
        uint n;             //max number of participants allowed in the quiz
        uint totalFee;
        uint participationFee;
        uint quizMasterFee;
        
        address private quizMaster;
        
        address[] private participants;
        
         mapping(address => uint) correctAnswerCountMapping;
         mapping(address => uint) public participantEarning;
        
        //This makes sure that quizMaster cannot become a particiant
        modifier notQuizMaster(){
            require(msg.sender!=quizMaster,"QuizMaster cannot become a particiant");
        _;}
        
        //Everyone inputs the same participationFee
        modifier feeEqualToPFee(uint _participationFee){
            require(_participationFee==participationFee,"Any Fee other than participationFee is not acceptable");
        _;}
        
        //Checks the number of participants in the game == n
        modifier numberOfParticipants(){
            require(n>0,"No more participants can participate");
        _;}
        
        //Checks if the numberOfParticipants == n or we have reached revealDeadline
        modifier verifyRevealDeadline(){
            require(n==0,"More Participants are required");
        _;}
        
        constructor(string _question1,string _answer1,string _question2,string _answer2,string _question3,string _answer3,string _question4,string _answer4,uint _participationFee, uint _n) 
        public
        {
            question1 = _question1;
            answer1 = _answer1;
            
            question2 = _question2;
            answer2 = _answer2;
            
            question3 = _question3;
            answer3 = _answer3;
            
            question4 = _question4;
            answer4 = _answer4;
            
            participationFee = _participationFee;
            
            n = _n;
            
            quizMaster = msg.sender;
            
            totalFee = 0;
        }
        
        function displayQuestion()
        public
        view                                //https://ethereum.stackexchange.com/questions/27181/remix-warnings-state-mutability-and-public-visibility
        returns(string,string,string,string,uint)
        {
            return(question1,question2,question3,question4,participationFee);
        }
        
        
        function registerParticipants(string _answer1,string _answer2,string _answer3,string _answer4)
        public
        payable
        notQuizMaster()
        feeEqualToPFee(msg.value)
        numberOfParticipants()
        {
            totalFee = totalFee + participationFee;
            calculateCorrectAnswer(_answer1,_answer2,_answer3,_answer4);
            n=n-1;
        }
        
        
        function calculateCorrectAnswer(string _answer1,string _answer2,string _answer3,string _answer4)
        private
        {
            uint count=0;
            if(compareStrings(_answer1,answer1))
                count++;
            if(compareStrings(_answer2,answer2))
                count++;
            if(compareStrings(_answer3,answer3))
                count++;
            if(compareStrings(_answer4,answer4))
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
        
        function calculateAmountPad()
        public
        view
        verifyRevealDeadline()
        {
            uint payableValue;
            uint remainingFee=totalFee;
            uint count;
            for(uint i=0;i<participants.length;i++){
                payableValue=0;
                count = correctAnswerCountMapping[participants[i]];
                payableValue = (3*count*totalFee)/16;    
                
                remainingFee -= payableValue;
            }
            totalFee = remainingFee;
        }
		function withdraw()
    public
    {
        if(msg.sender == quizMaster){
            msg.sender.transfer(quizMasterFee);
            quizMasterFee = 0;
        }
        else
        {
            msg.sender.transfer(participantEarning[msg.sender]);
            participantEarning[msg.sender] = 0;
        }
    }
    }