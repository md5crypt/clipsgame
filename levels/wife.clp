(defrule hunt-food
	(village has weapon)
	(male ?person)
	=>
	(assert (has ?person food))
)

(defrule find-mate
	(male ?man)
	(has ?man food)
	(female ?woman)
	(not (married ?woman to ?))
	=>
	(assert (married ?woman to ?man))
)

(defrule terrible-mistake
	(psychopath ?woman)
	(married ?woman to ?man)
	?corpse <- (male ?man)
	=>
	(retract ?corpse)
)

(deffacts initial-facts
	(female alice)
	(male bob)
	(male steve)
)