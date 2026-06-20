const Loading = ({ height = "100vh" }) => {
  return (
    <div
      style={{ height }}
      className="flex items-center justify-center h-screen bg-transparent"
    >
      <div className="w-10 h-10 rounded-full border-3 border-indigo-500 dark:border-indigo-400 border-t-transparent dark:border-t-transparent animate-spin"></div>
    </div>
  );
};

export default Loading;
