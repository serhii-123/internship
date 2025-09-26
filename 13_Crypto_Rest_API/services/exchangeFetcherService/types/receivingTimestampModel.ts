interface ReceivingTimestampModel {
    insertReceivingTimestamp(timestamp: string): Promise<number>
}

export default ReceivingTimestampModel;