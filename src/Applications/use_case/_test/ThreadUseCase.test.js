const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadUseCase = require('../ThreadUseCase');

describe('ThreadUseCase', () => {
    describe('addThread', () => {
        it('should orchestrating the add thread action correctly', async () => {
            // Arrange
            const useCasePayload = {
                title: 'title',
                body: 'body',
                owner: 'user-123',
            };

            const expectedAddedThread = new AddedThread({
                id: 'thread-123',
                title: useCasePayload.title,
                body: useCasePayload.body,
                owner: useCasePayload.owner,
                date: '2023-06-20T08:45:00.000Z',
            });

            /** creating dependency of use case */
            const mockThreadRepository = new ThreadRepository();
            /** mocking needed function */
            mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(
                new AddedThread({
                    id: 'thread-123',
                    title: useCasePayload.title,
                    body: useCasePayload.body,
                    owner: useCasePayload.owner,
                    date: '2023-06-20T08:45:00.000Z',
                }),
            ));

            const threadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
            });

            // Action
            const addedThread = await threadUseCase.addThread(useCasePayload);

            // Assert
            expect(addedThread).toStrictEqual(expectedAddedThread);
            expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
                new AddThread({
                    title: useCasePayload.title,
                    body: useCasePayload.body,
                    owner: useCasePayload.owner,
                }),
            );
        });
    });

    describe('getThread', () => {
        it('should orchestrating the get thread action correctly', async () => {
            // Arrange
            const useCasePayload = {
                threadId: 'thread-123'
            };

            const expectedDetailThread = {
                id: useCasePayload.threadId,
                title: 'title',
                body: 'body',
                date: '2023-06-20T08:45:00.000Z',
                username: 'dicoding',
                comments: [
                    {
                        id: 'comment-123',
                        username: 'dicoding',
                        date: '2023-06-20T09:00:00.000Z',
                        content: 'content',
                    },
                ]
            };

            /** creating dependency of use case */
            const mockThreadRepository = new ThreadRepository();
            const mockCommentRepository = new CommentRepository();

            /** mocking needed function */
            mockThreadRepository.getThread = jest.fn().mockImplementation(() => Promise.resolve({
                id: useCasePayload.threadId,
                title: 'title',
                body: 'body',
                date: '2023-06-20T08:45:00.000Z',
                username: 'dicoding',
            }));
            mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(
                [
                    {
                        id: 'comment-123',
                        content: 'content',
                        is_deleted: false,
                        thread_id: useCasePayload.threadId,
                        owner: 'user-123',
                        created_at: '2023-06-20T09:00:00.000Z',
                        username: 'dicoding',
                    },
                ]
            ));

            const threadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
                commentRepository: mockCommentRepository,
            });

            // Action
            const detailThread = await threadUseCase.getThread(useCasePayload.threadId);

            // Assert
            expect(detailThread).toStrictEqual(expectedDetailThread);
            expect(mockThreadRepository.getThread).toHaveBeenCalledWith(useCasePayload.threadId);
            expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
        });

        it('must not show the content of deleted comments', async () => {
            // Arrange
            const useCasePayload = {
                threadId: 'thread-123'
            };

            const expectedDetailThread = {
                id: useCasePayload.threadId,
                title: 'title',
                body: 'body',
                date: '2023-06-20T08:45:00.000Z',
                username: 'dicoding',
                comments: [
                    {
                        id: 'comment-123',
                        username: 'dicoding',
                        date: '2023-06-20T09:00:00.000Z',
                        content: '**komentar telah dihapus**',
                    },
                ]
            };

            /** creating dependency of use case */
            const mockThreadRepository = new ThreadRepository();
            const mockCommentRepository = new CommentRepository();

            /** mocking needed function */
            mockThreadRepository.getThread = jest.fn().mockImplementation(() => Promise.resolve({
                id: useCasePayload.threadId,
                title: 'title',
                body: 'body',
                date: '2023-06-20T08:45:00.000Z',
                username: 'dicoding',
            }));
            mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(
                [
                    {
                        id: 'comment-123',
                        content: '**komentar telah dihapus**',
                        is_deleted: true,
                        thread_id: useCasePayload.threadId,
                        owner: 'user-123',
                        created_at: '2023-06-20T09:00:00.000Z',
                        username: 'dicoding',
                    },
                ]
            ));

            const threadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
                commentRepository: mockCommentRepository,
            });

            // Action
            const detailThread = await threadUseCase.getThread(useCasePayload.threadId);

            // Assert
            expect(detailThread).toStrictEqual(expectedDetailThread);
            expect(mockThreadRepository.getThread).toHaveBeenCalledWith(useCasePayload.threadId);
            expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
        });

    });

});
