import { Router } from "express";
import _ from "lodash";

const boardRouter = Router();

let boards = [{
    id: 1,
    title: "게시판 제목입니다.",
    content: "게시판 내용입니다.",
    createDate: "2021-09-05",
    updateDate: "2021-09-06"
}];

boardRouter.get("/", (req, res) => {
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

boardRouter.delete("/:id", (req, res) => {
    let findBoard = _.find(boards, {id: parseInt(req.params.id)});
    let result;
    if(findBoard && findBoard.id == req.params.id){
        boards = _.reject(boards, ["id", parseInt(req.params.id)]);
        result = `아이디가 ${req.params.id}인 글 삭제`;
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

export default boardRouter;