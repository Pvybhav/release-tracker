import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

function Modal({
  open = false,
  handleSubmit = () => {},
  handleCancel = () => {},
  title = "",
  children = "",
}) {
  return (
    <Dialog open={open} onClose={handleCancel} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 transition-opacity bg-gray-500/75 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  {title && (
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      {title}
                    </DialogTitle>
                  )}
                  <div className="w-full mt-2">
                    {children && <div>{children}</div>}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
              >
                Create
              </button>
              <button
                type="button"
                data-autofocus
                onClick={handleCancel}
                className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default Modal;
