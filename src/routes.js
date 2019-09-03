import { createAppContainer, createStackNavigator } from 'react-navigation';
import Main from './pages/Main';
import User from './pages/User';
import Details from './pages/Details';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
      Details,
    },
    {
      headerLayoutPreset: 'center',
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#7159c1',
        },
        headerTintColor: '#FFF',
      },
    }
  )
);

export default Routes;
