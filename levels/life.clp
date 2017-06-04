(defrule get-drunk
	?status <- (got-cash ?who)
	(person ?who)
	=>
	(retract ?status)
	(assert (drunk ?who))
)

(defrule die-in-accident
	?life <- (person ?who)
	(drunk ?who)
	(stressed ?who)
	=>
	(retract ?life)
)

(defrule sleep-it-out
	?status <- (drunk ?who)
	?action <- (sleep ?who)
	(person ?who)
	=>
	(retract ?action ?status)
)

(defrule get-cash
	?status <- (work ?who)
	(not (drunk ?who))
	(person ?who)
	=>
	(retract ?status)
	(assert 
		(got-cash ?who)
		(stressed ?who)
	)
)

(defrule cycle-of-life
	(person ?who)
	(not (work ?who))
	=>
	(assert 
		(sleep ?who)
		(work ?who)
	)
)