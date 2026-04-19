export type ErrorStatus =
  | 'error'
  | 'failed'
  | 'invalid'
  | 'not_found'
  | 'unauthorized'
  | 'conflict';

export type AllStatus = 'success' | ErrorStatus;

export type ApiSuccess = {
  status: 'success';
};

export type ApiError = {
  status: ErrorStatus;
  msg: string;
};

export type ExternalApiSuccess = {
  status: 'success';
  msg: string;
};

export type ExternalApiError = {
  status: ErrorStatus;
  msg: string;
};
