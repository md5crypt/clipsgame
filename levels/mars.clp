; drill into the ice cap and extract a small chunk
(defrule collect-sample
	?action <- (drill)
	(location planum-boreum) ; sampling site
	=>
	(retract ?action)
	(assert (sample))
)

; rover's peltier cooler got damaged during landing
(defrule sample-is-melting
	(sample)
	(move ?)
	=>
	(assert (melting))
)

(defrule melting-phase-1
	?melting <- (melting)
	(not (melting 1))
	=>
	(retract ?melting)
	(assert (melting 1))
)

(defrule melting-phase-2
	?melting <- (melting)
	(not (melting 2))
	=>
	(retract ?melting)
	(assert (melting 2))
)

(defrule melting-phase-3
	?melting <- (melting)
	(not (melting 3))
	=>
	(retract ?melting)
	(assert (melting 3))
)

(defrule set-sample-melted
	(melting 1)
	(melting 2)
	(melting 3)
	=>
	(assert (melted))
)

; risk of loosing the rover on a uncharted path is too high
(defrule follow-path
	?current <- (location ?from)
	?move <- (move ?direction)
	(path ?from ?direction ?to)
	=>
	(retract ?current ?move)
	(assert (location ?to))
)

; melted sample will fail to transfer to the analysis apparatus
(defrule fail-on-melted-sample
	(location vastitas-borealis)
	?sample <- (sample)
	?state <- (melted)
	=>
	(retract ?sample ?state)
)

(deffacts initial-facts
	(location vastitas-borealis) ; lander is here

	; known paths below
	(path vastitas-borealis NE scandia-cavi)
	(path vastitas-borealis SE chasma-boreale)
	(path scandia-cavi SW vastitas-borealis)
	(path scandia-cavi E olympia-planum)
	(path chasma-boreale NW vastitas-borealis)
	(path chasma-boreale N scandia-cavi)
	(path olympia-planum S gemini-lingula)
	(path olympia-planum SE planum-boreum)
	(path gemini-lingula NW scandia-cavi)
	(path gemini-lingula E chasma-boreale)
	(path planum-boreum NW olympia-planum)
	(path planum-boreum SW gemini-lingula)
)
