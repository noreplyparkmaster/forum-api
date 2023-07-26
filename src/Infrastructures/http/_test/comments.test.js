const pool = require('../../database/postgres/pool');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 404 when thread not found', async () => {
            // Arrange
            const requestPayload = {
                content: 'content',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-000/comments',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak tersedia');
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                content: '',
            };
            const threadId = 'thread-123';
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);
            await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat menambah komentar karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                content: true,
            };
            const threadId = 'thread-123';
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);
            await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat menambah komentar karena tipe data tidak sesuai');
        });

        it('should response 201 and added comment', async () => {
            // Arrange
            const requestPayload = {
                content: 'content',
            };
            const threadId = 'thread-123';
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);
            await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
        });

    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 404 when comment not found', async () => {
            // Arrange
            const threadId = 'thread-123';
            const commentId = 'comment-000';
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('komentar tidak ditemukan di thread ini');
        });

        it('should response 403 when user is not comment owner', async () => {
            // Arrange
            const threadId = 'thread-234';
            const commentOwnerId = 'user-234';
            const commentId = 'comment-234';
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);
            await UsersTableTestHelper.addUser({ id: commentOwnerId, username: 'dicoding2' });
            await ThreadsTableTestHelper.addThread({ id: threadId, owner: commentOwnerId });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: commentOwnerId });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('anda tidak berhak mengakses resource ini');
        });

        it('should response 200 and delete comment', async () => {
            // Arrange
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            await ThreadsTableTestHelper.addThread({ id: threadId });
            await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: 'user-123' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

    });

});
