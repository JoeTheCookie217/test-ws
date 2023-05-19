export interface IEndorsementInfo {
    content: {
        slot: ISlot;
        index: number;
        endorsed_block: string;
    };
    signature: string;
    creator_public_key: string;
    creator_address: string;
    id: string;
}

export interface ISlot {
    period: number;
    thread: number;
}

export interface IBlockHeaderInfo {
    slot: ISlot;
    parents: Array<string>;
    operation_merkle_root: string;
    endorsements: Array<IEndorsementInfo>;
}

export interface ISubscribedFullBlocksMessage {
    header: {
        content: IBlockHeaderInfo;
        signature: string;
        creator_public_key: string;
        creator_address: string;
        id: string;
    };
    operations: Array<[string, [IFilledBlockInfo]]>;
}

export interface IFilledBlockInfo {
    content: {
        fee: string;
        expire_period: number;
        op: object;
    };
    signature: string;
    creator_public_key: string;
    creator_address: string;
    id: string;
}
