export class ErrorHttp {
  code: number;
  message: string;
  data: any | null;
  httpStatusCode?: number;
  statusCodeName?: string;

  constructor(
    vCode: number,
    vMessage: string,
    vData: any | null,
    vHttpStatusCode?: number
  ) {
    this.code = vCode;
    this.message = vMessage;
    this.data = vData;

    if (vHttpStatusCode) {
      this.httpStatusCode = vHttpStatusCode;
      this.statusCodeName = this.getStatusCodeName(vHttpStatusCode);
    }
  }

  private getStatusCodeName(statusCode: number): string {
    switch (statusCode) {
      case HTTP_STATUS_CODE.OK:
        return "OK";
      case HTTP_STATUS_CODE.CREATED:
        return "Created";
      case HTTP_STATUS_CODE.ACCEPTED:
        return "Accepted";
      case HTTP_STATUS_CODE.NO_CONTENT:
        return "No Content";
      case HTTP_STATUS_CODE.BAD_REQUEST:
        return "Bad Request";
      case HTTP_STATUS_CODE.UNAUTHORIZED:
        return "Unauthorized";
      case HTTP_STATUS_CODE.FORBIDDEN:
        return "Forbidden";
      case HTTP_STATUS_CODE.NOT_FOUND:
        return "Not Found";
      case HTTP_STATUS_CODE.METHOD_NOT_ALLOWED:
        return "Method Not Allowed";
      case HTTP_STATUS_CODE.CONFLICT:
        return "Conflict";
      case HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR:
        return "Internal Server Error";
      case HTTP_STATUS_CODE.NOT_IMPLEMENTED:
        return "Not Implemented";
      case HTTP_STATUS_CODE.BAD_GATEWAY:
        return "Bad Gateway";
      case HTTP_STATUS_CODE.SERVICE_UNAVAILABLE:
        return "Service Unavailable";
      case HTTP_STATUS_CODE.GATEWAY_TIMEOUT:
        return "Gateway Timeout";
      default:
        return "Unknown Status";
    }
  }
}

export enum HTTP_STATUS_CODE {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}
