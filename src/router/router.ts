
import { Route } from "../config/route";
import { Component } from "../services/component";

export default class Router {
    routes: any;
    history: any;
    private _currentRoute: any;
    static __instance: any | null;
    private _rootQuery: any;
    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = [];
        this.history = window.history;
        this._currentRoute = null;
        this._rootQuery = rootQuery;

        Router.__instance = this;
    }

    use(pathname: string, block: Component) {
        const route = new Route(pathname, block, {rootQuery: this._rootQuery});
        this.routes.push(route);
      // Возврат this — основа паттерна "Builder" («Строитель»)
        return this;
    }

    start() {
      window.onpopstate = (event: PopStateEvent) => {
        if (event && event !== null) {
          this._onRoute((event.currentTarget as Window).location.pathname);
        }
      };
  
      this._onRoute(window.location.pathname);
    }

    _onRoute(pathname: string) {
        const route = this.getRoute(pathname);

        if (this._currentRoute) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route.render(route, pathname);
    }

    go(pathname: string) {
      window.history.pushState({}, "", pathname)
      this._onRoute(pathname);
    }

    back() {
      window.history.back()
    }

    forward() {
      window.history.forward();
    }

    getRoute(pathname: string) {
        return this.routes.find((route: string) => route.match(pathname));
    }
  }
