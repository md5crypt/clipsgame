# Clips the Game
A logic game based on the [Clips rule engine](http://www.clipsrules.net/ ).

Play it here: https://md5crypt.github.io/clipsgame/

## How to play
https://md5crypt.github.io/clipsgame/#how-to-play

## I CAN'T SOLVE IT AND IT DRIVES ME MAAAAD
contact me :D - borsuczek (at) gmail (dot) com

## Level structure
* adding levels does not require rebuilding the application
* level definition files are located in the `levels` folder
* `levels/index.json` holds a list of available levels, The order of elements defines the level order
* for each level two files should exist
  * `<name>.clp` file with the level's clips code
  * `<name>.json` file with the level's definition (see below)

### Level definition files

```typescript
export interface LevelDefinition {
	/** title displayed in the header */
	title: string

	/** description / flavor text, markdown enabled */
	description: string

	/** goal description, markdown enabled, markdown enabled */
	goalDescription: string

	/** message displayed after completing the level, markdown enabled */
	winMessage: string

	/**
	 * the fact / facts needed to complete the game
	 * facts need to be given with ( ) and exactly one space
	 * between words
	 */
	goal: string | string[]

	/**
	 * array of restricted facts
	 * - facts need to be given with ( ) and exactly one space
	 * between words
	 * - ? can be used instead of a word to match all words
	 * - | can be used to create word union
	 * example: (foo bar|baz)
	 */
	tabu?: string[]

	/** amount of allowed assertions, omit or set to -1 for not restriction */
	limit?: number
}
```

## Building from source

### Web app

```bash
npm install
npm run build
```

To start the local dev servers

```bash
npm start
```


### CLIPS wasm bundle

Make sure emscripten is installed and:

```bash
cd clips
./build.sh
```

Note that:
* build set up to work with emsdk 4.0.13
  * using older version will not work due to use of custom syscall wrappers
  * using newer version might not work for the same reasons but results can vary
* CLIPS source code link in `build.sh` might be broken
