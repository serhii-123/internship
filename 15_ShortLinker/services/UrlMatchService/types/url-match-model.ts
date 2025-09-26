interface UrlMatchModel {
    getShortPathByOriginalUrl: (originalUrl: string) => Promise<{ shortPath: string }[]>
    insertUrlMatch: (originalUrl: string, shortenPath: string) => Promise<number>
    getOriginalUrlByShortPath: (shortPath: string) => Promise<{ originalUrl: string }[]>
}

export default UrlMatchModel;