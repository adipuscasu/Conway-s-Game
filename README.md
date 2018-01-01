# Conway's Game of Life

A typescript project, that displays  a finite two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead. Every cell interacts with its eight neighbours, which are the cells that are directly horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

- Any live cell with fewer than two live neighbours dies (referred to as underpopulation or exposure).
- Any live cell with more than three live neighbours dies (referred to as overpopulation or overcrowding).
- Any live cell with two or three live neighbours lives, unchanged, to the next generation.
- Any dead cell with exactly three live neighbours will come to life.

The initial pattern constitutes the 'seed' of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed — births and deaths happen simultaneously, and the discrete moment at which this happens is sometimes called a tick. (In other words, each generation is a pure function of the one before.) The rules continue to be applied repeatedly to create further generations..

## Links

- Source: 
- Bugs:
- Documentation: [http://www.conwaylife.com/w/index.php?title=Conway%27s_Game_of_Life](http://www.conwaylife.com/w/index.php?title=Conway%27s_Game_of_Life)
- Live application: [https://adipuscasu.github.io/Conway-s-Game/app/](https://adipuscasu.github.io/Conway-s-Game/app/)

## Project Setup

This project uses [gulp](http://gulpjs.com/) as its build system. 

- Install gulp: `$ npm install -g gulp`

1. Install dependencies: `$ npm install`
2. Build and run: `$ gulp buildrun`


## Testing

This project usings [mocha](http://visionmedia.github.io/mocha/) for unit testing. Install mocha:

- `$ npm install -g mocha`

To compile and test run:

-  `$ gulp && mocha`

## Troubleshooting & Useful Tools

_Examples of common tasks_

> e.g.
> 
> - How to make curl requests while authenticated via oauth.
> - How to monitor background jobs.
> - How to run the app through a proxy.

## License

MIT
