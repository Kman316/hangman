import React, { Component } from 'react';
import Word from './Word';
import GameKeyboard from './GameKeyboard';
import swal from 'sweetalert';
import fire from "./config/firebase";


class GameBoard extends Component {
    constructor(props) {
        super(props);


        this.state = {
            words: [...this.props.words], score: 0, gamesPlayed: 0, lives: this.props.lives,currWordIndex: 0, guessedLetters: "",
            remainingLettersInCurrWord: this.props.words[0].split(''), showGreatJob: false
        };
    }

    isLetterInWord = (letter, word) => {
        let regex = new RegExp("[" + word.toUpperCase() + "]");
        return regex.test(letter.toUpperCase());
    };


    logout(){
        fire.auth().signOut()
    }

    increment(){
        this.setState({ gamesPlayed: this.state.gamesPlayed })
    }

    saveScore(){

        const userId = fire.auth().currentUser.uid;


        fire.database().ref('users/' + userId).update({
            score: this.state.score,
            gamesPlayed: this.state.gamesPlayed
        });
    }

    moveToNextWord = () => {
        if (!this.state.remainingLettersInCurrWord.length) { // user guessed the word
            if (this.state.currWordIndex < this.state.words.length - 1) { // there are still words to guess in the list
                this.setState({showGreatJob: true});
                setTimeout(() => {
                    this.setState(prevState => ({
                        currWordIndex: prevState.currWordIndex + 1, guessedLetters: "",
                        remainingLettersInCurrWord: prevState.words[prevState.currWordIndex + 1].split(''),
                        lives: this.props.lives, showGreatJob: false
                    }));
                }, 2500);
            } else { // user guessed all the words in the list
                setTimeout(() => {
                    swal({
                        title: `You Won!`,
                        text: `Your score is: ${this.state.score}`,
                        text1: `${this.state.gamesPlayed++}`,
                        icon: `success`,
                        buttons: {
                            logout: {
                                buttonText: "Logout"
                            },
                            play_again: `Play Again!`,
                        },
                    }).then((value) => {
                        switch (value) {
                            case "logout":
                                swal(this.logout());
                                break;

                            case "play_again":
                                swal(this.props.restartGame());
                                swal(this.increment());
                                break;
                        }
                    });
                    this.saveScore();
                    this.props.restartGame();
                }, 1000);
            }
        }
    };

    gameOver = () => {
        if (this.state.lives === 0) {
            setTimeout(() => {
                swal({
                    title: `You Lose`,
                    text: `Your score is: ${this.state.score}`,
                    text1: `${this.state.gamesPlayed++}`,
                    icon: `error`,
                    buttons: {
                        logout: {
                            buttonText: "Logout"
                        },
                        play_again: `Play Again!`,
                    },
                }).then((value) => {
                    switch (value) {
                        case "logout":
                            swal(this.logout());
                            break;

                        case "play_again":
                            swal(this.props.restartGame());
                            swal(this.increment());
                            break;
                    }
                });
                this.saveScore();
                this.props.restartGame();
            }, 1000);
        }
    };

    guessLetter = (letter) => {
        if (this.isLetterInWord(letter, this.state.words[this.state.currWordIndex])) { // correct guess
            this.setState(prevState => ({
                score: prevState.score + 10, guessedLetters: prevState.guessedLetters + letter,
                remainingLettersInCurrWord: prevState.remainingLettersInCurrWord.filter(element =>
                    element.toUpperCase() !== letter.toUpperCase())
            }),
                this.moveToNextWord);
        } else { // wrong guess
            let score = this.state.score;
            if (score - 5 > 0) {
                score -= 5;
            } else {
                score = 0;
            }
            this.setState(prevState => ({
                lives: prevState.lives - 1, guessedLetters: prevState.guessedLetters + letter,

                score: score
            }), this.gameOver);
        }
    };

    onHandleKeyPress = (event) => {
        let letter = event.key;
        if (/^[A-Za-z]$/.test(letter) && !this.state.guessedLetters.includes(letter)) {
            this.guessLetter(letter);
        }
    };


    restartGame = () => {
        this.increment();
    };

    componentDidMount() {
        this.setState({
            words: [...this.props.words], score: 0,  gamesPlayed: this.state.gamesPlayed ,lives: this.props.lives ,currWordIndex: 0, guessedLetters: "",
            remainingLettersInCurrWord: this.props.words[0].split(''), showGreatJob: false
        });
        document.addEventListener("keypress", this.onHandleKeyPress);

        const userId = fire.auth().currentUser.uid;
        this.databaseScore = fire.database().ref('users/' + userId).child('score');
        this.databaseGamesPlayed = fire.database().ref('users/' + userId).child('gamesPlayed');

        this.databaseScore.on('value', snap => {
            this.setState({
                    score: snap.val()
            });
        });


        this.databaseGamesPlayed.on('value', snap => {
            this.setState({
                gamesPlayed: snap.val()
            });
        });

    }

    componentWillUnmount() {
        document.removeEventListener("keypress", this.onHandleKeyPress);
    }

    render() {
        let word = this.state.words[this.state.currWordIndex];
        let image = `/assets/hangman${this.state.lives}.png`;
        return (
            <div>
                <div className="Score">Score: {this.state.score}, Lives: {this.state.lives}, Games Played: {this.state.gamesPlayed} ,
                    Words left: {this.state.words.length - this.state.currWordIndex}</div>
                <Word word={word} guessedLetters={this.state.guessedLetters}
                    isLetterInWord={this.isLetterInWord} showGreatJob={this.state.showGreatJob} />
                <GameKeyboard guessLetter={this.guessLetter} guessedLetters={this.state.guessedLetters}
                    isLetterInWord={this.isLetterInWord} word={word} />
                {this.state.lives < 10 ?
                <div className="Tooltip">
                    <img className="Man" src={process.env.PUBLIC_URL + image} alt="hangman-drawing" />
                </div>
                : null}
            </div>
        );
    }
}

export default GameBoard;