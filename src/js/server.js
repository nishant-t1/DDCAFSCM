const Web3 = require('web3');
const nodemailer = require('nodemailer');

const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));

const contractABI = /* ABI from build/contracts/ProductVerification.json */;
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const productVerification = new web3.eth.Contract(contractABI, contractAddress);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

productVerification.events.FakeProductReported({
    fromBlock: 0
}, function(error, event) {
    if (error) {
        console.log(error);
    } else {
        const { reporter, productId, location, timestamp } = event.returnValues;
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'manufacturer-email@example.com',
            subject: 'Fake Product Alert',
            text: `A fake product with ID ${productId} was reported by ${reporter} at location ${location} on ${new Date(timestamp * 100
::contentReference[oaicite:0]{index=0}
 
