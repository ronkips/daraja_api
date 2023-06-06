const axios = require("axios");

require("dotenv").config();

const url = process.env.TOKEN_URL;
const consumer_key = process.env.CONSUMER_KEY;
const secret_key = process.env.CONSUMER_SECRET;
const stk_url = process.env.STK_PUSH_URL;
const Bis_code = process.env.BUSINESS_CODE;
const pass_key = process.env.PASS_KEY;

const getAuthToken = async () => {
  const auth = Buffer.from(consumer_key + ":" + secret_key).toString("base64");
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: "Basic " + auth
      }
    });
    console.log(data);
    return data.access_token;
  } catch (error) {
    return {
      error: error,
      message: "Error getting auth tokens"
    };
  }
};
// return getAuthToken();

const Stk = async () => {
  const user = 254728585337;
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
  const password = Buffer.from(Bis_code + pass_key + timestamp).toString(
    "base64"
  );

  const payload = {
    BusinessShortCode: Bis_code,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: 1,
    PartyA: user,
    PartyB: Bis_code,
    PhoneNumber: user,
    CallBackURL: "https://mydomain.com/path",
    AccountReference: "CompanyXLTD",
    TransactionDesc: "Payment of X"
  };
  try {
    let { data } = await axios.post(stk_url, payload, {
      headers: {
        Authorization: "Bearer " + (await getAuthToken())
      }
    });
    console.log("######", data);
  } catch (error) {
    console.log(error);
  }
};

return Stk();
