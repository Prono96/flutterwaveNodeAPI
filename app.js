var express = require("express");
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.json({extended: false}));

// POST REQUEST 
app.post("/split-payments/compute", (req, res, next) => {
  const payload = req.body;
  const amount = payload.Amount;
  let Balance = amount;
  const result = {
    ID: payload.ID,
    Balance,
    SplitBreakdown: []
  }
  percentageArr = [];
  ratioObj = {
    totalRatio: 0,
  };

  ratioArray = [];
  ratioValues = []

  // Sort payload
  for (const aSplitInfo of payload.SplitInfo) {
    if (aSplitInfo.SplitType === 'FLAT'){
      result.Balance = computeFlat(result.Balance, aSplitInfo.SplitValue)
      result.SplitBreakdown.push({
        SplitEntityId: aSplitInfo.SplitEntityId,
        Amount: aSplitInfo.SplitValue
      })
      continue;
    } else if (aSplitInfo.SplitType === 'PERCENTAGE') {
      percentageArr.push(aSplitInfo);
      continue;
    } else {
      ratioObj.totalRatio = ratioObj.totalRatio + aSplitInfo.SplitValue
      ratioArray.push(aSplitInfo)
      continue;
    }
  }

  for (let i = 0; i < percentageArr.length; i++) {
    const aSplitInfo = percentageArr[i];
    const { newBalance, percResult } = computePercentage(result.Balance, aSplitInfo.SplitValue)
    result.Balance = newBalance;
    result.SplitBreakdown.push({
      SplitEntityId: aSplitInfo.SplitEntityId,
      Amount: percResult
    })
  }

  for (const aSplitInfo of ratioArray) {
    const ratioValue = computeRatio(result.Balance, aSplitInfo.SplitValue, ratioObj.totalRatio)
    ratioValues.push(ratioValue);
    result.SplitBreakdown.push({
      SplitEntityId: aSplitInfo.SplitEntityId,
      Amount: ratioValue
    })
  }

  for (const ratioValue of ratioValues) {
    result.Balance = computeRatioResult(result.Balance, ratioValue)
  }
  
  function computeFlat(Balance, flatValue){
    return Balance - flatValue;
  }

  function computePercentage(Balance, percValue){
    const percResult = (percValue/100) * Balance
    const newBalance = Balance - percResult;
    return {newBalance, percResult}

  }

  function computeRatio(Balance, ratioValue, totalRatio){
    return (ratioValue/totalRatio) * Balance
  }

  function computeRatioResult(Balance, ratioValue){
    return Balance - ratioValue
  }
  
  res.status(200).json(result);
  
 });


// App to listen for a server 
const port = process.env.PORT || 3000;
app.listen(port, () => {console.log("Server running on port 3000");});