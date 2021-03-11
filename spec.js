const db = require("./config/db");
describe("SMS Scheduler Tests", () => {
  it("Database connection test", async (done) => {
    const isConnected = await db.connnect();
    expect(isConnected).toEqual(true);
    done();
  }, 10000);
});
