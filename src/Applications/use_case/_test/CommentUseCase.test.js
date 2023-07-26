const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentUseCase = require('../CommentUseCase');

describe('CommentUseCase', () => {
    describe('addComment', () => {
        it('should orchestrating the add comment action correctly', async () => {
            // Arrange
            const useCasePayload = {
                content: 'content',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            const expectedAddedComment = new AddedComment({
                id: 'comment-123',
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            });

            /** creating dependency of use case */
            const mockCommentRepository = new CommentRepository();
            const mockThreadRepository = new ThreadRepository();

            /** mocking needed function */
            mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
            mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(
                new AddedComment({
                    id: 'comment-123',
                    content: useCasePayload.content,
                    owner: useCasePayload.owner,
                }),
            ));

            const commentUseCase = new CommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            });

            // Action
            const addedComment = await commentUseCase.addComment(useCasePayload);

            // Assert
            expect(addedComment).toStrictEqual(expectedAddedComment);
            expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
            expect(mockCommentRepository.addComment).toBeCalledWith(
                new AddComment({
                    content: useCasePayload.content,
                    threadId: useCasePayload.threadId,
                    owner: useCasePayload.owner,
                }),
            );
        });
    });

    describe('deleteComment', () => {
        it('should orchestrating the delete comment action correctly', async () => {
            // Arrange
            const useCasePayload = {
                commentId: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            /** creating dependency of use case */
            const mockCommentRepository = new CommentRepository();

            /** mocking needed function */
            mockCommentRepository.checkAvailabilityCommentInThread = jest.fn().mockImplementation(() => Promise.resolve());
            mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
            mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

            const commentUseCase = new CommentUseCase({
                commentRepository: mockCommentRepository,
            });

            // Action
            await commentUseCase.deleteComment(useCasePayload);

            // Assert
            expect(mockCommentRepository.checkAvailabilityCommentInThread).toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
            expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
            expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
        });
    });

});
