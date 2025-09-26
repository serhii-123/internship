interface UrlMatchService {
    saveUrlMatch: (originalUrl: string) => Promise<string>,
    getOriginalUrlByShortPath: (shortenPath: string) => Promise<string | undefined>
}

export default UrlMatchService;