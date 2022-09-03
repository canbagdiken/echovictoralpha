const { body, validationResult } = require("express-validator");

console.clear();

const db = require("./models");
const User = require("./models").User;
const User_Shares = require("./models").User_Share;

const express = require("express");
const user_share = require("./models/user_share");
const share_types = require("./models/").share_types;

const router = express.Router();
const app = express();

app.use(express.json()); // to support JSON-encoded bodies

const port = 80;



/**
 * Gets all users with them shares
 */
router.get("/getUsers", async (req, res) => {
  users = await User.findAll({include:{model:User_Shares, as:"userShares"}});
  return res.json(users);
});



/**
 * Sets price of a specific share
 */
router.post(
  "/setPrice",
  body("code").isAlpha().isLength({ min: 3, max: 3 }),
  body("price")
    .not()
    .isEmpty()
    .trim()
    .isDecimal({ allow_negatives: false }),

  async (req, res) => {

    // check are inputs valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    
    // check is share type exist
    _type = await share_types.findOne({ where: { code: req.body.code } });

    if(_type === null){
      return res.json({ status: false, msg: "invalid share code" });
    }
    
    _type.totalvalue = req.body.price;
    await _type.save();

    return res.json({ status: true, msg: "Price is updated successfully." });


  });


/**
 * provide trading as selling or buying with users portfolios
 */
router.post(
  "/trade",
  body("type").toLowerCase().isIn(["buy", "sell"]),
  body("user").isInt().isFloat({ min: 1 }),
  body("code").isAlpha().isLength({ min: 3, max: 3 }),
  body("amount")
    .not()
    .isEmpty()
    .trim()
    .isDecimal({ allow_negatives: false })
    .isFloat({ min: 0.01, max: 99.99 }),

  async (req, res) => {

    // check are inputs valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    // check is user exist
    var _user = await User.findOne({ where: { id: req.body.user } });
    if (_user === null) {
      return res.json({ status: false, msg: "invalid user" });
    }

    // check is share type exist
    _type = await share_types.findOne({ where: { code: req.body.code } });

    if(_type === null){
      return res.json({ status: false, msg: "invalid share code" });
    }
    





    //if selling
    if (req.body.type == "sell") {
      let _ratioOfUserShare = await User_Shares.findOne({
        where: { UserId: req.body.user, code: req.body.code },
      });

      
      if (_ratioOfUserShare === null) {
        return res.json({
          status: false,
          msg:
            "invalid ratio, you do not have any "+req.body.code
        });
      }

      _ratioOfUserShareValue = parseFloat(_ratioOfUserShare.amount);
      
      if (_ratioOfUserShareValue < req.body.amount) {
        return res.json({
          status: false,
          msg:
            "invalid ratio, you own " +
            String(_ratioOfUserShareValue) +
            "% of " +
            req.body.code,
        });
      } else {
        _ratioOfUserShare.amount =
          parseFloat(_ratioOfUserShare.amount) - parseFloat(req.body.amount);
        _ratioOfUserShare.save();

        
      let priceOfShareRatio = (_type.totalvalue / 100) * req.body.amount;
      let oldBalanceOfUser = _user.balance;//+10000; // extra balance for debug
      
      let newBalanceOfUser = parseFloat(oldBalanceOfUser) + parseFloat(priceOfShareRatio);

      
      _user.balance = newBalanceOfUser;
      await _user.save();


      let result = {};
      result.price = priceOfShareRatio;
      result.oldBalance = oldBalanceOfUser;


        return res.json({
          status: true,
          msg:
            "Success, your new ratio on " +
            req.body.code +
            " is " +
            String(_ratioOfUserShare.amount) +
            "% of ",
        });
      }
    } else { // if buying
      

      // get user's share info check
      _shares = await User_Shares.findOne({ where: { UserId: req.body.user } });
      
      
      // if user first time trading with that type of share
      if(_shares === null){
        _shares = new User_Shares;
        _shares.code = _type.code;
        _shares.amount=0;
        _shares.shareTypeId=_type.id;
        _shares.UserId = req.body.user;
        await _shares.save();
        _shares = await User_Shares.findOne({ where: { UserId: req.body.user } });
      }
      
      
      
      
      

      console.log(_type.totalvalue);
      if(req.body.amount === null || req.body.amount === undefined){
        req.body.amount = 0;
      }
      let priceOfShareRatio = (_type.totalvalue / 100) * req.body.amount;
      let oldBalanceOfUser = _user.balance;//+10000; // extra balance for debug
      let result = {};
      result.price = priceOfShareRatio;
      result.oldBalance = oldBalanceOfUser;

      if (priceOfShareRatio > oldBalanceOfUser) {
        return res.json({
          status: false,
          msg:
            "insufficient balance, you own $" +
            String(oldBalanceOfUser) +
            ", however the price of " +
            String(req.body.amount) +
            "% " +
            req.body.code +
            " is $" +
            priceOfShareRatio+
            ". find a job.",
        });
      }else{
        let newBalanceOfUser = parseFloat(oldBalanceOfUser) - parseFloat(priceOfShareRatio);

        

        _shares.amount = parseFloat(_shares.amount)+parseFloat(req.body.amount);
        await _shares.save();

        _user.balance = newBalanceOfUser;
        await _user.save();

        result.status=true;
        result.msg="You bought successfully"

        result.newBalance = newBalanceOfUser;

      }

      return res.json(result);
    }


    
  }
);


/**
 * creates a new user, optional
 */
router.post(
  "/registerUser",
  body("mail").isEmail(),
  body("password").not().isEmpty().trim().escape().isLength({ min: 5 }),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
      mail: req.body.mail,
      password: req.body.password,
    });

    return res.json({ status: true, msg: "user added successfully" });
  }
);




router.get("/", async function (req, res) {});

app.use("/", router);


const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if(err) throw err;
    console.log("%c "+PORT+"Server running", "color: green");
});