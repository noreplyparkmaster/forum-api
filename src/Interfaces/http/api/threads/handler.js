const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadHandler = this.getThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const useCasePayload = {
            title: request.payload.title,
            body: request.payload.body,
            owner: request.auth.credentials.id,
        };

        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const addedThread = await threadUseCase.addThread(useCasePayload);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadHandler(request, h) {
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const thread = await threadUseCase.getThread(request.params.threadId);

        return {
            status: 'success',
            data: {
                thread,
            },
        };
    }
}

module.exports = ThreadsHandler;
