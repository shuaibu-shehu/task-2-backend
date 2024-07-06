import e from "express";

const app = e();

app.get("/", (req, res) => {
    res.send("Hello Worled");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

export default app;