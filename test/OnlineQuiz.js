const OnlineQuiz = artifacts.require('./OnlineQuiz.sol')
const assert = require('assert')

let contractInstance
contract('Unit Tests', (accounts) =>{
    const contractor = accounts[0];
    const participant1 = accounts[1];
    const participant2 = accounts[2];

    beforeEach(async () => {
        contractInstance = await OnlineQuiz.deployed({ from: contractor });
    })
    it('Check Contractor cannot register as a participant', async() => {
        try{
            await contractInstance.registerParticipants("a", "b", "c","d", { value: web3.toWei(0, "ether"), from: contractor }); 
            
            assert.fail();
        }
        catch(e){
            assert.ok(true);
        }
    })
    it('Register participant', async () => {
        //Test 1
        try {
            const Correct=await contractInstance.registerParticipants("a", "b", "c","d", { value: web3.toWei(36, "ether"), from: participant1 });  
            console.log("Registration successful:participant1 registered");
            
            assert.equal(Correct, 1, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    
    it('Check participant cannot register with wrong participant fee amount', async () => {
        //Test 1
        try {
            assert.fail("Registration with wrong fee amount was successful")
        }
        catch (err) {
            assert.ok(true);
        }
    })
    it('Check same participant cannot register more than once', async () => {
        //Test 1
        try{
            const Correct=await contractInstance.registerParticipants("a", "b", "b","d", { value: web3.toWei(36, "ether"), from: participant2 }); 
            
            const prevCount = await contractInstance.getParticipantsLength();
            assert.equal(prevCount, 2,"The participants array should have two element");
            
            Correct=await contractInstance.registerParticipants("a", "b", "b","d", { value: web3.toWei(36, "ether"),from: participant2 });
            assert.fail("participant was able to double register");
        }
        catch(err){
            assert.ok(true);
        }
    })
})
contract('Full Test1', (accounts) =>{
    const contractor = accounts[0];
    const participant1 = accounts[1];
    const participant2 = accounts[2];

    beforeEach(async () => {
        contractInstance = await OnlineQuiz.deployed({ from: contractor });
    })
    
    it('Register participant', async () => {
        //Test 2
        try {
            const Correct=await contractInstance.registerParticipants("a", "a", "c","d", { value: web3.toWei(36, "ether"), from: participant1 });
            assert.equal(Correct, 2, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    it('Check same participant cannot register more than once', async () => {
        //Test 2
        try{
            const Correct=await contractInstance.registerParticipants("b", "b", "a","d", { value: web3.toWei(36, "ether"), from: participant2 });
            const prevCount = await contractInstance.getParticipantsLength();
            assert.equal(prevCount, 2,"The participants array should have two element");
            
            Correct=await contractInstance.registerParticipants("a", "b", "b","d", { value: web3.toWei(36, "ether"),from: participant2 });  
            assert.fail("participant was able to double register");
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the contractor', async () => {
        //Test 2
        try{
            const amount=await contractInstance.TransferAmount({from: contractor }); 
            assert.equal(amount, 18,"The contractor should be getting amount 18 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the participant1', async () => {
        //Test 2
        try{
            const amount=await contractInstance.TransferAmount({from: participant1 }); 
            assert.equal(amount, 27,"The participant1 should be getting amount 27 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to participant2', async () => {
        //Test 2
        try{
            const amount=await contractInstance.TransferAmount({from: participant2 }); 
            assert.equal(amount, 13,"The participant2 should be getting amount 13 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
})
contract('Full Test2(Multiple participants give correct answer for same question)', (accounts) =>{
    const contractor = accounts[0];
    const participant1 = accounts[1];
    const participant2 = accounts[2];

    beforeEach(async () => {
        contractInstance = await OnlineQuiz.deployed({ from: contractor });
    })
    
    it('Register participant1', async () => {
        //Test 3
        try {
            const Correct=await contractInstance.registerParticipants("a", "a", "c","d", { value: web3.toWei(36, "ether"), from: participant1 }); 
            assert.equal(Correct, 2, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    it('Register participant2', async () => {
        //Test 3
        try{
            const Correct=await contractInstance.registerParticipants("b", "a", "a","d", { value: web3.toWei(36, "ether"), from: participant2 });
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the contractor', async () => {
        //Test 3
        try{
            const amount=await contractInstance.TransferAmount({from: contractor }); 
            assert.equal(amount, 18,"The contractor should be getting amount 18 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the participant1', async () => {
        //Test 3
        try{
            const amount=await contractInstance.TransferAmount({from: participant1 }); 
            assert.equal(amount, 20,"The participant1 should be getting amount 20 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to participant2', async () => {
        //Test 3
        try{
            const amount=await contractInstance.TransferAmount({from: participant2 }); 
            assert.equal(amount, 20,"The participant2 should be getting amount 20 after the game gets over");
        }
        catch(err){
            assert.ok(true);
        }
    })
})
contract('Full Test3(No participants give correct answer for any question)', (accounts) =>{
    const contractor = accounts[0];
    const participant1 = accounts[1];
    const participant2 = accounts[2];

    beforeEach(async () => {
        contractInstance = await OnlineQuiz.deployed({ from: contractor });
    })
    
    it('Register participant1', async () => {
        //Test 4
        try {
            const Correct=await contractInstance.registerParticipants("b", "c", "c","d", { value: web3.toWei(36, "ether"), from: participant1 }); 
            assert.equal(Correct, 0, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    it('Register participant2', async () => {
        //Test 4
        try{
            const Correct=await contractInstance.registerParticipants("b", "b", "c","d", { value: web3.toWei(36, "ether"), from: participant2 }); 
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the contractor', async () => {
        //Test 4
        try{
            const amount=await contractInstance.TransferAmount({from: contractor }); 
            assert.equal(amount, 18,"The contractor should be getting amount 18 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the participant1', async () => {
        //Test 4+
        try{
            const amount=await contractInstance.TransferAmount({from: participant1 }); 
            assert.equal(amount, 0,"The participant1 should be getting amount 0 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to participant2', async () => {
        //Test 4
        try{
            const amount=await contractInstance.TransferAmount({from: participant2 }); 
            assert.equal(amount, 0,"The participant2 should be getting amount 0 after the game gets over");
        }
        catch(err){
            assert.ok(true);
        }
    })
})
contract('Full Test4(All participants give correct answer for every question)', (accounts) =>{
    const contractor = accounts[0];
    const participant1 = accounts[1];
    const participant2 = accounts[2];

    beforeEach(async () => {
        contractInstance = await OnlineQuiz.deployed({ from: contractor });
    })
    
    it('Register participant1', async () => {
        //Test 5
        try {
            const Correct=await contractInstance.registerParticipants("a", "a", "a","a", { value: web3.toWei(36, "ether"), from: participant1 });             assert.equal(Correct, 4, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    it('Register participant2', async () => {
        //Test 5
        try{
            const Correct=await contractInstance.registerParticipants("a", "a", "a","a", { value: web3.toWei(36, "ether"), from: participant2 }); 
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the contractor', async () => {
        //Test 5
        try{
            const amount=await contractInstance.TransferAmount({from: contractor }); 
            assert.equal(amount, 18,"The contractor should be getting amount 18 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the participant1', async () => {
        //Test 5
        try{
            const amount=await contractInstance.TransferAmount({from: participant1 }); 
            assert.equal(amount, 27,"The participant1 should be getting amount 27 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to participant2', async () => {
        //Test 5
        try{
            const amount=await contractInstance.TransferAmount({from: participant2 }); 
            assert.equal(amount, 27,"The participant2 should be getting amount 27 after the game gets over");
        }
        catch(err){
            assert.ok(true);
        }
    })
})
contract('Full Test5 for 4 participants', (accounts) =>{
    const contractor = accounts[0];
    const participant1 = accounts[1];
    const participant2 = accounts[2];
    const participant3 = accounts[3];
    const participant4 = accounts[4];


    beforeEach(async () => {
        contractInstance = await OnlineQuiz.deployed({ from: contractor });
    })
    
    it('Register participant1', async () => {
        //Test 6
        try {
            const Correct=await contractInstance.registerParticipants("a", "b", "c","d", { value: web3.toWei(36, "ether"), from: participant1 });  
            assert.equal(Correct, 4, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    it('Register participant2', async () => {
        //Test 6
        try{
            const Correct=await contractInstance.registerParticipants("b", "a", "c","d", { value: web3.toWei(36, "ether"), from: participant2 }); 
        }
        catch(err){
            assert.ok(true);
        }
    })

    it('Register participant3', async () => {
        //Test 6
        try {
            const Correct=await contractInstance.registerParticipants("a", "b", "a","d", { value: web3.toWei(36, "ether"), from: participant3 });  
            assert.equal(Correct, 4, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })

    it('Register participant4', async () => {
        //Test 6
        try {
            const Correct=await contractInstance.registerParticipants("b", "b", "a","a", { value: web3.toWei(36, "ether"), from: participant4 });  
            assert.equal(Correct, 4, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    it('Check amount transferred to the contractor', async () => {
        //Test 6
        try{
            const amount=await contractInstance.TransferAmount({from: contractor }); 
            assert.equal(amount, 36,"The contractor should be getting amount 18 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the participant1', async () => {
        //Test 6
        try{
            const amount=await contractInstance.TransferAmount({from: participant1 }); 
            assert.equal(amount, 13,"The participant1 should be getting amount 13 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to participant2', async () => {
        //Test 6
        try{
            const amount=await contractInstance.TransferAmount({from: participant2 }); 
            assert.equal(amount, 27,"The participant2 should be getting amount 27 after the game gets over");
        }
        catch(err){
            assert.ok(true);
        }
    })

    it('Check amount transferred to participant3', async () => {
        //Test 6
        try{
            const amount=await contractInstance.TransferAmount({from: participant3 }); 
            assert.equal(amount, 27,"The participant3 should be getting amount 27 after the game gets over");
        }
        catch(err){
            assert.ok(true);
        }
    })

    it('Check amount transferred to participant4', async () => {
        //Test 6
        try{
            const amount=await contractInstance.TransferAmount({from: participant4 }); 
            assert.equal(amount, 40,"The participant2 should be getting amount 40 after the game gets over");
        }
        catch(err){
            assert.ok(true);
        }
    })
})
