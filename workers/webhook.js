export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response("MtaaniHost Webhook Worker is running", {
        headers: { "content-type": "text/plain" }
      });
    }

    if (request.method === "POST" && url.pathname === "/webhook") {
      const body = await request.json();
      console.log("Webhook payload:", JSON.stringify(body));

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
        status: 200
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};
