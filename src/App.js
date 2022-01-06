import { useEffect, useState } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

function App() {
  const [manager, setManager] = useState();
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  const setState = async () => {
    const getManager = await lottery.methods.manager().call();
    const getPlayers = await lottery.methods.getPlayers().call();
    const getBalance = await web3.eth.getBalance(lottery.options.address);

    setManager(getManager);
    setPlayers(getPlayers);
    setBalance(getBalance);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setMessage('Waiting on transaction success...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });

    setMessage('You have been entered!');
    setValue('');
    setState();
  };

  const onClick = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage('A winner has been picked!');
    setState();
  };

  useEffect(() => {
    setState();
  }, []);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager || 'Loading...'}. There are
        currently {players.length} people entered, competing to win{' '}
        {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            type="number"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button type="submit">Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
