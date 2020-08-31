import React, { useState } from 'react';
//import Star from 'stars';
import sendQuery from './sendQuery';

function Lessons({ enrolledObj, lessons }) {
  const enrolled = enrolledObj.map((lesson) => lesson.title);
  const [enrolledLessons, setEnrolledLessons] = useState(enrolled);

  const unenrolled = lessons.filter((lesson) => {
    return !enrolledLessons.includes(lesson.title);
  });

  const unenrolledComponent = unenrolled.map((lesson, idx) => {
    const enroll = () => {
      sendQuery(`
        mutation { enroll (title: "${lesson.title}") { name } }
      `).then(() => {
        setEnrolledLessons([...enrolledLessons, lesson.title]);
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
        mutation { enroll (title: "${lesson}") { name } }
      `).then(() => {
        const newLessons = [...enrolledLessons];
        newLessons.splice(idx, 1);
        setEnrolledLessons(newLessons);
      });
    };

    return (
      <h3 key={idx} onClick={unenroll}>
        {lesson}
      </h3>
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
