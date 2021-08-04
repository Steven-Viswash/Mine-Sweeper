document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    let width = 10 
    let bombCount = 20
    let flags = 0
    let squares = []
    let isGameOver = false

    function createBoard() {
        flagsLeft.innerHTML = bombCount

        const bombsArray = Array(bombCount).fill('bomb')
        const emptyArray = Array(width * width - bombCount).fill('valid')
        const concatedArray = emptyArray.concat(bombsArray)
        const shuffledArray = concatedArray.sort(() => Math.random() -0.5)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            square.addEventListener('click', function(e) {
                click(square)
            })

            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width == 0)
            const isRightEdge = (i % width == width - 1)

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total ++
                if (i > 10 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total ++
                if (i > 9 && squares[i - width].classList.contains('bomb')) total ++
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total ++ 
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total ++ 
                if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total ++
                if (i < 90 && squares[i + width].classList.contains('bomb')) total ++
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total ++
                squares[i].setAttribute('data', total)
            }
        }
    }
    createBoard()

    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombCount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = ' 🚩 '
                flags ++
                flagsLeft.innerHTML = bombCount - flags 
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags --
                flagsLeft.innerHTML = bombCount - flags
            }
        }
    }

    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    }

    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9) {
                const newId = squares[parseInt(currentId) - width].id 
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id 
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 99 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id 
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 89 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id 
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id 
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }

    function gameOver(square) {
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true
        const boomElement1 = document.querySelector('.boom-1')
        const boomElement2 = document.querySelector('.boom-2')

        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = ' 💣 '
                square.classList.remove('bomb')
                square.classList.add('checked')
                boomElement1.innerHTML = ' 💣 '
                boomElement2.innerHTML = ' 💣 '
            }
        })
    }

    function checkForWin() {
        let matches = 0
        const boomElement1 = document.querySelector('.boom-1')
        const boomElement2 = document.querySelector('.boom-2')

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches ++
            }
            if (matches === bombCount) {
                result.innerHTML = 'YOU WIN!'
                boomElement1.innerHTML = ' 🎊 '
                boomElement2.innerHTML = ' 🎊 '
                isGameOver = true
            }
        }
    }
})
