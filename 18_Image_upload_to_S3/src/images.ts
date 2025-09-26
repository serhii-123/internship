import {
    DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, S3Client
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteItemCommand, DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const s3 = new S3Client({ region: process.env.AWS_REGION });
const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });

const BUCKET_NAME = process.env.BUCKET_NAME as string;
const TABLE_NAME = process.env.TABLE_NAME as string;

export async function uploadImage(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const allowedTypes = ['png', 'jpg', 'jpeg', 'gif'];
    const headers = { 'Content-Type': 'application/json' };

    try {
        const userId = (event.requestContext.authorizer?.jwt?.claims as any)?.sub;
        
        if(!userId) throw new Error('Unauthorized');

        const extension = event.queryStringParameters?.ext;
        console.log('Extension:', extension);
        if(!extension || !allowedTypes.includes(extension.toLowerCase())) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Invalid extension' })
            };
        }

        const imageKey = `${userId}_${Date.now()}.${extension}`;
        const presignedPost = await createPresignedPost(s3, {
            Bucket: BUCKET_NAME,
            Key: imageKey,
            Conditions: [
                ['content-length-range', 0, 10485760],
                ['eq', '$Content-Type', `image/${extension.toLowerCase()}`]
            ],
            Expires: 6000,
        })
        const putItemCommand = new PutItemCommand({
            TableName: TABLE_NAME,
            Item: {
                userId: { S: userId },
                objectKey: { S: imageKey },
                createdAt: { S: new Date().toISOString() },
            }
        });

        await dynamo.send(putItemCommand);

        const body = JSON.stringify({
            uploadUrl: presignedPost.url,
            fields: presignedPost.fields,
            imageKey
        });

        return {
            statusCode: 200,
            headers,
            body
        };
    } catch(e) {
        console.log(e);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Failed to create upload URL' })
        };
    }
}

export async function deleteImage(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const headers = { 'Content-Type': 'application/json' };
    
    try {
        const userId = (event.requestContext.authorizer?.jwt?.claims as any)?.sub;
        const imageId = event.pathParameters?.key;

        if(!userId)
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ message: 'Unauthorized' })
            };

        if(!imageId)
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'imageId is required' })
            };

        const deleteCommand = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: imageId
        });
        const deleteItem = new DeleteItemCommand({
            TableName: TABLE_NAME,
            Key: {
                userId: { S: userId },
                objectKey: { S: imageId }
            }
        });

        await s3.send(deleteCommand);
        await dynamo.send(deleteItem);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Image deleted successfully' })
        };
    } catch(e) {
        console.log(e);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Something went wrong' })
        };
    }
}

export async function listImages(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const headers = { 'Content-Type': 'application/json' };

    try {
        const userId = (event.requestContext.authorizer?.jwt?.claims as any)?.sub;
        
        if(!userId)
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Unauthorized' })
            };
        
        const listCommand = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: `${userId}_`
        });
        const listReponse = await s3.send(listCommand);
        const files = listReponse.Contents ?? [];
        const urls: any[] = [];

        for(let file of files) {
            const getCommand = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: file.Key!
            });
            const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

            urls.push(url);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ images: urls })
        };
    } catch(e) {
        console.log(e);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Something went wrong' })
        };
    }
}