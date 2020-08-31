import React, { useState } from 'react';
import Stars from './stars';
import sendQuery from './sendQuery';

function Lessons({ enrolledObj, lessons }) {
  const [enrolledLessons, setEnrolledLessons] = useState(enrolledObj);

  const enrolledArray = enrolledLessons.map((lesson) => lesson.title);
  const unenrolled = lessons.filter((lesson) => {
    return !enrolledArray.includes(lesson.title);
  });

  const unenrolledComponent = unenrolled.map((lesson, idx) => {
    const enroll = () => {
      sendQuery(`
        mutation { enroll (title: "${lesson.title}") { name } }
      `).then(() => {
        setEnrolledLessons([...enrolledLessons, { title: lesson.title }]);
      });
    };

    return (
      <h3 key={idx} onClick={enroll}>
        {lesson.title}
      </h3>
    );
  });

  const enrolledComponent = enrolledLessons.map((lesson, idx) => {
    const unenroll = () => {
      sendQuery(`
        mutation { unenroll (title: "${lesson.title}") { name } }
      `).then(() => {
        const newLessons = [...enrolledLessons];
        newLessons.splice(idx, 1);
        setEnrolledLessons(newLessons);
      });
    };

    return (
      <div key={idx}>
        <h3 onClick={unenroll}>{lesson.title}</h3>
        <Stars value={lesson.rating} title={lesson.title}></Stars>
      </div>
    );
  });

  return (
    <div className="lessons">
      <div>
        <h1>Enrolled Lessons</h1>
        {enrolledComponent}
      </div>
      <div>
        <h1>Unenrolled Lessons</h1>
        {unenrolledComponent}
      </div>
    </div>
  );
}

export default Lessons;
