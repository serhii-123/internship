export const handler = async (event) => {
    try {
        const { name } = event.queryStringParameters;

        if(!name.trim())
            return {
                statusCode: 400,
                body: 'No name provided'
            };

        const message = `Hello, ${name}`;
        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify({ message });

        return {
            statusCode: 200,
            headers,
            body
        };
    } catch {
        return {
            statusCode: 500,
            body: 'Something went wrong'
        };
    }
};
