import { app } from "./app.js";
import { connectToMongoDB } from "./src/config/connectToMongodb.js";
import { PORT } from "./src/config/index.js";

connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB Connection Failed!! ${error}`);
    process.exit(1);
  });
