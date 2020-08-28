import React, { useState } from 'react';
import sendQuery from './sendQuery';
import Lessons from './lessons';

function Classroom() {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [unenrolled, setUnenrolled] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  sendQuery(
    `{ user{name, image, lessons{title}}, lessons{title, rating} }`
  ).then((result) => {
    setName(result.user.name);
    setImage(result.user.image);
    setEnrolled(result.user.lessons);
    setUnenrolled(result.lessons);
  });

  const handleEnroll = (title) => {
    sendQuery(`mutation{unenroll(title: "${title}")}`).then((data) => {
      setEnrolled(enrolled.filter((lesson) => lesson !== title));
      setUnenrolled(title, ...unenrolled);
    });
  };

  const handleUnenroll = (title) => {
    sendQuery(`mutation {enroll {title: "${title}"}}`).then((data) => {
      setUnenrolled(unenrolled.filter((lesson) => lesson !== title));
      setEnrolled(...enrolled, title);
    });
  };

  return (
    <div>
      <div>
        <h1>{name}</h1>
        <img src={image}></img>
      </div>
      <Lesson lessons={enrolled} handleClick={handleEnroll} />
      <Lesson lessons={unenrolled} handleClick={handleUnenroll} />
    </div>
  );
}

export default Classroom;
