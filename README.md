# pai2022l

Zaliczamy przez prezentację zdalną na Teams - udostępniacie mi ekran i klikacie wg moich poleceń.

### na ocenę 3

W widoku audyt wyświetlić dane zawierające unikalnych klientów (kupujących) z faktur, wraz z liczbą dokumentów z nimi związanych (w zapytaniu użyć COUNT(*) i GROUP BY client). Przenieść tam mechanizm filtrowania przez nazwę ("lupka") z widoku Dokumenty. Nie implementować stronicowania.

### na ocenę 4

Kupującego w widoku Faktura określa się nie w sposób swobodny, a wybiera się z tabeli clients (id integer primary key autoincrement, client text). Nowy widok, dostępny dla roli U, pozwala na dodawanie nowych klientów i usuwanie istniejących. W tabeli invoices pole client text zostaje zastąpione przez clientid integer (klucz obcy do tabeli clients).

### na ocenę 5

Widok Audyt odświeża się automatycznie przy zapisaniu nowej faktury bądź modyfikacji tabeli klientów (wskazówka: wykorzystać projekt https://gitlab.com/mariusz.jarocki/websockets ).