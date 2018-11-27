import React, { Component } from 'react';
import './App.css';
import GameBoard from './GameBoard';
import gameData from './Data';
import fire from './config/firebase';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {categories: gameData, chosenCategory: "", chosenWords : [], numOfChosenWords: 5, lives: 10, currentUser: null};
        this.logout = this.logout.bind(this);
    }

    logout(){
        fire.auth().signOut()
    }

    numOfGames(){
        const userId = fire.auth().currentUser.uid;
        let messagesRef = fire.database().ref('users/' + userId);

        messagesRef.on('gamesPlayed', snapshot => {
            let message = { gamesPlayed: snapshot.val() };
            this.setState({
                gamesPlayed: [...this.state.gamesPlayed, message],
            });
        })
    }

    chooseWordsForGame = (words) => {
        let wordsForGame = [];
        for (let i = 0; i < this.state.numOfChosenWords; i++) {
            let randomNum = Math.floor(Math.random() * (words.length));
            wordsForGame.push(words.splice(randomNum, 1)[0]);
        }
        return wordsForGame;
    };

    startGame = (event) => {
        let words = this.state.categories.filter(element => element.category === event.target.value)[0].words;
        let chosenWords = this.chooseWordsForGame(words);
        this.setState({chosenCategory: event.target.value, chosenWords: chosenWords});
    };

    restartGame = () => {
        this.setState({chosenCategory: "", chosenWords : []});
    };

    render() {
        return (
            <div className="App">
                <h1 className="App-header">HANGMAN</h1>
                <button onClick={this.logout}>Logout</button>
                {(this.state.chosenCategory === "") ?
                    (<div>
                        <div className="Category">Choose a category:</div>
                        {this.state.categories.map((element, index) => <button type="button" key={index} value={element.category}
                                                                               onClick={this.startGame}> {element.category} </button>)}
                        <div className="Category">You'll have {this.state.numOfChosenWords} words in each category,
                            and {this.state.lives} lives to guess each word. You lose the game when you lose all of your lives and when the man is hung!  <br/></div>
                    </div>) :
                    (<div>
                        <div className="Category">Category chosen: {this.state.chosenCategory}</div>
                        <GameBoard words={this.state.chosenWords} lives={this.state.lives} restartGame={this.restartGame}/>
                    </div>)}
            </div>
        );
    }
}

export default Homepage;