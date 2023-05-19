import {
    ClientFactory,
    IProvider,
    ProviderType,
    WalletClient,
    WebsocketEvent,
} from "@massalabs/massa-web3";
import * as dotenv from "dotenv";

const providers: IProvider[] = [
    {
        url: "http://64.226.72.133:33035",
        type: ProviderType.PUBLIC,
    },
    {
        url: "http://64.226.72.133:33034",
        type: ProviderType.PRIVATE,
    },
    {
        url: "ws://64.226.72.133:33036",
        type: ProviderType.WS,
    },
];

dotenv.config();
if (!process.env.WALLET_PRIVATE_KEY) {
    throw new Error(
        'WALLET_PRIVATE_KEY is not set. Did you create environment file ".env" ?'
    );
}

const baseAccount = await WalletClient.getAccountFromSecretKey(
    process.env.WALLET_PRIVATE_KEY
);

const web3Client = await ClientFactory.createCustomClient(
    providers,
    true,
    baseAccount
);

const wsClient = web3Client.ws();
if (!wsClient) console.log("WS not available");
else {
    wsClient.on(WebsocketEvent.ON_CLOSED, () => {
        console.log("ws closed");
    });

    wsClient.on(WebsocketEvent.ON_CLOSING, () => {
        console.log("ws closing");
    });

    wsClient.on(WebsocketEvent.ON_CONNECTING, () => {
        console.log("ws connecting");
    });

    wsClient.on(WebsocketEvent.ON_OPEN, () => {
        console.log("ws open");
    });

    wsClient.on(WebsocketEvent.ON_PING, () => {
        console.log("ws ping", Date.now());
    });

    wsClient.on(WebsocketEvent.ON_ERROR, (errorMessage) => {
        console.error("ws error", errorMessage);
    });

    await wsClient.connect();
    console.log("Connected to WS");

    wsClient.subscribeFilledBlocks(async (block) => {
        console.log(block.header.id, block.operations.length);
    });
}
