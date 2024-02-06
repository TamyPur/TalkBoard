import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { NewForum } from './components/NewForum.tsx';
import { Home } from './components/Home'
import { Forum } from './components/Forum.tsx';
import { ForumList } from './components/ForumList.tsx';
import { Profile } from './components/Profile.tsx';
import { SetForum } from './components/SetForum.tsx';
import { Account } from './components/Account.tsx';
import { CustomersList } from './components/CustomersList.tsx';
import { applyMiddleware, createStore, Store } from 'redux';
import { DispatchType, UserAction, UserState } from './type';
import reducer from './store/reducer.ts';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Management } from './components/Management.tsx';
import { ForumManagement } from './components/ForumManagement.tsx';
import { UserManagement } from './components/UserManagement.tsx';
import { CategoryManegment } from './components/CategoryManegment.tsx';
import { CustomerManagement } from './components/CustomerManagement.tsx';
import { UpdatePassword } from './components/UpdatePassword.tsx';


const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/homePage',
    Component: Home,
    children: [
      {
        path: 'forumList',
        Component: ForumList,
      },
      {
        path: 'forum/:forumId/:userId',
        Component: Forum,
      },
      {
        path: 'newForum',
        Component: NewForum,
      },
      {
        path: 'profile',
        Component: Profile,
      },
      {
        path: 'setForum/:forumId/:userId',
        Component: SetForum,
      },
      {
        path: 'customersList',
        Component: CustomersList,
      },
      {
        path: 'account',
        Component: Account,
      },
      {
        path: 'management',
        Component: Management,
        children: [
          {
            path: 'forumManagement',
            Component: ForumManagement,
          },
          {
            path: 'userManagement',
            Component: UserManagement,
          },
          {
            path: 'categoryManegment',
            Component: CategoryManegment,
          },
          {
            path: 'customerManagement',
            Component: CustomerManagement,
          },
        ]
      },
      {
        path:'updatePassword',
        Component: UpdatePassword,
      }
    ]
  }
])

const store: Store<UserState, UserAction> & {
  dispatch: DispatchType
} = createStore(reducer, applyMiddleware(thunk))




ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
)
