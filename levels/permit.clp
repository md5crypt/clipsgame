(defrule window-a-1
	?window <- (goto window a-1)
	?coin <- (have currency coin) ; official processing fee
	=>
	(retract ?window ?coin)
	(assert
		(have form f-116)
		(have form f-117)
	)
)

(defrule window-a-34
	?window <- (goto window a-34)
	?document <- (have form f-116)
	=>
	(retract ?window ?document)
	(assert
		(have form g-4)
		(have form f-422)
	)
)

(defrule window-b-2
	?window <- (goto window b-2)
	?bribe <- (have souvenir cigars)
	?document-1 <- (have form f-117)
	?document-2 <- (have form g-4)
	=>
	(retract ?window ?bribe ?document-1 ?document-2)
	(assert
		(have form f-116)
		(have form f-422)
	)
)

(defrule window-b-5
	?window <- (goto window b-5)
	?bribe <- (have souvenir perfume)
	?document-1 <- (have form f-116)
	?document-2 <- (have form f-422)
	=>
	(retract ?window ?bribe ?document-1 ?document-2)
	(assert (have form g-1))
)

(defrule window-h-7
	?window <- (goto window h-7)
	?document-1 <- (have form f-117)
	?document-2 <- (have form g-1)
	=>
	(retract ?window ?document-1 ?document-2)
	(assert	(have document build-permit))
)

(defrule window-t-1
	?window <- (goto window t-1)
	?bribe <- (have souvenir vodka)
	?document <- (have form p-37)
	=>
	(retract ?window ?document ?bribe)
	(assert	(have currency coin)) ; tax return
)

; conveniently placed inside the town hall
(defrule souvenir-shop
	?action <- (gift-shop ?what)
	?coin <- (have currency coin)
	=>
	(retract ?action ?coin)
	(assert (have souvenir ?what))
)

; black market merchants accept only their untraceable currency
(defrule black-market-exchange-currency
	?action <- (exchange coin)
	?item <- (have currency coin)
	=>
	(retract ?action ?item)
	(assert (have currency black-coin))
)

(defrule black-market-sell
	?action <- (sell ?type&form|souvenir ?what)
	?item <- (have ?type ?what)
	=>
	(retract ?action ?item)
	(assert
		(market ?what)
		(have currency black-coin)
	)
)

(defrule black-market-buy
	?action <- (buy ?type&form|souvenir ?what)
	?item <- (market ?what)
	?coin <- (have currency black-coin)
	=>
	(retract ?action ?item ?coin)
	(assert (have ?type ?what))
)

(deffacts initial-facts
	(have currency coin)
	(have souvenir vodka) ; you've been here before
	(market p-37)
	(market cigars)
)