const mongoose = require("mongoose")

const todoschema = new mongoose.Schema({
    value: String,
    doneAt: Date,
    order: Number,
})

//오브젝트 아이디로 todoId 생성하기
todoschema.virtual("todoId").get(function() {
    return this._id.toHexString()
})

todoschema.set("toJSON", {
    virtuals: true
})

module.exports = mongoose.model("Todo", todoschema)