import React, { useState } from 'react';
import sendQuery from './sendQuery';

function Classroom(props) {
  const [user, setUser] = useState({
    name: '',
    image: '',
    lessons: [],
  });
  const [unenrolled, setUnenrolled] = useState([]);

  sendQuery(
    `{ user { name, image, lessons { title } } lessons { title } }`
  ).then((data) => {
    setUser({
      name: data.user.name,
      image: data.user.image,
      lessons: data.user.lessons,
    });
    setUnenrolled(data.lessons);
  });
}

export default Classroom;
