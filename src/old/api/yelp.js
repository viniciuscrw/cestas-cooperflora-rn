import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.yelp.com/v3/businesses',
  headers: {
    Authorization:
      'Bearer PhdKswAR_TvxgUkzvRv3FHJ45kT1mLIO9pVilksgyyL2Hqnwv9ew4vKM4WOgKOfeQ4F-Z8QbSLsc-IosdlijjMfntZi7HqWEzPUV7i7xGAgFAPXO4R5vKZZ-kq7eXnYx',
  },
});
