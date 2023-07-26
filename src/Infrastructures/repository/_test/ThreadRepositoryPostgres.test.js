const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist add thread and return added thread correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            const addThread = new AddThread({
                title: 'title',
                body: 'body',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addThread(addThread);

            // Assert
            const threads = await ThreadsTableTestHelper.getThreadsById('thread-123');
            expect(threads).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            const addThread = new AddThread({
                title: 'title',
                body: 'body',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(addThread);

            // Assert
            expect(addedThread).toStrictEqual(
                new AddedThread({
                    id: 'thread-123',
                    title: 'title',
                    owner: 'user-123',
                }),
            );
        });
    });

    describe('verifyAvailableThread function', () => {
        it('should throw NotFoundError when thread not available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when thread available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('getThread function', () => {
        it('should throw NotFoundError when thread not available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.getThread('thread-123')).rejects.toThrowError(NotFoundError);
        });

        it('should return thread correctly', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123', date: new Date('2023-06-20T08:45:00.000Z') });

            // Action
            const thread = await threadRepositoryPostgres.getThread('thread-123');

            // Assert
            expect(thread).toStrictEqual({
                id: 'thread-123',
                title: 'title',
                body: 'body',
                date: new Date('2023-06-20T08:45:00.000Z'),
                username: 'dicoding',
            });
        });
    });

});
