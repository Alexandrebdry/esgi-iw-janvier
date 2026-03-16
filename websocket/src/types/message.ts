export type MessageType = {
    id: string;
    text: string;
    senderMessageId: string;
    readersMessageIds?: string[];
    roomId: string;
};