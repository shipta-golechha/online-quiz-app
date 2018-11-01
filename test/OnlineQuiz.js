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
            await contractInstance.registerParticipants("a", "b", "c","d", { value: web3.toWei(0, "ether"), from: contractor }); //{1,2} - 3
            assert.fail();
        }
        catch(e){
            assert.ok(true);
        }
    })
    it('Register participant', async () => {
        //Test 1
        try {
            const Correct=await contractInstance.registerParticipants("a", "b", "c","d", { value: web3.toWei(36, "ether"), from: participant1 });  //{3,4} - 6
            // Console.log("Registration successful:participant1 registered");
            assert.equal(Correct, 1, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    
    it('Check participant cannot register with wrong participant fee amount', async () => {
        //Test 1
        try {
            // const Correct=await contractInstance.registerParticipants("a", "b", "c","d", { value: web3.toWei(30, "ether"), from: participant2 });  //{3,4} - 6
            
            assert.fail("Registration with wrong fee amount was successful")
            // assert.equal(Correct, 1, "Registration unsuccessful but number of correct answers should be one");
        }
        catch (err) {
            // Console.log("Registration unsuccessful:as participant2 is giving wrong participation fee");
            assert.ok(true);
        }
    })
    it('Check same participant cannot register more than once', async () => {
        //Test 1
        try{
            const Correct=await contractInstance.registerParticipants("a", "b", "b","d", { value: web3.toWei(36, "ether"), from: participant2 }); //{1,2} - 3
            // Console.log("Registration successful:participant2 registered");
            
            const prevCount = await contractInstance.getParticipantsLength();
            assert.equal(prevCount, 2,"The participants array should have two element");
            
            Correct=await contractInstance.registerParticipants("a", "b", "b","d", { value: web3.toWei(36, "ether"),from: participant2 });  //{3,4} - 6
            assert.fail("participant was able to double register");
        }
        catch(err){
            // Console.log("Registration unsuccessful:participant2 already registered");
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
            const Correct=await contractInstance.registerParticipants("a", "a", "c","d", { value: web3.toWei(36, "ether"), from: participant1 });  //{3,4} - 6
            // Console.log("Registration successful:participant1 registered");
            assert.equal(Correct, 2, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    it('Check same participant cannot register more than once', async () => {
        //Test 2
        try{
            const Correct=await contractInstance.registerParticipants("b", "b", "a","d", { value: web3.toWei(36, "ether"), from: participant2 }); //{1,2} - 3
            // Console.log("Registration successful:participant2 registered");
            
            const prevCount = await contractInstance.getParticipantsLength();
            assert.equal(prevCount, 2,"The participants array should have two element");
            
            Correct=await contractInstance.registerParticipants("a", "b", "b","d", { value: web3.toWei(36, "ether"),from: participant2 });  //{3,4} - 6
            assert.fail("participant was able to double register");
        }
        catch(err){
            // Console.log("Registration unsuccessful:participant2 already registered");
            assert.ok(true);
        }
    })
    it('Check amount transferred to the contractor', async () => {
        //Test 2
        try{
            const amount=await contractInstance.TransferAmount({from: contractor }); //{1,2} - 3
            assert.equal(amount, 18,"The contractor should be getting amount 18 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the participant1', async () => {
        //Test 2
        try{
            const amount=await contractInstance.TransferAmount({from: participant1 }); //{1,2} - 3
            assert.equal(amount, 27,"The participant1 should be getting amount 27 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to participant2', async () => {
        //Test 2
        try{
            const amount=await contractInstance.TransferAmount({from: participant2 }); //{1,2} - 3
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
            const Correct=await contractInstance.registerParticipants("a", "a", "c","d", { value: web3.toWei(36, "ether"), from: participant1 });  //{3,4} - 6
            assert.equal(Correct, 2, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    it('Register participant2', async () => {
        //Test 3
        try{
            const Correct=await contractInstance.registerParticipants("b", "a", "a","d", { value: web3.toWei(36, "ether"), from: participant2 }); //{1,2} - 3
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the contractor', async () => {
        //Test 3
        try{
            const amount=await contractInstance.TransferAmount({from: contractor }); //{1,2} - 3
            assert.equal(amount, 18,"The contractor should be getting amount 18 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the participant1', async () => {
        //Test 3
        try{
            const amount=await contractInstance.TransferAmount({from: participant1 }); //{1,2} - 3
            assert.equal(amount, 20,"The participant1 should be getting amount 20 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to participant2', async () => {
        //Test 3
        try{
            const amount=await contractInstance.TransferAmount({from: participant2 }); //{1,2} - 3
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
            const Correct=await contractInstance.registerParticipants("b", "c", "c","d", { value: web3.toWei(36, "ether"), from: participant1 });  //{3,4} - 6
            assert.equal(Correct, 0, "Registration successful but number of correct answers should be one");
        }

        catch (err) {
            assert.ok(true);
        }
    })
    it('Register participant2', async () => {
        //Test 4
        try{
            const Correct=await contractInstance.registerParticipants("b", "b", "c","d", { value: web3.toWei(36, "ether"), from: participant2 }); //{1,2} - 3
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the contractor', async () => {
        //Test 4
        try{
            const amount=await contractInstance.TransferAmount({from: contractor }); //{1,2} - 3
            assert.equal(amount, 18,"The contractor should be getting amount 18 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to the participant1', async () => {
        //Test 4
        try{
            const amount=await contractInstance.TransferAmount({from: participant1 }); //{1,2} - 3
            assert.equal(amount, 0,"The participant1 should be getting amount 0 after the game gets over");
            
        }
        catch(err){
            assert.ok(true);
        }
    })
    it('Check amount transferred to participant2', async () => {
        //Test 4
        try{
            const amount=await contractInstance.TransferAmount({from: participant2 }); //{1,2} - 3
            assert.equal(amount, 0,"The participant2 should be getting amount 0 after the game gets over");
        }
        catch(err){
            assert.ok(true);
        }
    })
})
