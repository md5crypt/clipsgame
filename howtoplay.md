# How to play
Do you know what a [expert system](https://en.wikipedia.org/wiki/Expert_system) is? If so, I doubt you'll have to read this document. Just play the game, it should be quite intuitive even if you never seen the _clips_ language before.

## Facts
You play the game by stating (asserting) **facts**. A fact is any sequence of words written in brackets, i.e. `(tom is drunk)`. Once a fact is asserted, it is added to the **fact table**. The goal of each level is to add a specific fact (different in each level) to the fact table. To make the task non-trivial some facts are **restricted**, meaning that you can not assert them directly.

## Rules
Each level comes with a set of unchangeable if-then **rules**. Let's say the level's goal is to add `(tom calls taxi)` to the fact table, but the `(tom calls taxi)` fact is restricted. The level also defines the following rule:

```
if (tom in town) and (tom is drunk) then (tom calls taxi)
```

which in the _clips_ language would be written as:

```clips
(defrule some-name-for-this-rule
	(tom in town)
	(tom is drunk)
	=>
	(assert (tom calls taxi))
)
```

This rule will be **activated** when the facts `(tom in town)` and `(tom is drunk)` will be found in the fact table. It's activation will assert the fact `(tom calls taxi)`.

## Initial facts
Levels also usually define some **initial facts** that already are in the fact table when the game starts:

```clips
(deffacts inital-facts
	(tom is drunk)
)
```

## Patterns
A **pattern** is created by writing the `?` symbol inside a fact. For example `(tom is ?)` would match `(tom is drunk)` but also `(tom is happy)`. Facts with patterns can not be asserted, they only appear in rules.

Patterns can also be **named**. To explain named patterns take a look at the following example:

```clips
(defrule tom-drinks
	(tom drinks ?something)
	(has alcohol ?something)
	=>
	(assert (tom is drunk))
)
```

`?something` is an named pattern. To activate a rule named patterns with the same name have to have the same value. This means that the facts `(tom drinks spirytus-rektyfikowany)` and `(has alcohol spirytus-rektyfikowany)` would activate the rule `tom-drinks` but the facts `(tom drinks water)` and `(has alcohol spirytus-rektyfikowany)` would not.

## Retracting facts
A rule activation can result in not only a fact assertion but also a fact **retraction**. A retracted fact will be deleted from the fact table. Consider the following example:

```clips
(defrule tom-goes-bankrupt
	(has wife tom)
	?price-to-pay <- (has money tom)
	=>
	(retract ?price-to-pay)
)
```
The rule `tom-goes-bankrupt` will activate when Tom will have money and a wife. The fact 
`(has money tom)` in this example has been **named** `price-to-pay` (using the `<-` arrow). Thanks to that we can point to this fact in the `then` part of the rule (after the `=>`) and remove it from the fact table using the `retract` command.

A single rule can assert _and_ retract multiple facts in it's `then` part.

## I still need help
The official [Clips User's Guide](https://www.clipsrules.net/documentation/v642/ug642.pdf) will probably answer all your questions. You can read it for sheer entertainment. Here are some quotes if you don't believe me:

> One way of being organized is to keep a list. (Note: if you really want to impress people, show them a list of your lists.)

> Many situations occur in life where it's wise to do things in a systematic manner. That way, if your expectations don't work out you can try again systematically (such as the common algorithm for finding the Perfect Spouse by getting married over and over again).
