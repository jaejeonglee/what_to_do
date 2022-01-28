const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/todo");

mongoose.connect("mongodb://localhost/to_do", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

//리스트 불러오기
router.get("/todos", async (req, res) => {
    const todos = await Todo.find().sort("-order").exec()
    res.send({ todos });
});


//작성하기
router.post("/todos", async (req, res) => {
    const { value } = req.body
    const maxOrderTodo = await Todo.findOne().sort("-order").exec()
    let order = 1

    if (maxOrderTodo) {
        order = maxOrderTodo.order + 1
    }

    const todo = new Todo({ value, order })
    await todo.save()

    res.send({ todo })
})


//수정하기
router.patch("/todos/:todoId", async (req, res) => {
    const { todoId } = req.params;
    const { order, value } = req.body;

    const todo = await Todo.findById(todoId).exec();

    if (order) {
        const targetOrder = await Todo.findOne({ order }).exec();
        if (targetOrder) {
            targetOrder.order = todo.order;
            await targetOrder.save();
        }
        todo.order = order;
        await todo.save();
    }

    if (value) {
        const targetValue = todo.value
        await Todo.updateOne({ targetValue }, { value })
    }
    res.send({result:"success"});
})

//삭제하기
router.delete("/todos/:todoId", async (req, res) => {
    const { todoId } = req.params

    const deleteTarget = await Todo.findById(todoId).exec();

    if (deleteTarget) { await Todo.deleteOne({ todoId }) }

    res.json({result: "success"})
})
app.use("/api", bodyParser.json(), router);
app.use(express.static("./assets"));//static 연결하기

app.listen(8080, () => {
    console.log("8080 서버가 켜졌어요!");
});



