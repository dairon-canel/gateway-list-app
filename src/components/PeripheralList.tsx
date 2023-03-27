import { FC, useState } from 'react';
import classNames from 'classnames';
import { format } from 'date-fns';
import {
  PeripheralInput,
  peripheralSchema,
  Gateway,
  PeripheralDevice,
} from '../types';
import { useForm } from 'react-hook-form';
import PeripheralListItem from './PeripheralListItem';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTableAddAction } from '../hooks';
import { usePeripheral } from '../hooks/usePeripheral';

interface IPeripheralListProps {
  gateway: Gateway;
}

const PeripheralList: FC<IPeripheralListProps> = ({ gateway }) => {
  const {
    peripherals,
    isLoading,
    isError,
    error,
    isRefetching,
    createPeripheral,
    editPeripheral,
    deletePeripheral,
  } = usePeripheral({
    serialNumber: gateway.serialNumber,
  });
  const {
    removeAddAction,
    selectedItem,
    addAction,
    toggleEditClick,
    addButtonState,
  } = useTableAddAction({
    buttonCancelText: 'Cancel',
    buttonAddText: 'Add Peripheral Device',
  });

  const [networkStatus, setNetworkStatus] = useState<'OFFLINE' | 'ONLINE'>(
    'OFFLINE',
  );

  const {
    register: createRegister,
    formState: { errors: createFormErrors },
    handleSubmit: handleCreateFormSubmit,
  } = useForm<PeripheralInput>({
    resolver: zodResolver(peripheralSchema),
  });

  const {
    register: editRegister,
    formState: { errors: editFormErrors },
    handleSubmit: handleEditFormSubmit,
  } = useForm<PeripheralInput>({
    resolver: zodResolver(peripheralSchema),
  });

  const createForm = (vendor: PeripheralInput) => {
    createPeripheral({
      serialNumber: gateway.serialNumber,
      peripheral: { ...vendor, status: networkStatus },
    });
    addButtonState.action();
  };

  const editForm = async (vendor: PeripheralInput) => {
    editPeripheral({
      uid: (selectedItem as PeripheralDevice).uid,
      peripheral: { ...vendor, status: networkStatus },
    });
    addButtonState.action();
  };

  const handleDelete = () => {
    const uid = (selectedItem as PeripheralDevice).uid;
    if (uid) {
      deletePeripheral(uid);
    }
    addButtonState.action();
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Something happened...</div>
      ) : (
        <div>
          <h3 className="text-lg font-bold mb-1 w-full text-center">
            {gateway.name}
          </h3>
          {error ? <div>{error}</div> : null}
          <form
            id="add_peripheral_form"
            onSubmit={handleCreateFormSubmit(createForm)}
          ></form>
          <form
            id="edit_peripheral_form"
            onSubmit={handleEditFormSubmit(editForm)}
          ></form>
          <table className="table w-full table-fixed">
            <thead>
              <tr>
                <th className="px-4 py-2 w-24">uid</th>
                <th className="px-4 py-2 w-32">vendor</th>
                <th className="px-4 py-2 w-32">dateCreated</th>
                <th className="px-4 py-2 w-32">status</th>
                <th className="px-4 py-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {isLoading || isRefetching
                ? null
                : peripherals && peripherals?.length >= 0
                ? peripherals?.map((peripheral, key) => (
                    <tr
                      className="[&>td]:px-4 [&>td]:py-2 [&>td]:font-medium"
                      key={key}
                    >
                      <PeripheralListItem
                        removeAddAction={removeAddAction}
                        key={key}
                        peripheral={peripheral}
                        selectedPeripheral={selectedItem as PeripheralDevice}
                        addAction={addAction}
                        toggleEditClick={toggleEditClick}
                        networkStatus={networkStatus}
                        setNetworkStatus={setNetworkStatus}
                        editRegister={editRegister}
                        editFormErrors={editFormErrors}
                      />
                    </tr>
                  ))
                : null}
              <tr
                className={classNames(
                  ' [&>td]:px-4 [&>td]:py-2 [&>td]:font-medium',
                  { hidden: !addButtonState.enabled },
                )}
              >
                <td>New serial</td>
                <td>
                  <div className="form-element">
                    <input
                      form="add_peripheral_form"
                      type="text"
                      id="vendor"
                      placeholder="Vendor"
                      className="input input-bordered input-sm w-32"
                      {...createRegister('vendor')}
                    />
                    <p>{createFormErrors.vendor?.message}</p>
                  </div>
                </td>
                <td>{format(new Date(), 'yyyy/mm/dd')}</td>
                <td>
                  <button
                    type="button"
                    className="btn mt-1 min-h-[1.3rem] h-[1.3rem]"
                    onClick={() => {
                      if (networkStatus === 'OFFLINE')
                        setNetworkStatus('ONLINE');
                      if (networkStatus === 'ONLINE')
                        setNetworkStatus('OFFLINE');
                    }}
                  >
                    {networkStatus}
                  </button>
                </td>
                <td>
                  <button
                    type="submit"
                    form="add_peripheral_form"
                    className={classNames('btn mt-1 min-h-[2rem] h-[2rem]', {
                      isLoading,
                    })}
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="grid grid-flow-col gap-2">
            <button
              className={classNames('btn mt-1 self-end min-h-[2rem] h-[2rem]', {
                hidden: !selectedItem,
                isLoading,
              })}
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className={classNames('btn mt-1 min-h-[2rem] h-[2rem]', {
                'btn-disabled': isLoading,
              })}
              onClick={addButtonState.action}
            >
              {addButtonState.buttonText}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PeripheralList;
