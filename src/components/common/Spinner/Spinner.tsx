/**
 * @description Displays an animated spinner. Use while data is loading in dynamic components.
 */
const Spinner = () => {
  return (
    <div className="top-0 left-0 flex flex-col gap-y-3 items-center justify-center w-full h-full bg-white bg-opacity-75 z-spinner">
      <div
        role="progressbar"
        aria-label="progress bar"
        className="flex items-center justify-center gap-x-[5px]"
      >
        <div className="h-[10px] w-[10px] bg-primary-dark-green rounded-full animate-loading-dot [animation-delay:0.2s]" />
        <div className="h-[10px] w-[10px] bg-success-600 rounded-full animate-loading-dot [animation-delay:0.4s]" />
        <div className="h-[10px] w-[10px] bg-success-400 rounded-full animate-loading-dot [animation-delay:0.6s]" />
        <p className="text-black">Loading</p>
      </div>
    </div>
  );
};

export default Spinner;
