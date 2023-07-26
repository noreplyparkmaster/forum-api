const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    })

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist add comment and return added comment correctly', async () => {
            // Arrange
            const addComment = new AddComment({
                content: 'content',
                threadId: 'thread-123',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await commentRepositoryPostgres.addComment(addComment);

            // Assert
            const comments = await CommentsTableTestHelper.getCommentsById('comment-123');
            expect(comments).toHaveLength(1);
        });

        it('should return added comment correctly', async () => {
            // Arrange
            const addComment = new AddComment({
                content: 'content',
                threadId: 'thread-123',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(addComment);

            // Assert
            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: 'comment-123',
                    content: 'content',
                    owner: 'user-123',
                }),
            );
        });
    });

    describe('checkAvailabilityCommentInThread function', () => {
        it('should throw NotFoundError if comment not available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.checkAvailabilityCommentInThread('comment-123', 'thread-123')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError if comment not available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' })

            // Action & Assert
            await expect(commentRepositoryPostgres.checkAvailabilityCommentInThread('comment-123', 'thread-123')).resolves.not.toThrow(NotFoundError);
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should throw AuthorizationError if comment not belongs to payload', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw AuthorizationError if comment belongs to payload', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' })

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
        });
    });

    describe('deleteComment function', () => {
        it('should delete comment correctly', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await CommentsTableTestHelper.addComment({ id: 'comment-123' })

            // Action
            await commentRepositoryPostgres.deleteComment('comment-123');

            // Assert
            const comments = await CommentsTableTestHelper.getCommentsById('comment-123');
            expect(comments).toHaveLength(1);
            expect(comments[0].is_deleted).toEqual(true);
        });
    });

    describe('getCommentsByThreadId function', () => {
        it('should return comment correctly', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await CommentsTableTestHelper.addComment({ id: 'comment-123', date: new Date('2023-06-20T08:45:00.000Z') })

            // Action
            const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

            // Assert
            expect(comments).toHaveLength(1);
            expect(comments).toStrictEqual(
                [{
                    id: 'comment-123',
                    content: 'content',
                    is_deleted: false,
                    thread_id: 'thread-123',
                    owner: 'user-123',
                    created_at: new Date('2023-06-20T08:45:00.000Z'),
                    username: 'dicoding',
                }]);
        });
    });

});
