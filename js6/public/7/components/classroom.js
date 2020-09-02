import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import sendQuery from './sendQuery';
import Lessons from './lessons';
import Queries from './gql-queries';

function Classroom(props) {
  const { loading, error, data } = useQuery(Queries.GET_USER);

  return (
    <div>
      {data && data.user && data.lessons && (
        <div>
          <h1>{data.user.name}</h1>
          <img src={data.user.image} />
          <div>
            <Lessons enrolledObj={data.user.lessons} lessons={data.lessons} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Classroom;
