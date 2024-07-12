const grpc = require("@grpc/grpc-js");

const { loadProtoFile } = require("../utils/load-proto-files");

class Application {
  #proto = null;

  configuration() {
    const PROTO_PATH = __dirname + "/../protos/greeters.proto";
    
    this.#proto = loadProtoFile(PROTO_PATH, "helloworld", {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
  }

  start() {
    this.configuration();

    const server = new grpc.Server();

    server.addService(this.#proto.Greeter.service, { sayHello: this.sayHello });
    server.bindAsync(
      "0.0.0.0:50051", 
      grpc.ServerCredentials.createInsecure(), 
      (err, port) => {
        if (err != null) return console.error(err);

        console.log(`gRPC listening on ${port}`);
      }
    );
  }

  sayHello(call, callback) {
    callback(null, { message: `Hello ${call.request.name}` });
  }
}

const application = new Application();

application.start();
