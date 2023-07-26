/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123', content = 'content', threadId = 'thread-123', owner = 'user-123', date = new Date('2023-06-20T08:45:00.000Z')
    }) {
        const query = {
            text: 'INSERT INTO comments(id, content, thread_id, owner, created_at) VALUES($1, $2, $3, $4, $5)',
            values: [id, content, threadId, owner, date],
        };

        await pool.query(query);
    },

    async getCommentsById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
};

module.exports = CommentsTableTestHelper;
