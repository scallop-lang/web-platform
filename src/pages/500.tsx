const ServerError = () => {
  return (
    <main className="flex h-[calc(100vh-53px)] flex-col items-center justify-center space-y-2.5">
      <h2 className="text-5xl font-bold text-secondary-foreground">500</h2>
      <p className="text-2xl font-medium">Internal server error</p>
    </main>
  );
};

export default ServerError;
