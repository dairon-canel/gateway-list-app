import { Gateway, PeripheralDevice } from '../types';

export const createPeripheralService = async ({
  serialNumber,
  peripheral,
}: {
  serialNumber: string;
  peripheral: { status: 'ONLINE' | 'OFFLINE'; vendor: string };
}) => {
  const response = await fetch(`/api/peripherals/${serialNumber}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...peripheral, gateway_id: serialNumber }),
  });

  if (!response.ok) {
    throw new Error('Error creating peripheral');
  }
  return response.json();
};

export const getPeripheralsByGatewayService = async (serialNumber: string) => {
  const response = await fetch(`/api/peripherals/${serialNumber}/all`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Error retrieving peripherals');
  }
  return (await response.json()) as Promise<PeripheralDevice[]>;
};

export const getAllPeripheralsService = async () => {
  const response = await fetch('/api/peripherals', {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Error retrieving peripherals');
  }
  return (await response.json()) as Promise<PeripheralDevice[]>;
};

export const updatePeripheralService = async ({
  uid,
  peripheral,
}: {
  uid: string;
  peripheral: { status: 'ONLINE' | 'OFFLINE'; vendor: string };
}) => {
  console.log(peripheral);
  const response = await fetch(`/api/peripherals/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(peripheral),
  });
  if (!response.ok) {
    throw new Error('Error editing peripheral');
  }
  return await response.json();
};

export const deletePeripheralsService = async (uid: string) => {
  const response = await fetch(`/api/peripherals/${uid}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Error deleting Peripheral');
  }
  return await response.json();
};
