import {
    ClientFactory,
    IProvider,
    ProviderType,
    WalletClient,
} from "@massalabs/massa-web3";
import WebSocket from "ws";
import * as dotenv from "dotenv";
import {
    WS_RPC_REQUEST_METHOD_BASE,
    WS_RPC_REQUEST_METHOD_NAME,
    generateFullRequestName,
} from "./WsRpcMethods";
import {
    IFilledBlockInfo,
    ISubscribedFullBlocksMessage,
} from "@massalabs/massa-web3/dist/interfaces/ISubscribedFullBlocksMessage";

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

const wsClient = new WebSocket("ws://64.226.72.133:33036");
if (!wsClient) console.log("WS not available");
else {
    wsClient.onclose = () => {
        console.log("ws closed");
    };

    wsClient.onerror = (error) => {
        console.error("ws error", error);
    };

    wsClient.onmessage = (message) => {
        const data = JSON.parse(message.data as string);

        if ("params" in data) {
            const res = data.params.result as ISubscribedFullBlocksMessage;
            console.log(res.header.id, res.operations.length);
        }
    };

    wsClient.onopen = () => {
        console.log("ws open");
        wsClient.send(
            JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: generateFullRequestName(
                    WS_RPC_REQUEST_METHOD_BASE.SUBSCRIBE,
                    WS_RPC_REQUEST_METHOD_NAME.NEW_FILLED_BLOCKS
                ),
                params: [],
            })
        );
    };

    console.log("Connected to WS");
}
