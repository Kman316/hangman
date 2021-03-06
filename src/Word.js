import React, { Component } from 'react';
import Letter from './Letter';
import youWon from './img/youwon.png';

class Word extends Component {
    render() {
        return(
            <div className="Word">
                {this.props.word.split('').map((element, index) => {
                    let letter = element.toUpperCase();
                    return this.props.isLetterInWord(letter, this.props.guessedLetters) ? 
                        <Letter key={index} letter={letter} inKeyBoard={false} className="Word-letter"/> : 
                        <Letter key={index} letter="_" inKeyBoard={false} className="Word-letter"/>})}
                {this.props.showGreatJob ? <img className="Great-job" src={youWon} alt="great job"/> : null}
            </div>
        );
    }
}

export default Word;