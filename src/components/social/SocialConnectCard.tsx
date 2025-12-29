export function SocialConnectCard({
  name,
  connected,
  onConnect,
  onDisconnect,
}: {
  name: string;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="text-lg font-medium">{name}</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {connected ? "Connected" : "Not connected"}
      </p>

      <button
        onClick={connected ? onDisconnect : onConnect}
        className={`mt-4 rounded-md px-4 py-2 text-sm ${
          connected
            ? "bg-red-500 text-white"
            : "bg-primary text-white"
        }`}
      >
        {connected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}
