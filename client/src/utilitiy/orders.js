import axios from 'axios';

const postNewTrade = (entry) => {
  axios.post('/api/newtrade', entry).then((response) => {
    console.log(response, 'data succesfully posted!!');
  })
    .catch((e) => {
      console.log(e, 'error with this request!!');
    });
};

export default postNewTrade;
