import classNames from 'classnames';
import { FC, ReactElement } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useTableItemAddAction } from '../hooks';
import { Gateway, PeripheralDevice } from '../types';
import PeripheralList from './PeripheralList';

interface IGatewayListItemProps {
  removeAddAction: boolean;
  addAction: boolean;
  gateway: Gateway;
  setModalElement: React.Dispatch<React.SetStateAction<ReactElement | null>>;
  selectedGateway: Gateway | null;
  toggleEditClick: (item: Gateway | PeripheralDevice) => void;
  editRegister: UseFormRegister<{
    name: string;
    ipv4Address?: string | undefined;
  }>;
  editFormErrors: FieldErrors<{
    name: string;
    ipv4Address?: string | undefined;
  }>;
}

const GatewayListItem: FC<IGatewayListItemProps> = ({
  removeAddAction,
  addAction,
  gateway,
  setModalElement,
  selectedGateway,
  toggleEditClick,
  editRegister,
  editFormErrors,
}) => {
  const { editButtonToggle, handleEditToggle } = useTableItemAddAction(
    removeAddAction,
    toggleEditClick,
  );

  return (
    <>
      {editButtonToggle ? (
        <>
          <td>{gateway.serialNumber}</td>
          <td>
            <div className="form-element">
              <input
                form="edit_gateway_form"
                type="text"
                id="name"
                placeholder={selectedGateway?.name || 'Name'}
                className="input input-bordered input-sm w-32"
                {...editRegister('name')}
              />
              {/* <p>{editFormErrors.name?.message}</p> */}
            </div>
          </td>
          <td>
            <fieldset>
              <input
                form="edit_gateway_form"
                type="text"
                id="ipv4Address"
                placeholder={selectedGateway?.ipv4Address || 'IPv4 Address'}
                className="input input-bordered input-sm w-32"
                {...editRegister('ipv4Address')}
              />
              {/* <p>{editFormErrors.ipv4Address?.message}</p> */}
            </fieldset>
          </td>
          <td>
            {!gateway.peripheralCount ? (
              <p>No devices</p>
            ) : (
              <div className="grid grid-flow-col items-center justify-start">
                <p>
                  {gateway.peripheralCount === 1
                    ? '1 Peripheral Device'
                    : `${gateway.peripheralCount} Peripheral Devices`}
                </p>
                <div className="dropdown dropdown-left">
                  <label className="btn btn-disabled m-1 ml-10 min-h-[2rem] h-[2rem]">
                    Details
                  </label>
                </div>
              </div>
            )}
          </td>
          <td>
            <button
              id="edit_gateway_form_button"
              type="submit"
              form="edit_gateway_form"
              onClick={event => {
                handleEditToggle(gateway, false);
                event.currentTarget.form?.requestSubmit();
              }}
              className="btn mt-1 min-h-[2rem] h-[2rem]"
              disabled={
                (selectedGateway !== null && selectedGateway !== gateway) ||
                addAction
              }
            >
              {selectedGateway === gateway ? 'OK' : 'Edit'}
            </button>
          </td>
        </>
      ) : (
        <>
          <td>{gateway.serialNumber}</td>
          <td>{gateway.name}</td>
          <td>{gateway.ipv4Address}</td>
          <td>
            <div className="grid grid-flow-col items-center justify-start">
              <p>
                {gateway.peripheralCount === 1
                  ? '1 Peripheral Device'
                  : `${gateway.peripheralCount} Peripheral Devices`}
              </p>
              <label
                htmlFor="modal_details"
                className={classNames('btn m-1 ml-10 min-h-[2rem] h-[2rem]', {
                  'btn-disabled': selectedGateway !== null || addAction,
                })}
                onClick={() =>
                  setModalElement(<PeripheralList gateway={gateway} />)
                }
              >
                Details
              </label>
            </div>
          </td>
          <td>
            <button
              id="edit_button"
              className="btn mt-1 min-h-[2rem] h-[2rem]"
              onClick={() => handleEditToggle(gateway, true)}
              disabled={
                (selectedGateway !== null && selectedGateway !== gateway) ||
                addAction
              }
            >
              {selectedGateway === gateway ? 'OK' : 'Edit'}
            </button>
          </td>
        </>
      )}
    </>
  );
};

export default GatewayListItem;
