Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Bun!");
  },
});
