import { nativeEnum, object, string, TypeOf } from 'zod';

export interface Gateway {
  _id?: string;
  serialNumber: string;
  name: string;
  ipv4Address: string;
  peripheralCount: number;
}

export interface PeripheralDevice {
  uid: string;
  vendor: string;
  createdAt?: Date;
  updatedAt?: Date;
  status: 'ONLINE' | 'OFFLINE';
}

export const createGatewaySchema = object({
  name: string()
    .nonempty({
      message: 'Name is required',
    })
    .min(3, 'Name should be at least 3 characters long'),
  ipv4Address: string({
    required_error: 'Ip is required',
  })
    .nonempty({
      message: 'Ip Address is required',
    })
    .ip({ version: 'v4', message: 'Invalid IPv4 address' }),
});

export type CreateGatewayInput = TypeOf<typeof createGatewaySchema>;

const ipSchema = string().ip({
  version: 'v4',
  message: 'Invalid IPv4 address',
});

type editIp = TypeOf<typeof ipSchema>;

export const editGatewaySchema = object({
  name: string()
    .nonempty({
      message: 'Name is required',
    })
    .min(3, 'Name should be at least 3 characters long'),
  ipv4Address: string()
    .optional()
    .transform(e => (e === '' ? undefined : (e as editIp))),
});

export type EditGatewayInput = TypeOf<typeof editGatewaySchema>;

export const peripheralSchema = object({
  vendor: string({
    required_error: 'Vendor is required',
  }).min(3, 'Vendor should be at least 3 characters long'),
});

export type PeripheralInput = TypeOf<typeof peripheralSchema>;
