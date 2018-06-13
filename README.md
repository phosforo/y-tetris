# Y-Tetris

Started with Pixi boilerplate using Webpack and Babel. Partially based off [Lapixx/pixi-babel](https://github.com/Lapixx/pixi-babel.git)

The game starts automatically with an empty scene and a block that starts to drop

Use the arrows keys to execute block actions:
* left / right arrow to move correspondingly
* up arrow to rotate
* down arrow to force drop
* g key to show background helper grid

YTetris main entities:

* keyboard manager, responsible for registering the keys and execute key callbacks
* sound manager, responsible for registering the sound and execute sound callbacks 
* game area, responsible for the game logic 
* game manager class. mediator between the key manager, the sound manager, and game area
* collision resolver, helper to identify collision using neighbourhood matrix
* resource loader handler, to load necessary in game resources (only sounds for now)
* YTetris class, entry point for app. defines the pixi.js application and propagates the game loop to the game manager

## Setup

Clone the repository:

```bash
git clone https://github.com/phosforo/y-tetris.git
```
Install the (dev)dependencies:
```bash
npm install
```

## Development
Start the development server (with hot reloading enabled):

```bash
npm run dev
```
After the initial build, navigate to localhost:8080.

(Any changes you make to the source code files will automatically trigger a rebuild and reload the page.)

## Building

To build the application and optimise for production:
```bash
npm run build
```
This will copy all build artifacts to the dist/ folder.

## Know issues (BUGS)

* ~~Wrong left wall collision resolution~~
* ~~some block gets locked down incorrectly if left wall collision is failing~~
* ~~I block piece lock on board incorrectly if horizontally~~

## TODO's 

* ~~Add preview area for next block~~
* Add game states logic for [loading, welcome screen, game, end screen, credits]
* Add score area and logic. Introducing combos for multi lines etc
* Add welcome screen
* Add credits screen
* Add better sounds :)
* Add better assets
* Add some in game animations
* Add difficulty manager for speeding up drop rate