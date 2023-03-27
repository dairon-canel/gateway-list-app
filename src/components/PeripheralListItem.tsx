import { format } from 'date-fns';
import { FC, useEffect } from 'react';
import { useTableItemAddAction } from '../hooks';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Gateway, PeripheralDevice } from '../types';

interface IPeripheralListItemProps {
  removeAddAction: boolean;
  addAction: boolean;
  peripheral: PeripheralDevice;
  selectedPeripheral: PeripheralDevice | null;
  toggleEditClick: (item: Gateway | PeripheralDevice) => void;
  networkStatus: 'OFFLINE' | 'ONLINE';
  setNetworkStatus: React.Dispatch<React.SetStateAction<'OFFLINE' | 'ONLINE'>>;
  editRegister: UseFormRegister<{
    vendor: string;
  }>;
  editFormErrors: FieldErrors<{
    vendor: string;
  }>;
}

const PeripheralListItem: FC<IPeripheralListItemProps> = ({
  removeAddAction,
  addAction,
  peripheral,
  selectedPeripheral,
  toggleEditClick,
  networkStatus,
  setNetworkStatus,
  editRegister,
  editFormErrors,
}) => {
  const { editButtonToggle, handleEditToggle } = useTableItemAddAction(
    removeAddAction,
    toggleEditClick,
  );

  useEffect(() => {
    setNetworkStatus('OFFLINE');
  }, []);

  return (
    <>
      {editButtonToggle ? (
        <>
          <td>{peripheral.uid}</td>
          <td>
            <div className="form-element">
              <input
                form="edit_peripheral_form"
                type="text"
                id="vendor"
                placeholder={selectedPeripheral?.vendor || 'Vendor'}
                className="input input-bordered input-sm w-32"
                {...editRegister('vendor')}
              />
              {/* <p>{editFormErrors.vendor?.message}</p> */}
            </div>
          </td>
          <td>
            {peripheral.createdAt
              ? format(new Date(peripheral.createdAt), 'yyyy/mm/dd')
              : 'Not Available'}
          </td>
          <td>
            <button
              type="button"
              className="btn mt-1 min-h-[1.3rem] h-[1.3rem]"
              onClick={() => {
                if (networkStatus === 'OFFLINE') setNetworkStatus('ONLINE');
                if (networkStatus === 'ONLINE') setNetworkStatus('OFFLINE');
              }}
            >
              {networkStatus}
            </button>
          </td>
          <td>
            <button
              form="edit_peripheral_form"
              type="submit"
              className="btn mt-1 min-h-[2rem] h-[2rem]"
              onClick={event => {
                handleEditToggle(peripheral, false);
                event.currentTarget.form?.requestSubmit();
              }}
              disabled={
                (selectedPeripheral !== null &&
                  selectedPeripheral !== peripheral) ||
                addAction
              }
            >
              {selectedPeripheral === peripheral ? 'OK' : 'Edit'}
            </button>
          </td>
        </>
      ) : (
        <>
          <td>{peripheral.uid}</td>
          <td>{peripheral.vendor}</td>
          <td>
            {peripheral.createdAt
              ? format(new Date(peripheral.createdAt), 'yyyy/mm/dd')
              : 'Not Available'}
          </td>
          <td>{peripheral.status}</td>
          <td>
            <button
              className="btn mt-1 min-h-[2rem] h-[2rem]"
              onClick={() => handleEditToggle(peripheral, true)}
              disabled={
                (selectedPeripheral !== null &&
                  selectedPeripheral !== peripheral) ||
                addAction
              }
            >
              {selectedPeripheral === peripheral ? 'OK' : 'Edit'}
            </button>
          </td>
        </>
      )}
    </>
  );
};

export default PeripheralListItem;
