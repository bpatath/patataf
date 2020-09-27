import Koa from "koa";
import mount from "koa-mount";
//import frontend from "../../../../src/frontend";
import backend from "../../../../src/backend";

const app = new Koa();

//app.mount(frontend.app);
app.use(mount(backend.app));

app.listen(backend.port, backend.bind, () => {
  console.log("Server started on " + backend.bind + ":" + backend.port);
});
