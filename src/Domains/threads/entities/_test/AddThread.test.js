const AddThread = require('../AddThread');

describe('an AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'title',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: true,
      body: 'body',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 'body',
      owner: 'owner-123',
    };

    // Action
    const addThread = new AddThread(payload);

    // Assert
    expect(addThread.title).toStrictEqual(payload.title);
    expect(addThread.body).toStrictEqual(payload.body);
    expect(addThread.owner).toStrictEqual(payload.owner);
  });
});
