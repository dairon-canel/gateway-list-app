import { Gateway } from '../types';

export const createGatewayService = async ({
  name,
  ipv4Address,
}: {
  name: string;
  ipv4Address: string;
}) => {
  const response = await fetch('/api/gateways', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, ipv4Address }),
  });

  if (!response.ok) {
    throw new Error('Error creating Gateway');
  }
  return response.json();
};

export const getGatewaysService = async () => {
  const response = await fetch('/api/gateways', {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Error retrieving Gateway');
  }
  return (await response.json()) as Promise<Gateway[]>;
};

export const deleteGatewaysService = async (serialNumber: string) => {
  const response = await fetch(`/api/gateways/${serialNumber}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Error retrieving Gateway');
  }
  return await response.json();
};

export const editGatewaysService = async ({
  serialNumber,
  gateway,
}: {
  serialNumber: string;
  gateway: Partial<Gateway>;
}) => {
  const response = await fetch(`/api/gateways/${serialNumber}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gateway),
  });
  if (!response.ok) {
    throw new Error('Error retrieving Gateway');
  }
  return await response.json();
};
