const AddComment = require('../../Domains/comments/entities/AddComment');

class CommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async addComment(useCasePayload) {
        const addComment = new AddComment(useCasePayload);
        await this._threadRepository.verifyAvailableThread(addComment.threadId);
        return this._commentRepository.addComment(addComment);
    }

    async deleteComment(useCasePayload) {
        const { commentId, threadId, owner } = useCasePayload;
        await this._commentRepository.checkAvailabilityCommentInThread(commentId, threadId);
        await this._commentRepository.verifyCommentOwner(commentId, owner);
        await this._commentRepository.deleteComment(commentId);
    }
}

module.exports = CommentUseCase;
