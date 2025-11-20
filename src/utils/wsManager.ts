const clients = new Map<string, any>();

export function registerClient(orderId: string, socket: any) {
  clients.set(orderId, socket);
}

export function sendUpdate(orderId: string, message: any) {
  const client = clients.get(orderId);
  if (client) {
    client.send(JSON.stringify(message));
  }
}

export function removeClient(orderId: string) {
  clients.delete(orderId);
}
