import WebSocket from "ws";
import {
    WS_RPC_REQUEST_METHOD_BASE,
    WS_RPC_REQUEST_METHOD_NAME,
    generateFullRequestName,
} from "./src/WsRpcMethods";
import { ISubscribedFullBlocksMessage } from "./src/types";

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
