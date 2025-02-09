import {
  ChatPage,
  Error,
  LoginPage,
  NavigationPage,
  Profile,
  RegistrationPage,
} from "../pages";

export const routes: Record<string, any> = {
  "/": NavigationPage,
  "/chats": ChatPage,
  "/profile": Profile,
  "/login": LoginPage,
  "/registration": RegistrationPage,
  "*": Error,
};
