import React, { useState } from 'react';
import sendQuery from './sendQuery';

function Stars(props) {
  const [value, setValue] = useState(props.value || 0);
  const [isLocked, setIsLocked] = useState(false);

  const stars = [1, 2, 3, 4, 5].map((star, idx) => {
    const mouseMove = () => {
      if (isLocked) {
        return;
      }
      setValue(star);
    };

    let classVal = 'far';
    if (star <= value) {
      classVal = 'fas';
    }

    const onClick = () => {
      setIsLocked(true);
      setValue(star);
      sendQuery(`
        mutation { setRating (title: "${props.title}", rating: ${
        idx + 1
      }) { name } }
        `);
    };

    return (
      <i
        className={`${classVal} fa-star`}
        key={idx}
        onClick={onClick}
        onMouseMove={mouseMove}
      />
    );
  });

  const divMouseEnter = () => {
    setIsLocked(false);
  };

  return <div onMouseEnter={divMouseEnter}>{stars}</div>;
}

export default Stars;
