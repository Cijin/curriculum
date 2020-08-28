import React from 'react';
import Star from 'stars';
import sendQuery from './sendQuery';

function Lessons(props) {
  const handleClick = (e) => {
    props.handleClick(e.innerHTML);
  };

  const lessons = props.lessons.map((lesson, idx) => {
    const updateRating = () => {
      sendQuery(
        `mutation{setRating(title: "${lesson.title}", rating: "${
          idx + 1
        }"){lessons{title, rating}}}`
      );
    };

    return (
      <div key={idx}>
        <h3 onClick={handleClick}>{lesson.title}</h3>
        props.rating &&
        <Star value={lesson.rating} onClick={updateRating}></Star>
      </div>
    );
  });

  return <div>{lessons}</div>;
}

export default Lessons;
