import { createServer } from './server';
import { ENV } from './config/env';




const app = createServer();
app.listen(ENV.PORT, () => {
    console.log(`Gateway listening on :${ENV.PORT}`);

});