import { Navigate } from "react-router-dom";
import Display from "../components/Chat/display";
import Login from "../components/Login/login";
import { CircularProgress } from "@mui/material";

export default [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/display',
    element: <Display />,
  },
  {
    path: '/progress',
    element: <CircularProgress />,
  },
  {
    path: '/',
    element: <Navigate to="/login" />,
  }
]