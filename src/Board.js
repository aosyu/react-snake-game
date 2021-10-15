import React from 'react';
import {Snake} from "./Snake";

export class Board extends React.Component {
    GAME_SPEED = 200
    lastPressed = "bottom"

    constructor(props) {
        super(props);

        this.onKey = this.onKey.bind(this)
        this.state = this.reset_game()
    }

    update() {
        this.timeout = setTimeout(() => this.setState(state => this.update_state(state), () => this.update()), this.GAME_SPEED)
    }

    update_state(state) {
        let tail = state.snake.segments[0]
        let gameStatus = state.snake.makeMove(this.lastPressed, this.BOARD_SIZE, state.food, state.obstacles)
        let lastState = {...state, gameStatus: gameStatus}
        let food = undefined
        if (gameStatus === "ATE") {
            food = this.generateFood(state.obstacles, state.snake.segments)
        }
        let field = this.renderField(lastState, tail, food)
        lastState = (food ? {...lastState, food} : lastState)
        return {...lastState, field}
    }

    generateFood(obstacles, segments) {
        let f = this.generateRandomCell()
        while (obstacles.find(s => s.x === f.x && s.y === f.y)
        || segments.find(s => s.x === f.x && s.y === f.y)) {
            f = this.generateRandomCell()
        }
        return f
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onKey)

        this.setState(_ => this.reset_game(), () => this.update())
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKey)

        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    }

    onKey(e) {
        if (this.state.gameStatus !== "OK") {
            return
        }
        switch (e.key) {
            case "ArrowUp":
                this.lastPressed = "top"
                break
            case "ArrowDown":
                this.lastPressed = "bottom"
                break
            case "ArrowLeft":
                this.lastPressed = "left"
                break
            case "ArrowRight":
                this.lastPressed = "right"
                break
            default:
                break
        }
    }

    snakeSquare(k1, k2) {
        return <div key={k1 + "_" + k2} className="snake"/>
    }
    foodSquare(k1, k2) {
        return <div key={k1 + "_" + k2} className="food">🐭</div>
    }
    cellSquare(k1, k2) {
        return <div key={k1 + "_" + k2} className="cell"/>
    }

    renderField(state, tail, food) {
        let segments = state.snake.segments
        let newField = state.field
        let head = segments[segments.length - 1]
        newField[head.x][head.y] = this.snakeSquare(head.x, head.y)
        if (state.gameStatus === "ATE") {
            newField[food.x][food.y] = this.foodSquare(food.x, food.y)
        } else {
            newField[tail.x][tail.y] = this.cellSquare(tail.x, tail.y)
        }
        return newField
    }

    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    generateRandomCell() {
        return {x: this.getRandomArbitrary(0, this.BOARD_SIZE - 1), y: this.getRandomArbitrary(0, this.BOARD_SIZE - 1)}
    }

    generateObstacles() {
        let tmp = []
        for (let i = 0; i < 10; i++) {
            let cell = this.generateRandomCell()
            while
                (cell.y === 0 && cell.x < 5) {
                cell = this.generateRandomCell()
            }
            tmp.push(cell)
        }
        return tmp
    }

    createField(snake, obstacles, food) {
        let field = []
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            let row = []
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                row.push(this.cellSquare(i, j))
            }
            field.push(row)
        }
        for (let seg of snake.segments) {
            field[seg.x][seg.y] = this.snakeSquare(seg.x, seg.y)
        }
        for (let obs of obstacles) {
            field[obs.x][obs.y] = (<div key={obs.x + "_" + obs.y} className="obstacle">😈</div>)
        }
        field[food.x][food.y] = this.foodSquare(food.x, food.y)
        return field
    }

    reset_game() {
        this.BOARD_SIZE = 10
        let gameStatus = "OK"
        let obstacles = this.generateObstacles()
        let snake = new Snake()
        let food = this.generateFood(obstacles, snake.segments)
        let field = this.createField(snake, obstacles, food)
        this.lastPressed = "bottom"

        return {
            snake: snake,
            obstacles: obstacles,
            gameStatus: gameStatus,
            food: food,
            field: field
        }
    }

    getField() {
        return this.state.field.flatMap(x => x)
    }

    render() {
        return (
                (() => {
                    if (this.state.gameStatus === "SELF-MURDER" || this.state.gameStatus === "OBSTACLE" || this.state.gameStatus === "CRASHED") {
                        return (<div className="gameOver">
                            <div className="gameOver_head">
                                Game over
                            </div>
                            <div>
                                Reason: {this.state.gameStatus}
                            </div>

                            <button onClick={() => this.setState(_ => this.reset_game())}>
                                Start again
                            </button>
                        </div>)
                    }
                    return (<div className="field"
                         style={{
                             height: `calc(${this.BOARD_SIZE}*2rem + ${2 * this.BOARD_SIZE}px)`,
                             "max-width": `calc(${this.BOARD_SIZE}*2rem + ${2 * this.BOARD_SIZE}px)`,
                             "grid-template-columns": `repeat(${this.BOARD_SIZE}, 1fr)`,
                             "grid-template-rows": `repeat(${this.BOARD_SIZE}, 1fr)`
                         }}
                         tabIndex="0" onKeyDown={event => this.onKey(event)}
                    >
                        {this.getField()}
                        </div>)
                })()
        );
    }
}