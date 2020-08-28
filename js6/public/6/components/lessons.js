import React from 'react';

function Lessons(props) {
  const handleClick = (e) => {
    props.handleClick(e.innerHTML);
  };

  const lessons = props.lessons.map((lesson) => {
    return (
      <h3>
        {' '}
        onClick={handleClick}>{lesson}>
      </h3>
    );
  });

  return <div>{lessons}</div>;
}

export default Lessons;
