import React from 'react';
import {Snake} from "./Snake";

export class Board extends React.Component {
    snake = new Snake()
    GAME_STATUS = "OK"
    // food = {x: 0, y: 0}

    constructor(props) {
        super(props);
        this.onKey = this.onKey.bind(this)

        this.reset_game()
            setInterval(() => {
            this.GAME_STATUS = this.snake.makeMove(this.lastPressed, this.BOARD_SIZE, this.food, this.obstacles)

            if (this.GAME_STATUS === "ATE") {
                this.food = this.generateFood()
            }
            this.forceUpdate()
        }, 100)
    }

    generateFood() {
        let f = this.generateRandomCell()
        while (this.obstacles.find(s => s.x === f.x && s.y === f.y)) {
            f = this.generateRandomCell()
        }
        return f
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onKey)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKey)
    }

    renderSquare(x, y) {
        // TODO
        // console.log(this.snake)
        if (
            // TODO :: вынести в функцию
            this.snake.segments.find(s => s.x === x && s.y === y)
        ) {
            // TODO :: copypast
            return (
                <div key={x + "_" + y} className="snake">
                </div>
            )
        } else if (x === this.food.x && y === this.food.y) {
            return (
                <div key={x + "_" + y} className="food">
                </div>
            )
        } else if (this.obstacles.find(s => s.x === x && s.y === y)) {
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

    lastPressed = "bottom"

    onKey(e) {
        if (this.GAME_STATUS !== "OK") {
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

    obstacles = []

    // TODO :: сделать так, чтобы сразу после генерации змея не упиралась в препятствие
    generateObstacles() {
        let tmp = []
        // TODO ::
        for (let i = 0; i < 10; i++) {
            // let X = this.generateRandomCell()
            // let cell = [{x: X[0]}, {y: X[1]}]
            let cell = this.generateRandomCell()
            while ((cell.x === this.food.x && cell.y === this.food.y)
            || (cell.y === 0 && cell.x < 5)) {
                cell = this.generateRandomCell()
            }
            tmp.push(cell)
        }
        return tmp
    }

    reset_game() {
        // this.snake = new Snake()
        this.BOARD_SIZE = 15
        this.GAME_STATUS = "OK"
        this.obstacles = this.generateObstacles()
        let food = this.generateFood()
        this.lastPressed = "bottom"
        this.state = {snake: new Snake(), food: food, }
        // this.forceUpdate()
    }


    render() {
        return (
            <div className="shit"
                 style={{
                     height: "100%",
                     width: "100%",
                     display: "grid",
                     "grid-template-columns": `repeat(${this.BOARD_SIZE}, 1fr)`,
                     "grid-template-rows": `repeat(${this.BOARD_SIZE}, 1fr)`
                 }}
                 tabIndex="0" onKeyDown={event => this.onKey(event)}
            >

                {(() => {
                    if (this.GAME_STATUS === "SELFKILLED" || this.GAME_STATUS === "OBSTACLE" || this.GAME_STATUS === "GAME_OVER") {
                        return (<div>
                            <div>
                                Game over
                            </div>
                            <div>
                                {this.GAME_STATUS}
                            </div>
                            <button onClick={() => this.reset_game()}>
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