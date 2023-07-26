const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');


class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(addComment) {
        const { content, threadId, owner } = addComment;
        const id = `comment-${this._idGenerator()}`;
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO comments(id, content, thread_id, owner, created_at) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, content, threadId, owner, createdAt],
        };

        const result = await this._pool.query(query);

        return new AddedComment({ ...result.rows[0] });
    }

    async checkAvailabilityCommentInThread(commentId, threadId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2',
            values: [commentId, threadId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('komentar tidak ditemukan di thread ini');
        }
    }

    async verifyCommentOwner(commentId, userId) {
        const query = {
            text: 'SELECT 1 FROM comments WHERE id = $1 AND owner = $2',
            values: [commentId, userId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new AuthorizationError('anda tidak berhak mengakses resource ini');
        }
    }

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
            values: [commentId],
        };

        await this._pool.query(query);
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `SELECT comments.*, users.username FROM comments
                    INNER JOIN users ON comments.owner = users.id
                    WHERE comments.thread_id = $1 ORDER BY comments.created_at ASC`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        
        return result.rows;
    }
}

module.exports = CommentRepositoryPostgres;
