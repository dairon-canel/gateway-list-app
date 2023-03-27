import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { FC, ReactElement } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTableAddAction } from '../hooks';
import { useGateway } from '../hooks/useGateway';
import {
  Gateway,
  createGatewaySchema,
  CreateGatewayInput,
  EditGatewayInput,
  editGatewaySchema,
} from '../types';
import GatewayListItem from './GatewayListItem';

interface IGatewayList {
  setModalElement: React.Dispatch<React.SetStateAction<ReactElement | null>>;
}

const GatewayList: FC<IGatewayList> = ({ setModalElement }) => {
  const {
    removeAddAction,
    selectedItem,
    addAction,
    toggleEditClick,
    addButtonState,
  } = useTableAddAction({
    buttonCancelText: 'Cancel',
    buttonAddText: 'Add Gateway',
  });

  const {
    gateways,
    isRefetching,
    isLoading,
    isError,
    error,
    createGateway,
    editGateway,
    deleteGateway,
  } = useGateway();

  const {
    register: createRegister,
    formState: { errors: createFormErrors },
    handleSubmit: handleCreateFormSubmit,
  } = useForm<CreateGatewayInput>({
    resolver: zodResolver(createGatewaySchema),
  });

  const {
    register: editRegister,
    formState: { errors: editFormErrors },
    handleSubmit: handleEditFormSubmit,
  } = useForm<EditGatewayInput>({
    resolver: zodResolver(editGatewaySchema),
  });

  const createForm = (gateway: CreateGatewayInput) => {
    createGateway(gateway);
    addButtonState.action();
  };

  const editForm = async (gateway: EditGatewayInput) => {
    editGateway({
      serialNumber: (selectedItem as Gateway).serialNumber,
      gateway,
    });
    addButtonState.action();
  };

  const handleDelete = () => {
    const serialNumber = (selectedItem as Gateway).serialNumber;
    if (serialNumber) {
      deleteGateway(serialNumber);
    }
    addButtonState.action();
  };

  return (
    <div className="overflow-x-auto flex flex-col items-start  px-4 py-4 border-t border-base-300">
      <h1 className="text-xl self-stretch text-center text-base-100 justify-self-center mb-3 font-semibold">
        List of Gateways
      </h1>
      {error ? <div>{error}</div> : null}
      <form
        id="add_gateway_form"
        onSubmit={handleCreateFormSubmit(createForm)}
      ></form>
      <form
        id="edit_gateway_form"
        onSubmit={handleEditFormSubmit(editForm)}
      ></form>
      {isLoading || isRefetching ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Something happened...</div>
      ) : (
        <div className="self-center">
          <table className="table table-fixed w-[80rem]">
            <thead className="w-full">
              <tr>
                <th className="px-4 py-2 w-32">Serial Number</th>
                <th className="px-4 py-2 w-52">Name</th>
                <th className="px-4 py-2 w-52">IP Address</th>
                <th className="px-4 py-2 w-auto">Peripherals</th>
                <th className="px-4 py-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {gateways?.map((gateway, key) => (
                <tr
                  className="[&>td]:px-4 [&>td]:py-2 [&>td]:font-medium"
                  key={key}
                >
                  <GatewayListItem
                    removeAddAction={removeAddAction}
                    gateway={gateway}
                    selectedGateway={selectedItem as Gateway | null}
                    addAction={addAction}
                    setModalElement={setModalElement}
                    toggleEditClick={toggleEditClick}
                    editRegister={editRegister}
                    editFormErrors={editFormErrors}
                  />
                </tr>
              ))}
              <tr className={classNames({ hidden: !addButtonState.enabled })}>
                <td className="px-4 py-2 font-medium">New Gateway</td>
                <td className="px-4 py-2 font-medium">
                  <div className="form-element">
                    <input
                      form="add_gateway_form"
                      type="text"
                      id="name"
                      placeholder="Name"
                      className="input input-bordered input-sm w-32"
                      {...createRegister('name')}
                    />
                    <p>{createFormErrors.name?.message}</p>
                  </div>
                </td>
                <td className="px-4 py-2 font-medium">
                  <div className="form-element">
                    <input
                      form="add_gateway_form"
                      type="text"
                      id="ipv4Address"
                      placeholder="Ipv4 Address"
                      className="input input-bordered input-sm w-32"
                      {...createRegister('ipv4Address')}
                    />
                    <p>{createFormErrors.ipv4Address?.message}</p>
                  </div>
                </td>
                <td className="px-4 py-2 text-start font-medium">
                  New Devices
                </td>
                <td className="px-4 py-2 font-medium">
                  <button
                    type="submit"
                    form="add_gateway_form"
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
          <div className="grid grid-flow-col gap-48">
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
    </div>
  );
};

export default GatewayList;
