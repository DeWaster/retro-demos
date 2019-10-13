# Retro demos

## Why?

When I started working on my new portfolio site, I wanted to produce something... amazing. Pixi.js was a great choice because it allowed me to use power of WebGL, but still be able to fallback to canvas if necessary. These demos, however, were a little too much for my need. Especially performance weren't great at all. It would be a shame to just throw them away, so here they are.

## Demos

You can see the demos in action [here](https://dewasted.net/retro). Click to move to the next demo.

##### Vertical

80's vertical scrolling grid. Uses [this JSFiddle](https://jsfiddle.net/epistemex/2w2u1rLg/) to produce the grid.
Two parallax-levels and possibility to set X- and Y-speeds.

##### Starfield

Good old starfield. Each star shines differently.

##### Balls

Colored balls....

## Development

Install the dependencies and start the browser-sync server

```sh
npm install
npm run dev
```

now the demos should be accessible at http://localhost:3000

To produce production build

```sh
npm run build
```

## TODO (but probably never will)

- ~~Get rid of the awful and confusing gulp~~ DONE ✔
- Better performance
- Write more comments

## License

MIT
