import { Application, Router, send } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import teamRoutes from "./routes/teamRoutes.ts";
import tournamentRoutes from "./routes/tournamentRoutes.ts";

const app = new Application();
const router = new Router();

// Serve OpenAPI specification file
router.get("/openapi.json", async (ctx) => {
  await send(ctx, "./openapi.json", {
    root: `${Deno.cwd()}/api`,
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
});

// Serve Swagger UI
router.get("/api-docs", async (ctx) => {
  ctx.response.headers.set("Content-Type", "text/html");
  ctx.response.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Swagger UI</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.1/swagger-ui.css" />
        <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.17.1/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.17.1/favicon-16x16.png" sizes="16x16" />
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.17.1/swagger-ui-bundle.js" crossorigin></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.17.1/swagger-ui-standalone-preset.js" crossorigin></script>
        <script>
            window.onload = function() {
                // Begin Swagger UI call
                const ui = SwaggerUIBundle({
                    url: "/openapi.json", // Our OpenAPI spec
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "StandaloneLayout"
                });

                window.ui = ui;
            };
        </script>
    </body>
    </html>
    `;
});

router.get("/health", (ctx) => {
  ctx.response.body = { status: "ok" };
});

// Redirection de la racine vers la documentation
router.get("/", (ctx) => {
    ctx.response.redirect('/api-docs');
});


app.use(router.routes());
app.use(router.allowedMethods());

// Enregistrement des routes de l'application
app.use(teamRoutes.routes());
app.use(teamRoutes.allowedMethods());
app.use(tournamentRoutes.routes());
app.use(tournamentRoutes.allowedMethods());


console.log("Server running on http://localhost:8000");
console.log("Swagger UI available on http://localhost:8000/api-docs");

await app.listen({ port: 8000 });
