# Clips the Game
A logic game based on the [Clips rule engine](http://www.clipsrules.net/ ).

Play it here: https://md5crypt.github.io/clipsgame/

## How to play
https://md5crypt.github.io/clipsgame/#how-to-play

## Level structure
All level definition files and the level index file are located in the `levels` folder.

### Level index
The `index.json` file holds an single array of strings, corresponding with the names of level definition files. The order of array elements defines the level order.

### Level definitions
Each level consists of a `.json` file and a `.clp` file with the same name.

The `.clp` file simply holds the level's clips code.

The `.json` file has the following structure:
```json
{
	"title":"The Hungry Tiger",
	"description":"The tiger is hungry! You have to feed it!",
	"goalStr":"Add `(is tiger fed)` to the fact table using only one assertion.",
	"successStr":"The tiger thanks you!",
	"goal":"(is tiger fed)",
	"tabu":["(is tiger fed)"],
	"limit":1
}
```
where

* `title` is the level's name
* `description` is the level's plot description (in markdown)
* `goalStr` is the level's goal description (in markdown)
* `successStr` is the text that is added after _"level cleared!"_  (in markdown)
* `goal` is the goal fact
* `tabu` is a array of restricted facts. `?` can be used a wildcard, i.e. `(is ? fed)`
* `limit` is the amount of facts that can be asserted by the player. `-1` for no limit

## Clips emscripten build
No modifications have been made to the original code. No additional wrapper has been added. This is a 'raw' as-is build that exports all functions documented in the _clips advanced programing guide_.

### How to build
* download clips core [source](https://sourceforge.net/projects/clipsrules/files/CLIPS/6.30/)
* extract to `clips/source`
* run `make` in the `clips` folder

