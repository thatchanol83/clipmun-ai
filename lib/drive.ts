import { google } from 'googleapis';
import { Readable } from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

export async function uploadToDrive(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string = 'video/mp4'
) {
    try {
        // Auth
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: SCOPES,
        });

        const drive = google.drive({ version: 'v3', auth });

        // Stream
        const stream = new Readable();
        stream.push(fileBuffer);
        stream.push(null);

        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType,
                parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : [], // Optional folder ID
            },
            media: {
                mimeType,
                body: stream,
            },
            fields: 'id, webViewLink, webContentLink',
        });

        return response.data;
    } catch (error) {
        console.error('Google Drive Upload Error:', error);
        throw error;
    }
}
