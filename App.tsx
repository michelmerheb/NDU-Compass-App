import "./gesture-handler";
import Navigationcontainer from "./src/navigations/NavigationContainer";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <Navigationcontainer />
    </Provider>
  );
}
