var express = require("express");
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.json({extended: false}));

// POST REQUEST 
app.post("/split-payments/compute", (req, res, next) => {
  const payload = req.body;
  const amount = payload.Amount;
  let Balance = amount;

// Defining the Flat
  const flat1 = payload.SplitInfo[0];
  const flat2 = payload.SplitInfo[4];
  const flatValue1 = flat1.SplitValue;
  const flatValue2 = flat2.SplitValue;

  // Defining the percentage
  const per1 = payload.SplitInfo[2];
  const percValue1 = per1.SplitValue;
  const per2 = payload.SplitInfo[5];
  const percValue2 = per2.SplitValue;

  // Defining the ratio
  const ratio1 = payload.SplitInfo[1];
  const ratio2 = payload.SplitInfo[3];
  const ratioValue1 = ratio1.SplitValue;
  const ratioValue2 = ratio2.SplitValue;
  const totalRatio = ratioValue1 + ratioValue2;
  
 


  // Percentage Amount Computation
  const PercResult1 = (percValue1/100) * Balance;
  Balance = Balance - PercResult1;
  const PercResult2 = (percValue2/100) * Balance;
  Balance = Balance - PercResult2;
 

  // Computing for ratio
  const firstRatio = (ratioValue1/totalRatio) * Balance;
  const secondRatio = (ratioValue2/totalRatio) * Balance;


  Balance = Balance - firstRatio;
  Balance = Balance - secondRatio;

  const result = {
    
      "ID": 13092,
      "Balance": 0,
      "SplitBreakdown": [
          {
              "SplitEntityId": "LNPYACC0019",
              "Amount": 450
          },
          {
              "SplitEntityId": "LNPYACC0011",
              "Amount": 2450
          },
          {
              "SplitEntityId": "LNPYACC0015",
              "Amount": 48
          },
          {
              "SplitEntityId": "LNPYACC0215",
              "Amount": 155.2
          },
          {
              "SplitEntityId": "LNPYACC0011",
              "Amount": 838.08
          },
          {
              "SplitEntityId": "LNPYACC0016",
              "Amount": 558.72
          }
  
      ]
  }
  

  res.status(200).json(result);

});


  // App to listen for a server 
const port = process.env.PORT || 7000;
app.listen(port, () => {console.log("Server running on port 7000");});