[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://stenciljs.com)

# `@stencil-community/web-types-output-target` Example Project

This project demonstrates the usage of the `@stencil-community/web-types-output-target` output target to get Intellisense in HTML and Vue files.

## Set Up

To set up this project, you must either first build the output target from source, or override this project's dependency on `@stencil-community/web-types-output-target` with a version published to the NPM registry.
Both allow you to take the output target for a 'test drive' - however, the former will allow you to try out any unreleased functionality.

After setting up the dependencies, continue to the next section.

### Building from Source

See the [instructions in the CONTRIBUTING guide](https://github.com/stencil-community/stencil-web-types/blob/main/CONTRIBUTING.md#setup) to build from source.

### Overriding the Local Dependency

If you don't want to build the output target from source, run the following from this directory to install it from the NPM registry:
```bash
$ npm uninstall @stencil-community/web-types-output-target
$ npm install --save-dev @stencil-community/web-types-output-target
```

## Inspecting Types

To inspect the types of the components in this project, one must first build the project.
This generates a `web-types.json` file, which JetBrains IDEs use to pick up metadata about the project's components.
To build the project, run the following from this directory:

```bash
$ npm run build
```

Upon build, open the [example index.html file](./src/index.html) or [example Vue file](./src/example.vue) in your JetBrains IDE.
Hover over components to see how JSDoc descriptions, deprecation tags, default and required values, etc. are now populated in the editor.
