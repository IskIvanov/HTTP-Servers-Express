export class HttpError extends Error {
    constructor(
        message: string,
        public statusCode: number,
    ) {
        super(message);
    }
}

export class BadRequest extends HttpError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class Unauthorized extends HttpError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class Forbidden extends HttpError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message, 404);
    }
}
