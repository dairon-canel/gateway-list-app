import { useEffect, useState } from 'react';
import { Gateway, PeripheralDevice } from '../types';

interface ITableAddActionProps {
  buttonCancelText: string;
  buttonAddText: string;
}

export const useTableAddAction = ({
  buttonCancelText,
  buttonAddText,
}: ITableAddActionProps) => {
  const [selectedItem, setSelectedItem] = useState<
    Gateway | PeripheralDevice | null
  >(null);
  const [addAction, setAddAction] = useState<boolean>(false);

  const [removeAddAction, setRemoveAddAction] = useState<boolean>(false);

  const handleAddToggle = () => {
    if (!addButtonState.enabled) {
      setAddAction(true);
      return setAddButtonState({
        buttonText: buttonCancelText,
        enabled: true,
        action: () => {
          setAddAction(false);
          setAddButtonState({
            buttonText: buttonAddText,
            enabled: false,
            action: handleAddToggle,
          });
        },
      });
    }
    return setAddButtonState({
      buttonText: buttonAddText,
      enabled: false,
      action: handleAddToggle,
    });
  };

  const [addButtonState, setAddButtonState] = useState({
    buttonText: buttonAddText,
    enabled: false,
    action: handleAddToggle,
  });

  const toggleEditClick = (item: Gateway | PeripheralDevice) => {
    if (selectedItem !== item) {
      setRemoveAddAction(true);
      setAddButtonState({
        buttonText: buttonCancelText,
        enabled: false,
        action: () => {
          setRemoveAddAction(false);
          setAddButtonState({
            buttonText: buttonAddText,
            enabled: false,
            action: handleAddToggle,
          });
          setSelectedItem(null);
        },
      });
      return setSelectedItem(item);
    }
    setAddButtonState({
      buttonText: buttonAddText,
      enabled: false,
      action: handleAddToggle,
    });
    return setSelectedItem(null);
  };

  return {
    removeAddAction,
    selectedItem,
    addAction,
    toggleEditClick,
    addButtonState,
  };
};

export const useTableItemAddAction = (
  removeAddAction: boolean,
  toggleEditClick: (item: Gateway | PeripheralDevice) => void,
) => {
  const [editButtonToggle, setEditButtonToggle] = useState(false);

  useEffect(() => {
    if (!removeAddAction) setEditButtonToggle(false);
  }, [removeAddAction]);

  const handleEditToggle = (
    item: Gateway | PeripheralDevice,
    value: boolean,
  ) => {
    setEditButtonToggle(value);
    return toggleEditClick(item);
  };

  return { editButtonToggle, handleEditToggle };
};
