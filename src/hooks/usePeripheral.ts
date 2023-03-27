import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPeripheralService,
  deletePeripheralsService,
  getPeripheralsByGatewayService,
  updatePeripheralService,
} from '../services';

export const usePeripheral = ({ serialNumber }: { serialNumber: string }) => {
  const [error, setError] = useState<string>();

  const {
    data: peripherals,
    refetch,
    isRefetching,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getPeripheralsList', serialNumber],
    queryFn: () => getPeripheralsByGatewayService(serialNumber),
  });

  const { mutate: createPeripheral } = useMutation({
    mutationFn: ({
      serialNumber,
      peripheral,
    }: {
      serialNumber: string;
      peripheral: { status: 'ONLINE' | 'OFFLINE'; vendor: string };
    }) => {
      return createPeripheralService({ serialNumber, peripheral });
    },
    onSuccess: () => refetch(),
    onError: (error: any) => setError(error.message),
  });

  const { mutate: editPeripheral } = useMutation({
    mutationFn: ({
      uid,
      peripheral,
    }: {
      uid: string;
      peripheral: { status: 'ONLINE' | 'OFFLINE'; vendor: string };
    }) => {
      return updatePeripheralService({
        uid,
        peripheral,
      });
    },
    onSuccess: () => refetch(),
    onError: (error: any) => setError(error.message),
  });

  const { mutate: deletePeripheral } = useMutation({
    mutationFn: (uid: string) => {
      return deletePeripheralsService(uid);
    },
    onSuccess: () => refetch(),
    onError: (error: any) => setError(error.message),
  });

  return {
    peripherals,
    isLoading,
    isError,
    error,
    isRefetching,
    createPeripheral,
    editPeripheral,
    deletePeripheral,
  };
};
