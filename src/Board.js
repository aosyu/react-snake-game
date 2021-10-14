import React from 'react';
import {Snake} from "./Snake";

export class Board extends React.Component {
    GAME_SPEED = 200

    constructor(props) {
        super(props);

        this.onKey = this.onKey.bind(this)
        this.state = this.reset_game()
    }

    update() {
        this.timeout = setTimeout(() => this.setState(state => this.update_state(state), () => this.update()), this.GAME_SPEED)
    }

    update_state(state) {
        let gameStatus = state.snake.makeMove(state.lastPressed, this.BOARD_SIZE, state.food, state.obstacles)
        let lastState = {...state, gameStatus: gameStatus}
        return (gameStatus === "ATE" ? {...state, food: this.generateFood(state.obstacles)} : lastState)
    }

    generateFood(obstacles, segments) {
        let f = this.generateRandomCell()
        while (obstacles.find(s => s.x === f.x && s.y === f.y)
            && segments.find(s => s.x === f.x && s.y === f.y)) {
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

    renderSquare(x, y) {
        if (
            this.state.snake.segments.find(s => s.x === x && s.y === y)
        ) {
            return (
                <div key={x + "_" + y} className="snake">
                </div>
            )
        } else if (x === this.state.food.x && y === this.state.food.y) {
            return (
                <div key={x + "_" + y} className="food">
                </div>
            )
        } else if (this.state.obstacles.find(s => s.x === x && s.y === y)) {
            return (
                <div key={x + "_" + y} className="obstacle">
                </div>
            )
        } else
            return (
                <div key={x + "_" + y} className="cell">
                </div>
            )
    }

    onKey(e) {
        if (this.state && this.state.gameStatus && this.state.gameStatus !== "OK") {
            return
        }

        let lastPressed = "dsads"
        switch (e.key) {
            case "ArrowUp":
                lastPressed = "top"
                break
            case "ArrowDown":
                lastPressed = "bottom"
                break
            case "ArrowLeft":
                lastPressed = "left"
                break
            case "ArrowRight":
                lastPressed = "right"
                break
            default:
                break
        }

        this.setState(state => ({...state, lastPressed: lastPressed}))
    }

    renderField() {
        const row = [];

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                row.push(this.renderSquare(i, j));
            }
        }
        return row;
    }

    // Returns a random number between min (inclusive) and max (exclusive)
    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
        // TODO :: сделать так, чтобы яблоко не появлялось в змее или в препятствии
    }

    generateRandomCell() {
        return {x: this.getRandomArbitrary(0, this.BOARD_SIZE - 1), y: this.getRandomArbitrary(0, this.BOARD_SIZE - 1)}
    }

    generateObstacles() {
        let tmp = []
        // TODO ::
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

    reset_game() {
        this.BOARD_SIZE = 15
        let gameStatus = "OK"
        let obstacles = this.generateObstacles()
        let snake = new Snake()

        return {
            snake: snake,
            obstacles: obstacles,
            gameStatus: gameStatus,
            food: this.generateFood(obstacles, snake.segments),
            lastPressed: "bottom"
        }
    }


    render() {
        return (
            <div className="field"
                 style={{
                     height: "100%",
                     width: "100%",
                     display: "grid",
                     "grid-template-columns": `repeat(${this.BOARD_SIZE}, 1fr)`,
                     "grid-template-rows": `repeat(${this.BOARD_SIZE}, 1fr)`
                 }}
                 tabIndex="-1" onKeyDown={event => this.onKey(event)}
            >

                {(() => {
                    if (this.state.gameStatus === "SELFKILLED" || this.state.gameStatus === "OBSTACLE" || this.state.gameStatus === "GAME_OVER") {
                        return (<div>
                            <div>
                                Game over
                            </div>
                            <div>
                                {this.state.gameStatus}
                            </div>

                            <button onClick={() => this.setState(_ => this.reset_game())}>
                                Start again
                            </button>
                        </div>)
                    }
                    return this.renderField()
                })()}
            </div>
        );
    }
}