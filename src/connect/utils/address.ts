export function formatEthAddress(address: string) {
    return `${address.slice(0, 7)}...${address.slice(-5)}`;
}
