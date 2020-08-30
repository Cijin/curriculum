import React, { useState, useEffect } from 'react';
import sendQuery from './sendQuery';

function Classroom(props) {
  const [user, setUser] = useState({
    name: '',
    image: '',
    lessons: [],
  });
  const [unenrolled, setUnenrolled] = useState([]);

  useEffect(() => {
    sendQuery(
      `{ user { name, image, lessons { title } } lessons { title } }`
    ).then(
      (data) => {
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser({});
        }
        setUnenrolled(data.lessons);
      },
      [user, unenrolled]
    );
  });

  return (
    <div>
      <h1>{user.name}</h1>
      <img src={user.image} />
    </div>
  );
}

export default Classroom;
