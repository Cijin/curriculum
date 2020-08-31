import React, { useState, useEffect } from 'react';
import sendQuery from './sendQuery';
import Lessons from './lessons';

function Classroom(props) {
  const [user, setUser] = useState({
    name: '',
    image: '',
    lessons: [],
  });
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    sendQuery(
      `{ user { name, image, lessons { title } } lessons { title } }`
    ).then((data) => {
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser({});
      }
      setLessons(data.lessons);
    });
  }, []);

  return (
    <div>
      <h1>{user.name}</h1>
      <img src={user.image} />
      <div>
        <Lessons enrolledObj={user.lessons} lessons={lessons} />
      </div>
    </div>
  );
}

export default Classroom;
