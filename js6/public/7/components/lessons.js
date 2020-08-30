import React from 'react';
import Star from 'stars';
import sendQuery from './sendQuery';

function Lessons(props) {
  const lessons = props.lessons.map((lesson, idx) => {
    const handleClick = () => {
      props.handleClick(lesson);
    };

    return (
      <h3 key={idx} onClick={}>
        {lesson}
      </h3>
    );
  });

  return <div>{lessons}</div>;
}

export default Lessons;
