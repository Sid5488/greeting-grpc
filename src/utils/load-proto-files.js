const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

function loadProtoFile(protoPath, pkg, configurations) {
  const packageDefinition = protoLoader.loadSync(
    protoPath,
    configurations
  );

  const proto = grpc.loadPackageDefinition(packageDefinition)[pkg];

  return proto;
}

module.exports = { loadProtoFile };
