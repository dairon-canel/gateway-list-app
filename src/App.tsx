import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactElement } from 'react';
import './App.css';
import GatewayList from './components/GatewayList';
import Modal from './components/Modal';

function App() {
  const queryClient = new QueryClient();
  const [modalElement, setModalElement] = useState<ReactElement | null>(null);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen grid grid-rows-[auto_1fr] relative bg-base-content">
        <h1 className="text-center text-3xl py-8 font-extrabold text-base-100 self-center">
          Gateway Master
        </h1>
        <GatewayList setModalElement={setModalElement} />
      </div>
      <Modal modalKey="modal_details" onClose={() => setModalElement(null)}>
        <div>{modalElement}</div>
      </Modal>
    </QueryClientProvider>
  );
}

export default App;
