"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Contoroll-Allow-Origin', '*');
    res.header('Access-Contoroll-Allow-Methods', '*');
    res.header('Access-Contoroll-Allow-Headers', '*');
    next();
});
app.listen(port, () => {
    console.log('Start on port 3000');
});
const users = [
    { id: 1, name: "User1", email: "user1@test.local" },
    { id: 2, name: "User2", email: "user2@test.local" },
    { id: 3, name: "User3", email: "user3@test.local" }
];
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/users', (req, res) => {
    res.send(JSON.stringify(users));
});
// https://qiita.com/zaburo/items/69726cc42ef774990279
