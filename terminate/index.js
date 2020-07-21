function terminate(server, options = { coredump: false, timeout: 1000 }) {
  //Exit function
  const exit = (code) => {
    options.coredump ? process.abort() : process.exit(code);
  };

  return (code, reason) => (err) => {
    console.log(`Process exiting with code: ${code} reason: ${reason}`);

    if (err && err instanceof Error) {
      //Log error information using winston or pino etc...
      console.log(err.message, err.stack);
    }

    //Try a graceful shutdown
    server.close(exit);
    setTimeout(exit, options.timeout).unref();
  };
}

module.exports = terminate;
