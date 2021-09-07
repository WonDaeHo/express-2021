import { Router } from "express";
import _ from "lodash";
import faker from "faker";
faker.locale = "ko";

const userRouter = Router();

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

let users = [];
for (let i=1; i<1000; i+=1){
    users.push({
        id: i,
        name: faker.name.lastName() + faker.name.firstName(),
        age: getRandomInt(15, 50),
    })
}
console.log("준비됨");


userRouter.get("/", (req, res) => {
    res.send({
        count: users.length,
        users
    });
});

userRouter.get("/:id", (req, res) => {
    const findUser = _.find(users, {id: parseInt(req.params.id)});
    let msg;
    if(findUser){
        msg = "정상적으로 조회되었습니다.";
        res.status(200).send({
            msg, findUser
        });
    } else {
        msg = "해당 아이디를 가진 유저가 없습니다.";
        res.status(400).send({
            msg, findUser
        });
    }
    
});

//유저생성
userRouter.post("", (req, res) => {
    const createUser = req.body;
    const check_user = _.find(users, ["id", createUser.id]);
    let result;
    if(!check_user && createUser.id && createUser.name && createUser.age){
        users.push(createUser);
        result = `${createUser.name}님을 생성 했습니다.`
    } else {
        result = '입력 요청값이 잘못되었습니다.'
    }
    res.status(201).send({
        result
    });
});

//name 변경
userRouter.put("/:id", (req, res) => {
    const findUser = _.find(users, {id: parseInt(req.params.id)});
    let result;
    if(findUser && findUser.id == req.params.id){
        findUser.name = req.body.name;
        result = `유저 이름을 ${findUser.name}으로 변경`;
        res.status(200).send({
            result
        });
    } else {
        result = `아이디가 ${req.params.id}인 유저가 존재하지 않습니다.`;
        res.status(400).send({
            result
        });
    }
});

//user 지우기
userRouter.delete("/:id", (req, res) => {
    let findUser = _.find(users, {id: parseInt(req.params.id)});
    let result;
    if(findUser && findUser.id == req.params.id){
        users = _.reject(users, ["id", parseInt(req.params.id)]);
        result = `아이디가 ${req.params.id}인 유저 삭제`;
        res.status(200).send({
            result
        });
    } else {
        result = `아이디가 ${req.params.id}인 유저가 존재하지 않습니다.`;
        res.status(400).send({
            result
        });
    }
});

export default userRouter;