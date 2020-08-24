import React, { useState } from 'react';
import sendQuery from './sendQuery';

function Classroom () {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [unenrolled, setUnenrolled] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  sendQuery(`{
    user {name, image, lessons {title}},
    lessons {title}
  }`).then((result) => {
    console.log(result);
    setName(result.user.name);
    setImage(result.user.image);
    setEnrolled(result.user.lessons);
    setUnenrolled(result.lessons);
  });

  return(
    <div>
      <h1>{name}</h1>
      <img src={image}></img>
    </div>
      )
};

export default Classroom;
