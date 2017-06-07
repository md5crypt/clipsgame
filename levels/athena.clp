(defrule pass-the-helmet
	?owner <- (helmet ?)
	?order <- (give-helmet ?to)
	=>
	(retract ?owner ?order)
	(assert (helmet ?to))
)

(defrule zeus-and-metis
	?fly <- (deity female metis)
	(deity male zeus)
	=>
	(retract ?fly)	; Zeus tricked her to transform
					; into a fly and then eat her
	(assert (headache zeus)) ; but it was too late!
)

(defrule birth-of-athena
	(deity male zeus)
	?pain <- (headache zeus)
	?wound <- (skull-cracked zeus)
	=>
	(retract ?pain ?wound)
	(assert
		(virgin athena)
		(deity female athena)
		(give-helmet athena) ; she jumped out of Zeus's
							 ; head fully armed
	)
)

(defrule take-vengeance
	(child ?father ?mother)
	?life <- (deity male ?father)
	(not (deity female ?mother))
	=>
	(retract ?life)
)

(defrule death-of-god
	?life <- (deity ? ?god)
	?wound <- (skull-cracked ?god)
	=>
	(retract ?life ?wound)
)

(defrule hephaestus-is-a-brute
	(deity male hephaestus)
	(deity ? ?god&~hephaestus)
	(not (helmet ?god))
	=>
	(assert (skull-cracked ?god))
)

(defrule ship-gods 
	(deity male ?father)
	(deity female ?mother)
	=>
	(assert (child ?father ?mother))
)

(defrule devirginize-goddess
	?status <- (virgin ?goddess)
	(or
		(child ? ?goddess)
		(not (deity female ?goddess))
	)
	=>
	(retract ?status)
)

(deffacts initial-facts
	(helmet nobody)
)