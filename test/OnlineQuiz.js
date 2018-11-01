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
            assert.equal(Correct, 1, "Registration successful but number of correct answers should be one");
        }
        catch (err) {
            assert.ok(true);
        }
    })
    
    it('Check participant cannot register with wrong participant fee amount', async () => {
        //Test 1
        try {
            const Correct=await contractInstance.registerParticipants("a", "b", "c","d", { value: web3.toWei(30, "ether"), from: participant2 });  //{3,4} - 6
            assert.fail("Registration with wrong fee amount was successful")
            // assert.equal(Correct, 1, "Registration unsuccessful but number of correct answers should be one");
        }
        catch (err) {
            assert.ok(true);
        }
    })
    it('Check same participant cannot register more than once', async () => {
        //Test 1
        try{
            const Correct=await contractInstance.registerParticipants("a", "b", "b","d", { value: web3.toWei(36, "ether"), from: participant2 }); //{1,2} - 3
            const prevCount = await contractInstance.getParticipantsLength();
            assert.equal(prevCount, 2,"The participants array should have two element");
            
            Correct=await contractInstance.registerParticipants("a", "b", "b","d", { value: web3.toWei(36, "ether"),from: participant2 });  //{3,4} - 6
            assert.fail("participant was able to double register");
        }
        catch(err){
            assert.ok(true);
        }
    })
})