export const handler = async (event) => {
    try {
        const fibonacci = [];

        for(let i = 0; i < 10; i++)
            if(i < 2)
                fibonacci.push(i);
            else
                fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2]);
        
        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify({ fibonacci });
        const response = {
            statusCode: 200,
            headers,
            body
        };

        return response;
    } catch {
        return {
            statusCode: 500,
            body: 'Something went wrong'
        };
    }
};
