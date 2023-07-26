const AddedComment = require('../AddedComment');

describe('an AddedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'content',
        };

        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: 'content',
            owner: {},
        };

        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addedComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'content',
            owner: 'user-123',
        };

        // Action
        const addedComment = new AddedComment(payload);

        // Assert
        expect(addedComment.id).toStrictEqual(payload.id);
        expect(addedComment.content).toStrictEqual(payload.content);
        expect(addedComment.owner).toStrictEqual(payload.owner);
    });
});
