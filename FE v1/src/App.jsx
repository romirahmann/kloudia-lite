/* eslint-disable no-unused-vars */

import { ApiUrl, resolvedBaseUrl } from "./components/context/urlApi";
import { UserView } from "./components/UserView";

function App() {
  return (
    <>
      <ApiUrl.Provider value={`${resolvedBaseUrl}`}>
        <UserView />
      </ApiUrl.Provider>
    </>
  );
}

export default App;
