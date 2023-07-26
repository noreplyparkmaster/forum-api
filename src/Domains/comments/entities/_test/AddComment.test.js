const AddComment = require('../AddComment');

describe('an AddComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'content',
        };

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            content: true,
            threadId: 'thread-123',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddComment object correctly', () => {
        // Arrange
        const payload = {
            content: 'content',
            threadId: 'thread-123',
            owner: 'user-123',
        };

        // Action
        const addComment = new AddComment(payload);

        // Assert
        expect(addComment.content).toStrictEqual(payload.content);
        expect(addComment.threadId).toStrictEqual(payload.threadId);
        expect(addComment.owner).toStrictEqual(payload.owner);
    });
});
