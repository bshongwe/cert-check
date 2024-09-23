// #1. Defs
const express = require("express");
const bodyParser = require("body-parser");
const { Blockchain, Block } = require("./blockchain");

// #2. App
const app = express();
const port = 3000;

// #3. App Route Defs
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// #4. Variables
let blockchain = new Blockchain();

// #5. Main Route
app.get("/", (req, res) => {
  res.render("index", { certificateId: null });
});

// #5.1 Issue Route
app.post("/issue-certificate", (req, res) => {
  const { recipient, certificateName } = req.body;
  const certificateId = generateCertificateId();
  const newBlock = new Block(blockchain.chain.length, new Date().toString(), {
    certificateId,
    recipient,
    certificateName,
  });
  blockchain.addBlock(newBlock);
  console.log(newBlock);
  res.render("index", { certificateId });
});

// #5.2 Verify Route
app.get("/verify-certificate/", (req, res) => {
  res.render("verify", { isValid: null });
});

// #6. GET: Block Route
app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

// #7. POST: Verify
app.post("/verify-certificate", (req, res) => {
  const { certificateId } = req.body;
  const block = blockchain.chain.find(
    (block) => block.data.certificateId === certificateId
  );
  const isValid = block !== undefined;
  res.render("verify", { certificateId, isValid });
});

// #7.1 Generate Cert iD
function generateCertificateId() {
  return Math.random().toString(36).substring(2, 10);
}

// #8. Server PORT
app.listen(port, () => {
  console.log(`Cert-Check is listening at http://localhost:${port}`);
});
