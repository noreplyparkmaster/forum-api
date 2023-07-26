const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async addThread(useCasePayload) {
        const addThread = new AddThread(useCasePayload);
        return this._threadRepository.addThread(addThread);
    }

    async getThread(threadId) {
        const thread = await this._threadRepository.getThread(threadId);
        const comments = await this._commentRepository.getCommentsByThreadId(threadId);
        const modifiedComments = comments.map(({ is_deleted, content, created_at, owner, thread_id, ...comment }) => {
            if (is_deleted) {
                return { ...comment, content: '**komentar telah dihapus**', date: created_at };
            }
            return { ...comment, content, date: created_at, content };
        });
        thread.comments = modifiedComments;
        return thread;
    }
}

module.exports = ThreadUseCase;
