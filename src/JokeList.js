import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Joke from './Joke';
import "./JokeList.css";

const JokeList = ({ numJokesToGet = 5 }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getJokes = useCallback(async () => {
    try {
      let jokesTemp = [];
      let seenJokes = new Set();

      while (jokesTemp.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let joke = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokesTemp.push({ id: joke.id, joke: joke.joke, votes: 0 });
        }
      }

      setJokes(jokesTemp);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false); // Ensure loading state is reset on error
    }
  }, [numJokesToGet]); // Dependencies for useCallback

  useEffect(() => {
    getJokes();
  }, [getJokes]); // Dependency array for useEffect

  const vote = useCallback((id, delta) => {
    setJokes(jokes =>
      jokes.map(joke =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      )
    );
  }, []);

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={getJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map(joke => (
        <Joke key={joke.id} id={joke.id} text={joke.joke} votes={joke.votes} vote={vote} />
      ))}
    </div>
  );
};

export default JokeList;
