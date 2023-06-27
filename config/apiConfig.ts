import calculator from './api/calculator';
import users from './api/users';
import news from './api/news';
import claim from './api/claim';

const apiConfig = {
  ...calculator,
  ...users,
  ...news,
  ...claim,
};

export default apiConfig;
