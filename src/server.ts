import getServer from "./config/apollo";
import { port } from './config/vars';


getServer().then((httpServer) => {
  httpServer.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
  })
})
