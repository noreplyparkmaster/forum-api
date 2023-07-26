const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        const addedComment = await commentUseCase.addComment({
            content: request.payload.content,
            threadId: request.params.threadId,
            owner: request.auth.credentials.id,
        });

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request, h) {
        const useCasePayload = {
            commentId: request.params.commentId,
            threadId: request.params.threadId,
            owner: request.auth.credentials.id,
        };

        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        await commentUseCase.deleteComment(useCasePayload);

        return {
            status: 'success',
        };
    }
}

module.exports = CommentsHandler;
