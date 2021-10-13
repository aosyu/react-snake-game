export class Snake {
    segments = [{x: 0, y: 0}]

    makeMove(direction, BOARD_SIZE, food, obstacles) {
        let current_head = this.segments[this.segments.length - 1]
        let x = current_head.x
        let y = current_head.y
        switch (direction) {
            // TODO :: поправить логику. где x, где y - все перепутано
            case "left":
                y = (y - 1 + BOARD_SIZE) % BOARD_SIZE
                break
            case "right":
                y = (y + 1) % BOARD_SIZE
                break
            case "top":
                if (x === 0) {
                    return "GAME_OVER"
                }
                x = (x - 1 + BOARD_SIZE) % BOARD_SIZE
                break
            default:
            case "down":
                if (x === BOARD_SIZE - 1) {
                    return "GAME_OVER"
                }
                x = (x + 1) % BOARD_SIZE
                break
        }

        if (this.segments.find(s => s.x === x && s.y === y)) {
            return "SELFKILLED";
        }

        if (obstacles.find(s => s.x === x && s.y === y)) {
            return "OBSTACLE"
        }

        this.segments.push({x, y})

        if (x === food.x && y === food.y) {
            let last = this.segments[0]
            this.segments.shift()
            x = last.x
            y = last.y
            this.segments.unshift({x,y})
            return "ATE"
        } else {
            this.segments.shift()
        }
        return "OK"
    }
}