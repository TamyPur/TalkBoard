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


const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
{
  path:'/homePage',
  Component: Home,
  children:[
    {
      path:'forumList',
      Component: ForumList,
    },
    {
      path:'forum/:forumId/:userId',
      Component: Forum,
    },
    {
      path:'newForum',
      Component: NewForum,
    },
    {
      path:'profile',
      Component: Profile,
    },
    {
      path:'setForum/:forumId',
      Component: SetForum,
    }
  ]
} 
])




ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
