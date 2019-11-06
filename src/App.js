import React, { useState, useEffect } from 'react';
import { getIndexOf, startItems } from './helpers';
import './App.scss';

function App() {

  const [itemsLen, setItemsLen] = useState(4);
  const [fullMap, setFullMap] = useState([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]]);
  const [items, setItems] = useState(startItems(fullMap, itemsLen));
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerStatus, setTimerStatus] = useState(false);
  const [winner, setWinner] = useState(false);
  const [activetItem, setActivetItem] = useState('');
  const [activetItemAni, setActivetItemAni] = useState('');


  const startGame = (evt) => {

    setTimer(0);
    setMoves(0);
    setTimerStatus(false);
    setWinner(false);

    let nowItems;
    switch (evt.target.value) {
      case '3':
        nowItems = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
        break;

      case '4':
        nowItems = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
        break;

      default:
        nowItems = [[1, 2], [3, 0]];
    }
    setItemsLen(evt.target.value);
    setFullMap(nowItems);
    setItems(startItems(nowItems, evt.target.value));
  }

  const startTimer = () => {
    setTimerStatus(true);
  }

  const resetTimer = () => {
    setTimerStatus(false);
  }

  useEffect(() => {
    let interval = null;
    if (timerStatus) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!timerStatus && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerStatus, timer]);

  const handleClick = (evt, idx1, idx2, itemValue) => {

    itemValue !== 0 && startTimer();

    let oldItems = [...items];
    const homeLen = oldItems.length - 1;

    const emptyHome = getIndexOf(oldItems, 0);
    const emptyHomeValue = oldItems[emptyHome[0]][emptyHome[1]];

    const upHome = (idx1 - 1 >= 0 && idx1 - 1 <= homeLen) ? oldItems[idx1 - 1][idx2] : undefined;
    const rightHome = (idx2 + 1 >= 0 && idx2 + 1 <= homeLen) ? oldItems[idx1][idx2 + 1] : undefined;
    const downHome = (idx1 + 1 >= 0 && idx1 + 1 <= homeLen) ? oldItems[idx1 + 1][idx2] : undefined;
    const leftHome = (idx2 - 1 >= 0 && idx2 - 1 <= homeLen) ? oldItems[idx1][idx2 - 1] : undefined;

    if (upHome !== 'undefined' && upHome === emptyHomeValue) {
      oldItems[idx1 - 1][idx2] = oldItems[idx1][idx2];
      oldItems[idx1][idx2] = 0;
      setMoves(moves + 1);
      setActivetItem(itemValue);
      setActivetItemAni('slideInUp');
    }
    if (rightHome !== 'undefined' && rightHome === emptyHomeValue) {
      oldItems[idx1][idx2 + 1] = oldItems[idx1][idx2];
      oldItems[idx1][idx2] = 0;
      setMoves(moves + 1);
      setActivetItem(itemValue);
      setActivetItemAni('slideInLeft');
    }
    if (downHome !== 'undefined' && downHome === emptyHomeValue) {
      oldItems[idx1 + 1][idx2] = oldItems[idx1][idx2];
      oldItems[idx1][idx2] = 0;
      setMoves(moves + 1);
      setActivetItem(itemValue);
      setActivetItemAni('slideInDown');
    }
    if (leftHome !== 'undefined' && leftHome === emptyHomeValue) {
      oldItems[idx1][idx2 - 1] = oldItems[idx1][idx2];
      oldItems[idx1][idx2] = 0;
      setMoves(moves + 1);
      setActivetItem(itemValue);
      setActivetItemAni('slideInRight');
    }

    if (JSON.stringify(fullMap) === JSON.stringify(items)) {
      setWinner(true);
      resetTimer();
    }

    setItems(oldItems);
  }

  return (
    <div className="App" >
      <div className="game-actions">
        <button value="2" onClick={startGame} className="start-game">2 x 2</button>
        <button value="3" onClick={startGame} className="start-game">3 x 3</button>
        <button value="4" onClick={startGame} className="start-game">4 x 4</button>
      </div>
      <nav className="game-bar">
        <div className="moves"><span>Moves</span> {moves}</div>
        {winner && <h1>You Won</h1>}
        <div className="time"><span>Time(sec)</span> {`${timer}`}</div>
      </nav>
      <div className={`game game${itemsLen}`}>

        {
          items.map((item1, idx1) => item1.map((item2, idx2) =>
            <div key={`${idx1}-${idx2}`} className="home">
              {<div onClick={(evt) => handleClick(evt, idx1, idx2, item2)} className={`ball ${item2 === activetItem && `animated ${activetItemAni} `} ${winner ? 'disable-ball' : ''} ${(item2 === fullMap[idx1][idx2] && item2 !== 0) ? 'correct-ball' : ''} ${item2 === 0 ? 'no-ball' : ''}`}>{item2 !== 0 && item2}</div>}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
