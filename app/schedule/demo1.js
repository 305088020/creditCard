module.exports = {
  schedule: {
    interval: "10s",
    type: "all"
  },
  async task(ctx) {
    await ctx.service.card.testDemo();
    console.log(">>>>>>>>>>>>123");
  }
};
