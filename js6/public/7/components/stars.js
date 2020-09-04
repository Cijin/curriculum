import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import Mutations from './gql-mutations';

function Stars(props) {
  const [value, setValue] = useState(props.value || 0);
  const [isLocked, setIsLocked] = useState(false);
  const [setRating, { data }] = useMutation(Mutations.SET_RATING);

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
      setRating({ variables: { title: props.title, rating: star } });
      setIsLocked(true);
      setValue(star);
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
