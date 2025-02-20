const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-yellow-500 border-opacity-50 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
