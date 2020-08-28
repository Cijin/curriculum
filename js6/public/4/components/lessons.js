import React from 'react';

function Lessons (props) {
  const handleClick = (e) => {
    props.handleClick(e.innerHTML); 
  };
  
  return (
    <div>
      {
        props.lessons.map((lesson) => {
          return <h3 onClick={handleClick}>
            {lesson}
          </h3>
      })
      }
    </div>
  )
};

export default Lessons;
