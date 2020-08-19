import { useState } from 'react';

function Stars() {
  const [value, setValue] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const stars = [1, 2, 3, 4, 5].map((star, idx) => {
    const mouseMove = () => {
      if (isLocked) {
        return;
      }
      setValue(star);
    };

    let classVal = 'far';
    if(star <= value) {
      classVal = 'fas';
    }

    const onClick = () => {
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
  let message = `You are giving ${value} stars`;
  if (isLocked) {
    message = `You have given ${value} stars`;
  }
  const divMouseEnter = () => {
    setIsLocked(false);
  }

  return (
      <div onMouseEnter={divMouseEnter}>
        {stars}
        <p>{message}</p>
      </div>
  )
};

export default Stars;