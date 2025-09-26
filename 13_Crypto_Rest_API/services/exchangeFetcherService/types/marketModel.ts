import Market from "./market";

interface MarketModel {
    getMarketByName: (name: string) => Promise<Market | null>
}

export default MarketModel;