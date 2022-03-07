import { EExternalServices } from "./externalServices.enum";

export type TAPIRequest = {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  endpoint: string,
  absoluteUrl?: Boolean, 
  data?: any,
  requiresAuth?: Boolean,
  headers: any,
  params?: any,
  successMessage: null | ((resp: any) => string) | string,
  service?: EExternalServices,
};

export type TAPIRequestShorthand = {
  endpoint: string,
  absoluteUrl?: Boolean, 
  data?: any,
  requiresAuth?: Boolean,
  headers?: any,
  params?: any,
  successMessage?: null | ((resp: any) => string) | string,
  service?: EExternalServices,
};

export type TOption = {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  headers: any,
  body?: any,
  params?: any,
  data?: any,
};