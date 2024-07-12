const grpc = require("@grpc/grpc-js");
const parseArgs = require("minimist");

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

    const argv = parseArgs(process.argv.slice(2), {
      string: "target"
    });

    let target;

    if (argv.target) {
      target = argv.target;
    } else {
      target = "localhost:50051";
    }

    const client = new this.#proto.Greeter(
      target, 
      grpc.credentials.createInsecure()
    );

    let user;

    if (argv._.length > 0) {
      user = argv._[0];
    } else {
      user = "world";
    }

    client.sayHello({ name: user }, function (err, response) {
      console.log("Greeting:", response.message);
    });
  }
}

const application = new Application();

application.start();
