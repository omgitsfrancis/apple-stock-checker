import { AzureFunction, Context } from "@azure/functions";
import axios from "axios";
import * as _ from "lodash";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  var timeStamp = new Date().toISOString();

  const productId = process.env["ProductId"];
  const requestUrl = `https://www.apple.com/shop/delivery-message?parts.0=${productId}`;
  var productPage, resultMessage, resultStatus;

  context.log(`Checking stock for Apple Product ${productId}`);

  await axios
    .get(requestUrl)
    .then((res) => {
      const message = res.data.body.content.deliveryMessage;
      const isBuyable = _.get(message, [productId, "isBuyable"]);

      if (isBuyable) {
        resultStatus = "available";
        productPage = `https://www.apple.com/shop/product/${productId}`;
        resultMessage = `Product ${productId} is availble online.`;
        context.log(resultMessage);
      } else if (isBuyable === undefined) {
        resultStatus = "error";
        resultMessage = `Please confirm product ID is valid. Product ID: ${productId}`;
        context.log(resultMessage);
      } else {
        resultStatus = "soldout";
        productPage = `https://www.apple.com/shop/product/${productId}`;
        resultMessage = `Product is NOT availble online`;
        context.log(resultMessage);
      }
    })
    .catch((err) => {
      resultStatus = "error";
      resultMessage = "XHR request has failed. Please check. Error " + err;
      context.log(resultMessage);
    });

  if (resultStatus === "available") {
    const phoneNumbers = process.env["PhoneNumbers"];
    const host = process.env["FunctionHost"]
    const apiKey = process.env["SendTextApiKey"];
    const message = `
      ${resultMessage}
      ${productPage}
  `;

    phoneNumbers.split(",").forEach(async (num) => {
      await axios.post(`${host}/api/SendText?code=${apiKey}`, { phoneNumber: num, message: message })
    });
  }
};

export default timerTrigger;
