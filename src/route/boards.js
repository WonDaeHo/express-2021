import { Router } from "express";
import _ from "lodash";
import sequelize from "sequelize";
import faker from "faker";

const seq = new sequelize('express', 'root', 'hoy2158831a@', {
    host: 'localhost',
    dialect: 'mysql',
    // logging: false
});

const Board = seq.define("board", {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    content: {
        type: sequelize.TEXT,
        allowNull: true
    }
});

const board_sync = async() => {
    try {
        await Board.sync({force: true});
        for (let i=0; i<10000; i++) {
            await Board.create({
                title: faker.lorem.sentences(1),
                content: faker.lorem.sentences(10)
            })
        }
    } catch(err) {
        console.log(err)
    }
}
// board_sync(); // 생성 안할때, 주석

const boardRouter = Router();

let boards = [];

boardRouter.get("/", async(req, res) => {
    const boards = await Board.findAll();
    res.send({
        count: boards.length,
        boards
    });
});

boardRouter.get("/:id", (req, res) => {
    const findBoard = _.find(boards, {id: parseInt(req.params.id)});
    let msg;
    if(findBoard){
        msg = "정상적으로 조회되었습니다.";
        res.status(200).send({
            msg, findBoard
        });
    } else {
        msg = "해당 아이디를 가진 글이 없습니다.";
        res.status(400).send({
            msg, findBoard
        });
    }
    
});

boardRouter.post("", (req, res) => {
    const createBoard = req.body;
    const check_board = _.find(boards, ["id", createBoard.id]);
    let result;
    if(!check_board && createBoard.id && createBoard.title && createBoard.content && createBoard.createDate && createBoard.updateDate){
        boards.push(createBoard);
        result = `${createBoard.title} 게시글이 생성되었습니다.`
    } else {
        result = '입력 요청값이 잘못되었습니다.'
    }
    res.status(201).send({
        result
    });
});

boardRouter.put("/:id", (req, res) => {
    const findBoard = _.find(boards, {id: parseInt(req.params.id)});
    let result;
    if(findBoard && findBoard.id == req.params.id){
        findBoard.title = req.body.title;
        result = `게시판 제목을 ${findBoard.title}으로 변경`;
        res.status(200).send({
            result
        });
    } else {
        result = `아이디가 ${req.params.id}인 글이 존재하지 않습니다.`;
        res.status(400).send({
            result
        });
    }
});

boardRouter.delete("/:id", async(req, res) => {
    try{
    let board = await Board.findOne({
    where:{
    id: req.params.id
    }
    })
    if(!board){
    res.status(400).send({msg: '게시글이 존재하지 않습니다.'});
    }
    await board.destroy();
    res.status(200).send({msg: '게시글이 정상적으로 삭제 되었습니다.'})
    }catch(err){
    console.log(err);
    res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요!!"})
    }
    });

export default boardRouter;