import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const message = (req.body && req.body["message"]);
    const phoneNumber = (req.body && req.body["phoneNumber"])

    if(message && phoneNumber) {
        context.bindings.message = {
            body : message,
            to : phoneNumber
        };
    }
    
    context.done();
};

export default httpTrigger;