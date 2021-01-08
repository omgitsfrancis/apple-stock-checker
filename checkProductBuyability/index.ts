import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";
import * as _ from "lodash";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const productId = req.query["productId"];
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
        context.log(resultStatus);
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

  context.res = {
    body: {
      status: resultStatus,
      message: resultMessage,
      productPage: productPage,
    },
  };
};

export default httpTrigger;
