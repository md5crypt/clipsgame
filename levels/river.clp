(defrule boat-can-be-loaded
	?action <- (load ?what)
	?item <- (has ?place ?what)
	(has ?place boat)
	(not (has boat ?)) ; only one thing can be on the boat!
	=>
	(retract ?action ?item)
	(assert (has boat ?what))
)

(defrule boat-can-be-unloaded
	?action <- (unload)
	?item <- (has boat ?what)
	(has ?place boat)
	=>
	(retract ?action ?item)
	(assert (has ?place ?what))
)

(defrule boat-can-move
	?move <- (swim ?place)
	?boat <- (has ? boat)
	=>
	(retract ?boat ?move)
	(assert	(has ?place boat))
)

(defrule unsupervised-animals-misbehave
	(has ?place ?predator)
	?meal <- (has ?place ?prey)
	(eats ?predator ?prey)
	(not (has ?place boat)) ; the farmer has to not be there
	=>
	(retract ?meal)
)

(deffacts initial-facts
	(eats wolf goat)
	(eats goat cabbage)
	(has forest boat)
	(has forest wolf)
	(has forest goat)
	(has forest cabbage)
)