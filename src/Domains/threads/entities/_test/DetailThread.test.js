const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'title',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'title',
      body: 'body',
      date: '2023-06-20T08:45:00.000Z',
      username: 'user-123',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2023-06-20T08:45:00.000Z',
      username: 'user-123',
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toStrictEqual(payload.id);
    expect(detailThread.title).toStrictEqual(payload.title);
    expect(detailThread.body).toStrictEqual(payload.body);
    expect(detailThread.date).toStrictEqual(payload.date);
    expect(detailThread.username).toStrictEqual(payload.username);
  });
});
