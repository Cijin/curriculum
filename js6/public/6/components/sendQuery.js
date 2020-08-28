const sendQuery = (query) => {
  return fetch("https://js5.c0d3.com/js6c2/graphql", {
        method: "POST",
    headers: {
            "content-type": "application/json"
          
    },
    body: JSON.stringify({
            operationName: null,
            variables: {},
            query
          
    }),
      
  }).then(r => r.json()).then(r => r.data)
  
};
export default sendQuery;
