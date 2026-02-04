import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/Auth/AuthLayout.tsx", [
    index("routes/Root/HomePage.tsx"),
    route("sign-in", "routes/Auth/SignIn.tsx"),
    route("sign-up", "routes/Auth/SignUp.tsx"),
    route("forgot-password", "routes/Auth/ForgotPassword.tsx"),
    route("reset-password", "routes/Auth/ResetPassword.tsx"),
    route("verify-email", "routes/Auth/VerifyEmail.tsx"),
  ]),
] satisfies RouteConfig;
