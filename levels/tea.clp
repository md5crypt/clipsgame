(defrule boston-tea-party
	; they dumped the tea into the sea!
	?ship <- (ship ?name boston)
	?route <- (route london boston)
	(cargo ?name tea)
	=>
	(retract ?ship ?route)
	(assert (route hong-kong boston))
)

(defrule set-sail
	?anchor <- (ship ?name ?location)
	?command <- (sail ?name ?destenation)
	(route ?location ?destenation)
	=>
	(retract ?anchor ?command)
	(assert (ship ?name ?destenation))
)

(defrule unload-cargo
	(ship ?name ?location)
	(cargo ?name ?type)
	=>
	(assert (stock ?location ?type))
)

(defrule load-cargo
	(ship ?name ?location)
	(stock ?location ?type)
	=>
	(assert (cargo ?name ?type))
)

(defrule opium-war
	; because East India Company was evil
	(stock hong-kong opium)
	?route <- (route hong-kong ?)
	=>
	(retract ?route)
)

(deffacts  initial-facts
	(ship flying-cloud london)
	(ship hornet london)
	(ship sea-witch hong-kong)
	(route boston hong-kong)
	(route boston london)
	(route london boston)
	(route london hong-kong)
	(route hong-kong london)
	(stock hong-kong tea)
	(stock london opium)
	(stock boston cotton)
)