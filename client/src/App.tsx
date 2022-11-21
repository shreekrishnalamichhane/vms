import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";

import MainLayout from "./views/layouts/MainLayout";

import SignIn from "./pages/auth/signin";
import SignUp from "./pages/auth/signup";
import Page404 from "./views/pages/404";
import VaccineCreate from "./pages/vaccine/create";
import VaccineUpdate from "./pages/vaccine/edit";
import VaccineIndex from "./pages/vaccine/index";
import VaccineShow from "./pages/vaccine/show";
import Profile from "./pages/auth/profile";
import { useMeQuery } from "./api/authQuery";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { resetUser, setToken, setUser } from "./redux/authSlice";

// import { useAppDispatch, useAppSelector } from "./redux/hooks";

function App() {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useMeQuery(null)

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(data)
    if (isSuccess && data) dispatch(setUser(data.data))
    else if (isError) dispatch(resetUser())
  }, [isSuccess, isError, data])

  return (
    <BrowserRouter>
      <MainLayout>
        <Router />
      </MainLayout>
    </BrowserRouter>
  )
}

function Router() {
  return (
    <Routes>
      <Route element={<GuestRoutes />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
      <Route element={<AuthRoutes />}>
        <Route path="me" element={<Profile />} />
        <Route path="" element={<VaccineIndex />} />
        <Route path="create" element={<VaccineCreate />} />
        <Route path="vaccine/:vaccine_id" element={<VaccineUpdate />} />
        <Route path="vaccine/show/:vaccine_id" element={<VaccineShow />} />
      </Route>

      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

function AuthRoutes() {
  const location = useLocation();
  const { isAuth } = useAppSelector((state) => state.authReducer);

  if (!isAuth) {
    return (
      <Navigate
        replace
        to="/signin"
        state={{
          from: location,
        }}
      />
    );
  }
  return <Outlet />;
}

function GuestRoutes() {
  const location = useLocation();
  const { isAuth } = useAppSelector((state) => state.authReducer);

  if (!isAuth) return <Outlet />;
  return (
    <Navigate
      replace
      to={location.state?.from || "/"}
      state={{
        from: location,
      }}
    />
  );
}

export default App
