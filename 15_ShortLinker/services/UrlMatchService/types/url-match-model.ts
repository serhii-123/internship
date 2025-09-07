interface UrlMatchModel {
    insertUrlMatch: (originalUrl: string, shortenPath: string) => Promise<number>
    getOriginalUrlByShortPath: (shortPath: string) => Promise<{ originalUrl: string }[]>
}

export default UrlMatchModel;