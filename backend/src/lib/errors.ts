export class AppError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

export const notFound = (resource: string) => new AppError(404, `${resource} introuvable.`);
export const forbidden = (message = 'Action non autorisée.') => new AppError(403, message);
export const unauthorized = (message = 'Authentification requise.') => new AppError(401, message);
export const badRequest = (message: string) => new AppError(400, message);
