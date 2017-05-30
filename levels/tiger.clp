(deffacts initial-facts
	(is tiger animal)
	(is grass plant)
	(eats tiger animal)
	(eats plant light)
)

(defrule things-can-be-fed
	(is ?what eatable)
	(is ?what ?food)
	(eats ?target ?food)
	=>
	(assert (is ?target fed))
)