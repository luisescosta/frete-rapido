import { get } from 'env-var';

export const environment = {
  DB_HOST: get('DB_HOST').required().asString(),
  DB_PORT: get('DB_PORT').required().asPortNumber(),
  DB_PASSOWRD: get('DB_PASSOWRD').required().asString(),
  DB_USER: get('DB_USER').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
  LOG_QUERY: get('LOG_QUERY').required().asBool(),
  AUTH_TOKEN: get('AUTH_TOKEN').required().asString(),
  PLATFORM_CODE: get('PLATFORM_CODE').required().asString(),
  COMPANY_ZIPCODE: get('COMPANY_ZIPCODE').required().asString(),
  REGISTERED_NUMBER: get('REGISTERED_NUMBER').required().asString(),
};
