(defrule weapon-wins	
	(weapon ?item)
	(range ?item ?type)
	(distance ?type)
	=>
	(assert (wins ?item))
)

(defrule battle
	(warrior ?person)
	(has ?person ?weapon)
	(wins ?weapon)
	=>
	(assert (wins ?person))
)

(deffacts inital-facts
	(warrior harry)
	(has harry bow)
	(weapon bow)
	(range bow large)
	(distance small)
)