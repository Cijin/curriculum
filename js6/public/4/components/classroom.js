import React, { useState  } from 'react';
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
    
  const handleEnroll = (e) => {
        const title = e.innerHTML;
    sendQuery(`mutation{
          unenroll{title: "${title}"}
                
          }`).then(data => {
                   setEnrolled(enrolled.filter(lesson) => lesson !== title);
                   setUnenrolled(title, ...unenrolled);
                
          });
    
  };
  const handleUnenroll = (e) => {
    const title = e.innerHTML;
    sendQuery(`mutation {
    enroll {title: "${title}"}
    
    }`).then((data) => {
        setUnenrolled(unenrolled.filter(lesson) => lesson !== title);
        setEnrolled(...enrolled, title);
    })
  }
  return(
      <div>
       <div>
         <h1>{name}</h1>
         <img src={image}></img>
       </div>
       <div>
        <h1>Enrolled Lessons</h1>    
        {
         enrolled.map((lesson) => {
           return <h3 onClick={handleEnroll>{lesson}</h3> 
         });
        }
      </div>
      <div>
       <h1>Unenrolled Lessons</h1>
       {
          unenrolled.map((lesson) => {
            return <h3 onClick={handleUnenroll}>{lesson}</h3>
            })
       }
       </div>
     </div>
    )
};

export default Classroom;
