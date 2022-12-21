$(function() {

    // WELCOME SCREEN
    const handleWelcomeScreen = () => {
        let pageVisited = sessionStorage.getItem('pageVisited')
        if (pageVisited != 'true') {
            $('.welcome-screen').addClass('welcome-screen--open')

            $('.welcome-screen__rules-button').on('click', function() {
                $('.rules').addClass('rules--open')
                $(this).addClass('welcome-screen__rules-button--clicked')
            })
        } else {
            startGame()
        }
    }

    // RULES
    const rules = () => {
        $('.welcome-screen').addClass('welcome-screen--open')
        $('.rules').addClass('rules--open')
        $('.welcome-screen__rules-button').addClass('welcome-screen__rules-button--clicked')
        $('.welcome-screen').find('.welcome-screen__title').hide()
        $('.welcome-screen').find('.welcome-screen__branding').hide()
        $('.welcome-screen').find('.welcome-screen__button').hide()
    }

    $('.rules-button').on('click', rules)

    // MENU
    const menu = () => {
        $('.stats').removeClass('stats--open')
        $('.container').toggleClass('container--locked')
        $('.menu').toggleClass('menu--open')
        $('.menu__button').toggleClass('menu__button--clicked')
    }
    $('.menu__button').on('click', menu)

    // STATISTICS
    const statistics = () => {
        let gamesPlayed = localStorage.getItem('gamesPlayed')
        let gamesWon = localStorage.getItem('gamesWon')
        let gamesWonPercentage = Math.floor((gamesWon / gamesPlayed) * 100)

        if (gamesPlayed) {
            $('.stats__played').children('.stats__number').text(gamesPlayed)
        }

        if (gamesWon) {
            $('.stats__won').children('.stats__number').text(gamesWon)
        }

        if (gamesWonPercentage) {
            $('.stats__won-percentage').children('.stats__number').text(gamesWonPercentage)
        }

        $('.stats').addClass('stats--open')

    }
    $('.stats-button').on('click', statistics)
    
    // GAME
    const startGame = () => {
        sessionStorage.setItem('pageVisited', 'true')
        
        const resetGame = () => {
            $('.welcome-screen').removeClass('welcome-screen--open')

            if ($('.menu').hasClass('menu--open')) {
                menu()
            }
            
            $('.row__dot').each(function() {
                $(this).removeAttr('data-color')
            })
    
            $('.row__response-dot').each(function() {
                $(this).removeAttr('data-response')
            })

            $('.game-buttons__delete').removeClass('deactivated')
            $('.game-buttons__reset').removeClass('deactivated')
            $('.game-buttons__random').removeClass('deactivated')

            $([document.documentElement, document.body]).animate({
                scrollTop: $('body').offset().top
            }, 1000)

            setTimeout(() => {
                $('.results').addClass('hidden')
            }, 1000)

        }
        resetGame()


        let colors = ['blue', 'light-blue', 'green', 'yellow', 'orange', 'red', 'pink', 'purple']
        let sequence = []
        let guess = []
        let currentRow = 1
        
        const generateSequence = (array) => {
            for (let i = 0; i < 4; i++) {
                array.push(colors[Math.floor(Math.random() * colors.length)])
            }
        }
        generateSequence(sequence)
        console.log(sequence)

        const deleteGuess = () => {
            if (guess.length > 0) {
                $('.row__number').each(function() {
                    if (this.textContent == currentRow) {
                        deactivateSubmitButton()
                        $(this).siblings('.row__dots').children('[data-color]').last().removeAttr('data-color')
                        guess.pop()
                    }
                })
            }
        }
        $('.game-buttons__delete').on('click', deleteGuess)

        const resetGuess = () => {
            if (guess.length > 0) {
                $('.row__number').each(function() {
                    if (this.textContent == currentRow) {
                        deactivateSubmitButton()
                        $(this).siblings('.row__dots').children('[data-color]').removeAttr('data-color')
                        guess = []
                    }
                })
            }
        }
        $('.game-buttons__reset').on('click', resetGuess)

        const randomizeGuess = () => {
            $('.row__number').each(function() {
                if (this.textContent == currentRow) {
                    
                    let randomGuess = []
                    generateSequence(randomGuess)

                    $(this).siblings('.row__dots').children().each(function(index) {
                        $(this).attr('data-color', randomGuess[index])
                    })

                    guess = [...randomGuess]
                    activateSubmitButton()
                }
            })
        }
        $('.game-buttons__random').on('click', randomizeGuess)
        
        let submitButton = document.querySelector('.color-selector__button')
        let colorSelector = document.querySelectorAll('.color-selector__dot')

        const insertGuess = (e) => {
            let clickedColor = e.target.getAttribute('data-color')

            $('.row__number').each(function() {
                if (this.textContent == currentRow) {

                    $(this).siblings('.row__dots').children('.row__dot:not([data-color])').first().attr('data-color', clickedColor)
                    guess.push(clickedColor)

                }
            })

            if (guess.length === 4) {
                activateSubmitButton()
            }
        }

        const insertResponseDot = (color) => {
            $('.row__number').each(function() {
                if (this.textContent == currentRow) {
                    $(this).siblings('.row__response').children('.row__response-dot:not([data-response])').first().attr('data-response', color)
                }
            })
        }

        const submitGuess = () => {
            let sequenceCopy = sequence.slice()
            let isMatch = true

            for (let i = 0; i < sequence.length; i++) {
                if (guess[i] === sequence[i]) {
                    sequenceCopy[i] = 0
                    guess[i] = -1
                    insertResponseDot('black', i)
                } else {
                    isMatch = false
                }
            }

            for (let i = 0; i < sequence.length; i++) {
                if (sequenceCopy.indexOf(guess[i]) !== -1) {
                    sequenceCopy[sequenceCopy.indexOf(guess[i])] = 0
                    insertResponseDot('gray', i)
                }
            }

            guess = []
            currentRow++
            deactivateSubmitButton()
            if (isMatch) {
                gameOver('won')
            } else if (currentRow > 12) {
                gameOver('lost')
            }
        }

        const gameOver = (state) => {

            let gamesPlayed = localStorage.getItem('gamesPlayed')
            let gamesWon = localStorage.getItem('gamesWon')

            gamesPlayed++
            localStorage.setItem('gamesPlayed', gamesPlayed)

            if (state === 'won') {
                gamesWon++
                localStorage.setItem('gamesWon', gamesWon)
            }

            let title = 'You broke the code!'
            let text = "Congratulations, you're officially smarter than the computer."
            let button = 'Play again'

            if (state === 'lost') {
                title = 'You failed to break the code!'
                text = "Here's the solution:"
                button = 'Try again'
            }

            $('.results__title').text(title)
            $('.results__text').text(text)
            $('.results__button').text(button)
            $('.results__dot').each(function(index) {
                $(this).attr('data-color', sequence[index])
            })
            $('.results').removeClass('hidden')

            $([document.documentElement, document.body]).animate({
                scrollTop: $(".results").offset().top
            }, 1000)

            colorSelector.forEach(color => {
                color.removeEventListener('click', insertGuess)
                color.classList.add('deactivated')
            })

            $('.game-buttons__delete').off('click', deleteGuess).addClass('deactivated')
            $('.game-buttons__reset').off('click', resetGuess).addClass('deactivated')
            $('.game-buttons__random').off('click', randomizeGuess).addClass('deactivated')

        }

        const activateSubmitButton = () => {
            colorSelector.forEach(color => {
                color.removeEventListener('click', insertGuess)
                color.classList.add('deactivated')
            })

            submitButton.classList.remove('deactivated')
            submitButton.addEventListener('click', submitGuess)
        }

        const deactivateSubmitButton = () => {
            colorSelector.forEach(color => {
                color.addEventListener('click', insertGuess)
                color.classList.remove('deactivated')
            })

            submitButton.classList.add('deactivated')
            submitButton.removeEventListener('click', submitGuess)
        }

        deactivateSubmitButton()
    }

    $('.start-button').on('click', startGame)
    handleWelcomeScreen()
})