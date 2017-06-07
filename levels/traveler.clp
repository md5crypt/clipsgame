(defrule things-can-move
	?slot <- (contains ?place ?object)
	?move <- (move ?object)
	(connected ?place ?new-place)
	=>
	(retract ?slot ?move)
	(assert (contains ?new-place ?object))
)

; additional logic can be applied
; to fact patterns inside rules: '&' is and, 
; '|' is or and '~' is not. (color red|green)
; will match (color red) as well as (color green)
(defrule watchout-for-assassins
	(contains ?place assassin)
	?slot <- (contains ?place ?object&~assassin)
	=>
	(retract ?slot)
)

(deffacts initial-facts
	(contains forest traveler)
	(connected village inn)
	(connected inn village)
	(contains village assassin)
)