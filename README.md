# ORDER EXECUTION ENGINE (MOCK DEX ROUTER)



Order type chosen: Market Order — executes immediately at current price, which fits the assignment focus on routing and execution latency. The same engine can be extended to support Limit and Sniper orders by adding a price watch / event trigger layer and enqueueing jobs only when conditions match.





This project is a simplified backend simulation of an order execution engine like those used in decentralized exchanges.

It demonstrates:



REST API to create swap orders



A queue-based processing system using BullMQ



A background worker that processes orders



A WebSocket channel for live order status



Basic mock routing (Raydium/Meteora)



Mock transaction building and submission



TypeScript-based Fastify server



The project shows a simple order life-cycle in a clean backend structure.



PROJECT STRUCTURE



src/

api/

orderRoute.ts

queue/

orderQueue.ts

orderWorker.ts

redis.ts

services/

orderService.ts

routingService.ts

transactionBuilder.ts

utils/

wsManager.ts

wsServer.ts

app.ts

server.ts



HOW TO RUN



Install dependencies:

npm install



Start Redis

Use any Windows Redis (Memurai / Redis Stack).

Redis output should show:

Ready to accept connections



Build the project:

npm run build



Start the server:

npm start



Server runs at:

HTTP → http://localhost:3000



WebSocket → ws://localhost:3000/ws/<orderId>



API



POST /orders/execute

Creates a new order.



Request body:

{

"fromToken": "SOL",

"toToken": "USDC",

"amount": "1"

}



Curl example:

curl -X POST http://localhost:3000/orders/execute

&nbsp;-H "Content-Type: application/json" -d "{"fromToken":"SOL","toToken":"USDC","amount":"1"}"



Response:

{ "orderId": "..." }



WEBSOCKET



Connect to:

ws://localhost:3000/ws/<orderId>



The worker will push updates such as:



pending

routing

building

submitting

confirmed

or

failed



PROCESSING FLOW



API receives the request



Job is added to BullMQ queue



Worker picks it up



Worker performs:



route selection



transaction building



simulated submission



WebSocket sends updates



Order ends as confirmed or failed



NOTES



This is a mock implementation and not connected to real blockchain systems



Routing and transaction logic are simulated



Small artificial delays are included to mimic async workflows

