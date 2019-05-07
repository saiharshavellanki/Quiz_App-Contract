var Quiz = artifacts.require("Quiz");
contract("Quiz", accounts => {
    const owner = accounts[0];
    const secret = "0x6ac6a6eb24e80fbbd8f294a780b932c175209c162df5b5d8f649e11df7b7af29";
    describe("constructor", () => {
        describe("assert contract is deployed", () => {
            it("should deploy this contract", async () => {
                const instance = await Quiz.new(5,100,5, {from: owner});

                let n = await instance.Max_Participants.call();
                let fee = await instance.Participation_Fee.call();

                assert.isNotNull(instance);
                assert.equal(n.toNumber(),5);
                assert.equal(fee.toNumber(),100);
            });
        });
        describe("Fail case", () => {
			it("should revert on invalid from address", async () => {
				try {
					const instance = await Quiz.new(5,100,5 ,{from: "lol"});
				} catch (err) {
					assert.equal(err.message, "invalid address");
				}
			});
        });
    });
    describe("RegisterParticipants", () => {
        let instance;
		beforeEach(async () => {
			instance = await Quiz.new(4,10,5, { from: owner });
        });
        describe("Fail case", () => {
            it("Owner should not register", async () => {
                try {
                    let instance2 = await instance.RegisterParticipants({from: owner, value : web3.toWei(10,'wei')});
                } 
                catch (err) {
                    assert.isUndefined(err.message, "revert with valid agreements");
                }
            });
        });
        describe("Success case", () => {
            it("Participant should register", async () => {
                try {
                    let instance2 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(10,'wei')});
                } 
                catch (err) {
                    assert.isUndefined(err.message, "revert with valid agreements");
                }
            });
        });
        describe("Fail case", () => {
            it("Insufficient Fee", async () => {
                try {
                    let instance2 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(5,'wei')});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Times up", async () => {
                try {
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    await delay(7*1000);
                    let instance2 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(10,'wei')});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
      
        describe("Fail case", () => {
            it("Participant already registered", async () => {
                try {
                    let instance2 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(10,'wei')});
                    let instance3 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(10,'wei')});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Participant already registered", async () => {
                try {
                    let instance2 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(10,'wei')});
                    let instance4 = await instance.RegisterParticipants({from: accounts[2], value : web3.toWei(10,'wei')});
                    let instance3 = await instance.RegisterParticipants({from: accounts[3], value : web3.toWei(10,'wei')});
                    let instance5 = await instance.RegisterParticipants({from: accounts[4], value : web3.toWei(10,'wei')});
                    let instance6 = await instance.RegisterParticipants({from: accounts[5], value : web3.toWei(10,'wei')});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
    });
    describe("StartQuiz", () => {
        let instance;
        let instance2;
        let instance3;
        let instance4;
        let instance5;


		beforeEach(async () => {
            instance = await Quiz.new(4,10,5, { from: owner });
            instance2 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(10,'wei')});
            instance4 = await instance.RegisterParticipants({from: accounts[2], value : web3.toWei(10,'wei')});
            instance3 = await instance.RegisterParticipants({from: accounts[3], value : web3.toWei(10,'wei')});
            instance5 = await instance.RegisterParticipants({from: accounts[4], value : web3.toWei(10,'wei')});
                    
        });
        describe("Success case", () => {
            it("Owner is calling the function", async () => {
                try {
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    await delay(6*1000);
                    let instance6 = await instance.StartQuiz("1+2?","11+21?","1111+211?","1111+2111?",[3,32,1322,3222],secret,[10,10,10,10],40,{from: owner});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Trying to start early", async () => {
                try {
                    let instance6 = await instance.StartQuiz("1+2?","11+21?","1111+211?","1111+2111?",[3,32,1322,3222],secret,[10,10,10,10],40,{from: owner});                
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
 
        describe("Fail case", () => {
            it("Owner is not calling the function", async () => {
                try {
                    let instance6 = await instance.StartQuiz("1+2?","11+21?","1111+211?","1111+2111?",[3,32,1322,3222],secret,[10,10,10,10],40,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Trying to open questions after deadline", async () => {
                try {
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    await delay(10*1000);
                    let instance6 = await instance.StartQuiz("1+2?","11+21?","1111+211?","1111+2111?",[3,32,1322,3222],secret,[10,10,10,10],40,{from: owner});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Success case", () => {
            it("Perfect Start Quiz", async () => {
                try {
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    await delay(6*1000);
                    let instance6 = await instance.StartQuiz("1+2?","11+21?","1111+211?","1111+2111?",[3,32,1322,3222],secret,[10,10,10,10],60,{from: owner});
                } 
                catch (err) {
                    assert.equal(err.message, "EVM Exception while processing transaction: revert");
                }
            });
        });




    });

    describe("OpenQues", () => {
        let instance;
		beforeEach(async () => {
            instance = await Quiz.new(4,10,5, { from: owner });
        let instance2 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(10,'wei')});
        let instance4 = await instance.RegisterParticipants({from: accounts[2], value : web3.toWei(10,'wei')});
        let instance3 = await instance.RegisterParticipants({from: accounts[3], value : web3.toWei(10,'wei')});
        let instance5 = await instance.RegisterParticipants({from: accounts[4], value : web3.toWei(10,'wei')});    
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(6*1000);
        let instance6 = await instance.StartQuiz("1+2?","11+21?","1111+211?","1111+2111?",[3,32,1322,3222],secret,[10,10,10,10],60,{from: owner});
        });
        describe("Fail case", () => {
            it("Owner should not call the function", async () => {
                try {
                    let instance7 = await instance.OpenQues(2,{from: owner});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Success case", () => {
            it("Other Participants can call the function", async () => {
                try {
                    let instance7 = await instance.OpenQues(2,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Unregistered participant can't call the function", async () => {
                try {
                    let instance7 = await instance.OpenQues(2,{from: accounts[7]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Opening invalid question", async () => {
                try {
                    let instance7 = await instance.OpenQues(8,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });    
    });
    describe("SubmitAnswer", () => {
        let instance;
		beforeEach(async () => {
        instance = await Quiz.new(4,10,5, { from: owner });
        let instance2 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(10,'wei')});
        let instance4 = await instance.RegisterParticipants({from: accounts[2], value : web3.toWei(10,'wei')});
        let instance3 = await instance.RegisterParticipants({from: accounts[3], value : web3.toWei(10,'wei')});
        let instance5 = await instance.RegisterParticipants({from: accounts[4], value : web3.toWei(10,'wei')});    
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(6*1000);
        let instance6 = await instance.StartQuiz("1+2?","11+21?","1111+211?","1111+2111?",[3,32,1322,3222],secret,[10,10,10,10],60,{from: owner});
    });
        describe("Success case", () => {
            it("Participant opened the question and submitted the  response", async () => {
                try {
                    let instance7 = await instance.OpenQues(2,{from: accounts[1]});
                    let insance9 = await instance.SubmitAnswer(2,2,secret,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Participant can't submit the response without opening the question", async () => {
                try {
                    let insance9 = await instance.SubmitAnswer(2,2,secret,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Owner can't submit the response", async () => {
                try {
                    let insance9 = await instance.SubmitAnswer(2,2,secret,{from: owner});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
    });
    describe("RevealAnswer", () => {
        let instance;
		beforeEach(async () => {
        instance = await Quiz.new(4,10,5, { from: owner });
        let instance2 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(10,'wei')});
        let instance4 = await instance.RegisterParticipants({from: accounts[2], value : web3.toWei(10,'wei')});
        let instance3 = await instance.RegisterParticipants({from: accounts[3], value : web3.toWei(10,'wei')});
        let instance5 = await instance.RegisterParticipants({from: accounts[4], value : web3.toWei(10,'wei')});    
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(6*1000);
        let instance6 = await instance.StartQuiz("1+2?","11+21?","1111+211?","1111+2111?",[3,32,1322,3222],secret,[10,10,10,10],60,{from: owner});
    });
        describe("Fail case", () => {
            it("Owner can't reveal the answers", async () => {
                try {
                    let instance7 = await instance.OpenQues(2,{from: accounts[1]});
                    let insance9 = await instance.SubmitAnswer(2,2,secret,{from: accounts[1]});
                    let insance8 = await instance.RevealAnswer(2,2,secret,{from: owner});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Unregistered participant can't reveal any answers", async () => {
                try {
                    let instance7 = await instance.OpenQues(2,{from: accounts[1]});
                    let insance9 = await instance.SubmitAnswer(2,2,secret,{from: accounts[1]});
                    let insance8 = await instance.RevealAnswer(2,2,secret,{from: accounts[8]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Revealing answer for invalid question", async () => {
                try {
                    let instance7 = await instance.OpenQues(2,{from: accounts[1]});
                    let insance9 = await instance.SubmitAnswer(2,2,secret,{from: accounts[1]});
                    let insance8 = await instance.RevealAnswer(6,2,secret,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Revealing answer after deadline", async () => {
                try {
                    let instance7 = await instance.OpenQues(2,{from: accounts[1]});
                    let insance9 = await instance.SubmitAnswer(2,2,secret,{from: accounts[1]});
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    await delay(6*1000);
                    let insance8 = await instance.RevealAnswer(2,2,secret,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Changing answer while revealing", async () => {
                try {
                    let instance7 = await instance.OpenQues(2,{from: accounts[1]});
                    let insance9 = await instance.SubmitAnswer(2,2,secret,{from: accounts[1]});
                    let insance8 = await instance.RevealAnswer(2,3,secret,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
    });
    describe("RevealOriginalAnswer", () => {
        let instance;
		beforeEach(async () => {
        instance = await Quiz.new(4,10,5, { from: owner });
        let instance2 = await instance.RegisterParticipants({from: accounts[1], value : web3.toWei(10,'wei')});
        let instance4 = await instance.RegisterParticipants({from: accounts[2], value : web3.toWei(10,'wei')});
        let instance3 = await instance.RegisterParticipants({from: accounts[3], value : web3.toWei(10,'wei')});
        let instance5 = await instance.RegisterParticipants({from: accounts[4], value : web3.toWei(10,'wei')});    
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(6*1000);
        let instance6 = await instance.StartQuiz("1+2?","11+21?","1111+211?","1111+2111?",[3,32,1322,3222],secret,[10,10,10,10],60,{from: owner});
    });
        describe("Fail case", () => {
            it("Only owner can reveal the answers", async () => {
                try {
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    await delay(65*1000);
                    let instance7 = await instance.RevealOriginalAnswer(2,2,secret,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Should reveal the answers in time", async () => {
                try {
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    await delay(150*1000);
                    let instance7 = await instance.RevealOriginalAnswer(2,2,secret,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
        describe("Fail case", () => {
            it("Should reveal the answers after the max_reveal time only", async () => {
                try {
                    let instance7 = await instance.RevealOriginalAnswer(2,2,secret,{from: accounts[1]});
                } 
                catch (err) {
                    assert.equal(err.message, "VM Exception while processing transaction: revert");
                }
            });
        });
    });
});